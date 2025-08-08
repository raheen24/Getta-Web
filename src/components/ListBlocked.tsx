import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import Footer from "./Footer";
import Header from "./Header";
import Aside from "./Sidebar";
import { apiHelper } from "../../src/services/index";
import arrowBack from "../assets/images/arrow_back.png";
import profPic from "../assets/images/profpic.png";

interface Driver {
  _id: string;
  fullName: string;
  image?: string;
  email?: string;
  totalRides?: number;
  createdAt: string;
}

interface MappedDriver {
  name: string;
  image: string;
  email: string;
  createdAt: string;
  totalRides: number;
  rating: string;
  carType: string;
  vin: string;
  payment: string;
  _id: string; // Adding _id here for identifying the driver
}

const ListBlocked: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1200) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Call on initial render
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [drivers, setDrivers] = useState<MappedDriver[]>([]);
  const [driverToUnblock, setDriverToUnblock] = useState<MappedDriver | null>(
    null
  );
  const navigate = useNavigate();

  const fetchDrivers = async () => {
    try {
      const { response } = await apiHelper(
        "GET",
        "/vendor/get-blocked-drivers"
      );

      if (response?.data?.status === 1) {
        const mappedDrivers: MappedDriver[] = response.data.data.map(
          (driver: Driver) => ({
            name: driver.fullName || "N/A",
            image: driver.image
              ? driver.image.replace("uploads\\", "/uploads/")
              : profPic,
            email: driver.email || "N/A",
            createdAt: moment(driver.createdAt).format("YYYY-MM-DD HH:mm"),
            totalRides: driver.totalRides || 0,
            rating: driver.points ? driver.points.toString() : "N/A",
            carType: driver.carType || "N/A",
            vin: driver.vin || "N/A",
            payment: driver.isPayment ? "Paid" : "Pending",
            _id: driver._id, // Including _id for identification
          })
        );
        setDrivers(mappedDrivers);
      } else {
        toast.error(response?.data?.message || "Failed to fetch drivers.");
        setDrivers([]);
      }
    } catch (err) {
      toast.error("Something went wrong while fetching drivers.");
      console.error("Fetch error:", err);
      setDrivers([]);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const handleUnblock = async (driver: MappedDriver) => {
    setDriverToUnblock(driver);

    try {
      const apiEndpoint = "/vendor/toggle-driver"; // The API endpoint to toggle block status
      const payload = {
        driverId: driver._id, // Pass the driver ID to unblock
      };

      const { response, error } = await apiHelper(
        "POST",
        apiEndpoint,
        {},
        payload
      );

      if (error) {
        toast.error(error || "Something went wrong.");
        return;
      }

      if (response?.data?.status === 1) {
        toast.success(response?.data?.message || "Action successful");

        setDrivers(
          (prev) => prev.filter((d) => d._id !== driver._id) // Remove the unblocked driver from the list
        );
      } else {
        toast.error(response?.data?.message || "Action failed");
      }
    } catch (err) {
      console.error("Unblock error:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        headingText="Blocked Drivers"
        showBackButton={true}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <section className="content_section">
        <div className="table-responsive">
          <table className="table table-hover custom-driver-table">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Car Type</th>
                <th>VIN No</th>
                <th>Payment</th>
                <th>Review</th>
                <th>Total Rides</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver._id}>
                  <td>
                    <div className="track-btn2">
                      <img
                        src={driver.image}
                        alt="profile"
                        className="rounded-circle me-2"
                        width="30"
                        height="30"
                      />
                      <p className="colorofall td_date mb-0">{driver.name}</p>
                    </div>
                  </td>
                  <td>
                    <p className="colorofall td_date mb-0 text-center">
                      {driver.carType}
                    </p>
                  </td>
                  <td>
                    <p className="colorofall td_date mb-0 text-center">
                      {driver.vin}
                    </p>
                  </td>
                  <td>
                    <p className="colorofall td_date mb-0 text-center">
                      {driver.payment}
                    </p>
                  </td>
                  <td>
                    <div className="d-flex mb-0">
                      <FaStar className="text-warning me-1 mt-1" />
                      <p className="colorofall td_date mb-0 text-center">
                        {driver.rating}
                      </p>
                    </div>
                  </td>
                  <td>
                    <p className="colorofall td_date mb-0 text-center">
                      {driver.totalRides}
                    </p>
                  </td>
                  <td>
                    <a
                      onClick={() => handleUnblock(driver)}
                      className="text-decoration-none colorofall td_date text-start"
                      role="button"
                    >
                      Unblock
                    </a>
                  </td>
                </tr>
              ))}
              {drivers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    No blocked drivers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default ListBlocked;
