import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Aside from "./components/Sidebar";
import profPic from "./assets/images/profpic.png";
import { apiHelper } from "../src/services/index";
import { useTranslation } from "react-i18next";

const Request = () => {
  const { t } = useTranslation();
  const [drivers, setDrivers] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1200);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSeeProfile = (driver) => {
    navigate("/request-profile", {
      state: {
        ...driver.original,
        driverData: driver.original.driverId,
      },
    });
  };

  const fetchDrivers = async () => {
    try {
      const { response } = await apiHelper("GET", "vendor/get-driver-requests");

      if (response?.data?.status === 1) {
        const mappedDrivers = response.data.data.map((item) => ({
          name: item.driverId?.fullName || t("request.driverNotAssigned"),
          date: moment(item.createdAt).format("YYYY-MM-DD HH:mm"),
          status: item.status || "N/A",
          original: item,
        }));
        setDrivers(mappedDrivers);
      } else {
        toast.error(response?.data?.message || t("request.fetchError"));
        setDrivers([]);
      }
    } catch (err) {
      toast.error(t("request.somethingWentWrong"));
      console.error("Fetch error:", err);
      setDrivers([]);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        headingText={t("request.driverRequests")}
        showBackButton={true}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="content_section">
        <div className="table-responsive">
          <table className="table table-hover custom-driver-table">
            <thead>
              <tr>
                <th>
                  <p className="colorofall text-start">
                    {t("request.driverName")}
                  </p>
                </th>
                <th>
                  <p className="colorofall text-start">{t("request.date")}</p>
                </th>
                <th>
                  <p className="colorofall text-start">{t("request.status")}</p>
                </th>
                <th>
                  <p className="colorofall text-center">
                    {t("request.action")}
                  </p>
                </th>
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
                        {t("request.viewDetails")}
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    {t("request.noDriverRequests")}
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
