import { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import profPic from "../assets/images/profpic.png";
import { FaSearch } from "react-icons/fa";
import FillterIcon from "../assets/images/fillter-icon.png";
import NotificationModal from "./NotificationModal";
import pickupIcon from "../assets/images/pickup-icon.png";
import DropOffIcon from "../assets/images/drop-icon-2.png";
import { useNavigate } from "react-router-dom";

import Aside from "./Sidebar";
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

const PaidDetails = () => {
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
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate("/rider-tracking");
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
        headingText="Payment Details"
        showBackButton={true}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content_section">
        {/* <div className="back-btn-sec mb-3 d-flex align-items-center">
          <button onClick={goBack} className="back-btn">
            <img src={arrowBack} alt="Back" />
          </button>
          <h5 className="back-title">Details</h5>
        </div> */}
        <div className="d-flex justify-content-end align-items-center mb-4">
          <div className="d-flex w-100 justify-content-between align-items-center mb-3">
            <div className="d-flex track-btn2">
              <a className="colorofall td_date mb-0 text-decoration-none">
                Status: Paid
              </a>
            </div>
            <div></div>
            <div className="d-flex align-items-center gap-2">
              <div className="input-group searchField">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                />
                <span className="input-group-text">
                  <FaSearch />
                </span>
              </div>

              <div className="search-filter ms-2">
                <a onClick={() => setShowModal(true)} role="button">
                  <img src={FillterIcon} alt="Filter" />
                </a>
              </div>
            </div>
          </div>
          <NotificationModal
            show={showModal}
            handleClose={() => setShowModal(false)}
          />
        </div>

        <div className="table-responsive custom-driver-table-wrapper">
          <table className="table table-hover custom-driver-table">
            <thead>
              <tr>
                {[
                  "User Name",
                  "Pickup Location",
                  "Drop Off Location",
                  "Cost",
                  "Date",
                  "Status",
                  "Booking Status",
                ].map((title, idx) => (
                  <th key={idx} scope="col" className="table-header">
                    <p className="colorofall mb-0">{title}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, index) => (
                <tr
                  key={index}
                  onClick={handleRowClick}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={profPic}
                        alt="Profile"
                        className="rounded-circle me-2"
                        width="30"
                        height="30"
                      />
                      <p className="colorofall td_date mb-0">{driver.name}</p>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex">
                      <img
                        src={pickupIcon}
                        alt="Pickup"
                        className="me-2 mt-1"
                        width={12}
                        height={12}
                      />
                      <div className="d-flex flex-column align-items-start td_date">
                        <span className="colorofall small income-name fw-semibold">
                          Pickup Location
                        </span>
                        <span className="colorofall income-name fs-7 fw-semibold text-start">
                          2972 Westheimer Rd. Santa Ana, CA 85486
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex">
                      <img
                        src={DropOffIcon}
                        alt="Dropoff"
                        className="me-2 mt-1"
                        width={18}
                        height={20}
                      />
                      <div className="d-flex flex-column align-items-start td_date">
                        <span className="colorofall small income-name fw-semibold">
                          Drop Off Location
                        </span>
                        <span className="colorofall income-name fs-7 fw-semibold text-start">
                          1901 Thornridge Cir. Shiloh, Hawaii 81063
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="colorofall td_date mb-0 fs-6 fw-semibold">
                      $1120.00
                    </p>
                  </td>
                  <td>
                    <p className="colorofall td_date mb-0 fs-6 fw-semibold">
                      Oct 16 2022
                    </p>
                  </td>
                  <td>
                    <p className="colorofall td_date mb-0 fs-6 fw-semibold">
                      Completed
                    </p>
                  </td>
                  <td>
                    <p className="colorofall td_date mb-0 fs-6 fw-semibold">
                      Schedule
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Outside Table */}
          <div className="d-flex justify-content-end mt-3">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                {[1, 2, 3, 4].map((num) => (
                  <li key={num} className="page-item">
                    <a className="page-link" href="#">
                      {num}
                    </a>
                  </li>
                ))}
                <li className="page-item">
                  <a className="page-link" href="#">
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaidDetails;
