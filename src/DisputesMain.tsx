import Footer from "./components/Footer";
import Header from "./components/Header";
import profPic from "./assets/images/profpic.png";
import incomeArrowDown from "./assets/images/date-table-icon.png";
import ClockIcon from "./assets/images/time-icom.png";
import { useNavigate } from "react-router-dom";
import NotificationModal from "./components/NotificationModal";
import Aside from "./components/Sidebar";
import React, { useState, useEffect } from "react";
const drivers = [
  {
    name: "Admin",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Pending",
    rating: 4.9,
    rides: 499,
    status: "Online",
  },
  {
    name: "Admin",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Pending",
    rating: 4.9,
    rides: 499,
    status: "Offline",
  },
  {
    name: "Admin",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Done",
    rating: 4.9,
    rides: 499,
    status: "Online",
  },
  {
    name: "Admin",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Done",
    rating: 4.9,
    rides: 499,
    status: "Offline",
  },
  {
    name: "Admin",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Done",
    rating: 4.9,
    rides: 499,
    status: "Online",
  },
];

const DisputesMain = () => {
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
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate("/disputes-details");
  };
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content_section">
        <div className="d-flex justify-content-end align-items-center mb-4">
          <div className="d-flex w-100 justify-content-end align-items-center mb-3">
            <div className="d-flex gap-3">
              <a
                className="track-btn text-decoration-none"
                href="/disputes-tabs"
              >
                Approved
              </a>
              <a
                className="track-btn text-decoration-none"
                href="/disputes-tabs"
              >
                Reject
              </a>
              <a
                className="track-btn text-decoration-none"
                href="/disputes-tabs"
              >
                Pending
              </a>
            </div>
          </div>
          <NotificationModal
            show={showModal}
            handleClose={() => setShowModal(false)}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover custom-driver-table">
            <tbody>
              {drivers.map((driver) => (
                <tr
                  onClick={handleRowClick}
                  className="driver-row"
                  key={driver.vin}
                >
                  <td>
                    <img
                      src={profPic}
                      alt=""
                      className="rounded-circle me-2"
                      width="40"
                      height="40"
                    />
                  </td>

                  <td>
                    <div className="d-flex track-btn2">
                      <div className="d-flex flex-column align-items-start td_date">
                        <p className="colorofall td_date mb-0 text-nowrap fw-bold text-decoration-none">
                          Driver Name
                        </p>
                        <span className="colorofall mb-0 income-name text-nowrap">
                          {driver.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="d-flex flex-column align-items-start td_date">
                      <span className="text-start small colorofall income-name">
                        Car: {driver.car} | VIN: {driver.vin}
                      </span>
                    </div>
                  </td>

                  <td>
                    <p className="colorofall td_date mb-0 text-nowrap">
                      <img
                        src={ClockIcon}
                        alt=""
                        className="me-2"
                        width="16"
                        height="16"
                      />
                      Status: {driver.status}
                    </p>
                  </td>

                  <td>
                    <p className="colorofall td_date mb-0 text-nowrap">
                      <img
                        src={incomeArrowDown}
                        alt=""
                        className="me-2"
                        width="16"
                        height="16"
                      />
                      Payment Status: {driver.payment}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DisputesMain;
