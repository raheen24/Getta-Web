import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Aside from "./components/Sidebar";
import profPic from "./assets/images/profpic.png";
import { apiHelper } from "../src/services/index";

const Request = () => {
  const [drivers, setDrivers] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1200);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Go to profile page
  const handleSeeProfile = (driver) => {
    navigate("/request-profile", {
      state: {
        ...driver.original,
        driverData: driver.original.driverId, // send full driver object
      },
    });
  };

  // Fetch driver requests
  const fetchDrivers = async () => {
    try {
      const { response } = await apiHelper("GET", "vendor/get-driver-requests");

      if (response?.data?.status === 1) {
        const mappedDrivers = response.data.data.map((item) => ({
          name: item.driverId?.fullName || "Driver Not Assigned",
          date: moment(item.createdAt).format("YYYY-MM-DD HH:mm"),
          status: item.status || "N/A",
          original: item,
        }));
        setDrivers(mappedDrivers);
      } else {
        toast.error(response?.data?.message || "Failed to fetch driver requests.");
        setDrivers([]);
      }
    } catch (err) {
      toast.error("Something went wrong while fetching driver requests.");
      console.error("Fetch error:", err);
      setDrivers([]);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className={`bg-mains ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="content_section">
        <div className="table-responsive">
          <table className="table table-hover custom-driver-table">
            <thead>
              <tr>
                <th><p className="colorofall text-start">Driver Name</p></th>
                <th><p className="colorofall text-start">Date</p></th>
                <th><p className="colorofall text-start">Status</p></th>
                <th><p className="colorofall text-center">Action</p></th>
              </tr>
            </thead>
            <tbody>
              {drivers.length > 0 ? (
                drivers.map((driver, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex track-btn2 align-items-center">
                        <img
                          src={profPic}
                          alt="Driver"
                          className="rounded-circle me-2"
                          width="30"
                          height="30"
                        />
                        <p className="colorofall td_date mb-0">{driver.name}</p>
                      </div>
                    </td>
                    <td>
                      <p className="colorofall td_date mb-0 text-start">
                        {driver.date}
                      </p>
                    </td>
                    <td>
                      <p className="colorofall td_date mb-0 text-start">
                        {driver.status}
                      </p>
                    </td>
                    <td>
                      <a
                        href="#"
                        className="text-decoration-none colorofall td_date text-start"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSeeProfile(driver);
                        }}
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    No driver requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Request;
