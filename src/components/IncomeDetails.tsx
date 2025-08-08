import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Footer from "./Footer";
import Header from "./Header";
import Aside from "./Sidebar";
import FillterIcon from "../assets/images/fillter-icon.png";
import NotificationModal from "./NotificationModal";
import profPic from "../assets/images/profpic.png";
import pickupIcon from "../assets/images/pickup-icon.png";
import DropOffIcon from "../assets/images/drop-icon-2.png";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
const drivers = [
  {
    name: "Ivan Smith",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Pending",
    rating: 4.9,
    rides: 499,
    status: "Online",
  },
  {
    name: "Darrell Steward",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Pending",
    rating: 4.9,
    rides: 499,
    status: "Offline",
  },
  {
    name: "Brooklyn Simmons",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Done",
    rating: 4.9,
    rides: 499,
    status: "Online",
  },
  {
    name: "Annette Black",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Done",
    rating: 4.9,
    rides: 499,
    status: "Offline",
  },
  {
    name: "Cody Fisher",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Done",
    rating: 4.9,
    rides: 499,
    status: "Online",
  },
  {
    name: "Savannah Nguyen",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Done",
    rating: 4.9,
    rides: 499,
    status: "Offline",
  },
  {
    name: "Jane Cooper",
    car: "Mercedes-Benz",
    vin: "123 4 5678 9321 1234 45",
    payment: "Done",
    rating: 4.9,
    rides: 499,
    status: "Online",
  },
];

const IncomeDetails = () => {
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

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div style={{ marginLeft: "320px" }}>
        <button
          className="btn btn-outline-dark rounded-circle d-flex justify-content-center align-items-center bg-white"
          style={{ width: "42px", height: "42px" }}
          onClick={handleBack}
        >
          <BsArrowLeft size={20} />
        </button>
      </div>
      <div
        className="container-sm p-4"
        style={{ marginLeft: "300px", maxWidth: "1200px" }}
      >
        <div className="d-flex justify-content-end align-items-center mb-4">
          <div className="input-group searchField w-25">
            <input type="text" className="form-control" placeholder="Search" />
            <span className="input-group-text">
              <FaSearch />
            </span>
          </div>
          <div className="search-filter">
            <a onClick={() => setShowModal(true)}>
              <img src={FillterIcon} />
            </a>
          </div>
          <NotificationModal
            show={showModal}
            handleClose={() => setShowModal(false)}
          />
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col" style={{ backgroundColor: "#EAF3FF" }}>
                  <p className="colorofall">User Name</p>
                </th>
                <th scope="col" style={{ backgroundColor: "#EAF3FF" }}>
                  <p className="colorofall">Pickup Location</p>
                </th>
                <th scope="col" style={{ backgroundColor: "#EAF3FF" }}>
                  <p className="colorofall">Drop Off Location</p>
                </th>
                <th scope="col" style={{ backgroundColor: "#EAF3FF" }}>
                  <p className="colorofall">Cost</p>
                </th>
                <th scope="col" style={{ backgroundColor: "#EAF3FF" }}>
                  <p className="colorofall">Date</p>
                </th>
                <th scope="col" style={{ backgroundColor: "#EAF3FF" }}>
                  <span className="colorofall">Total Time Spent</span>
                </th>
                <th scope="col" style={{ backgroundColor: "#EAF3FF" }}>
                  <p className="colorofall">Status</p>
                </th>
                <th scope="col" style={{ backgroundColor: "#EAF3FF" }}>
                  <p className="colorofall">Booking Status</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, index) => (
                <tr key={index}>
                  <td style={{ backgroundColor: "#EAF3FF" }}>
                    <div className="d-flex track-btn2">
                      <img
                        src={profPic}
                        alt=""
                        className="rounded-circle me-2"
                        width="30"
                        height="30"
                      />
                      <p className="colorofall td_date mb-0"> {driver.name}</p>
                    </div>
                  </td>
                  <td style={{ backgroundColor: "#EAF3FF" }}>
                    <div className="d-flex mb-0">
                      <img
                        src={pickupIcon}
                        className="text-warning me-1 mt-1"
                        width={12}
                        height={12}
                      />
                      <div className="d-flex flex-column align-items-start td_date">
                        <span className="colorofall small income-name fw-semibold">
                          Pickup Location
                        </span>

                        <span className="colorofall mb-0 income-name fs-7 fw-semibold text-start">
                          2972 Westheimer Rd. Santa Ana, CA 85486{" "}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ backgroundColor: "#EAF3FF" }}>
                    <div className="d-flex mb-0">
                      <img
                        src={DropOffIcon}
                        className="text-warning me-1 mt-1"
                        width={18}
                        height={20}
                      />
                      <div className="d-flex flex-column align-items-start td_date">
                        <span className="colorofall small income-name fw-semibold">
                          Drop Off Location
                        </span>

                        <span className="colorofall mb-0 income-name fs-7 fw-semibold text-start">
                          1901 Thornridge Cir. Shiloh, Hawaii 81063
                        </span>
                      </div>
                    </div>
                  </td>

                  <td style={{ backgroundColor: "#EAF3FF" }}>
                    {" "}
                    <p className="colorofall td_date mb-0"> $80.00</p>
                  </td>
                  <td style={{ backgroundColor: "#EAF3FF" }}>
                    <p className="colorofall td_date mb-0"> Oct 14 2022</p>
                  </td>
                  <td style={{ backgroundColor: "#EAF3FF" }}>
                    <p className="colorofall td_date mb-0"> 1h 20min </p>
                  </td>
                  <td style={{ backgroundColor: "#EAF3FF" }}>
                    <p className="colorofall td_date mb-0">Completed</p>
                  </td>

                  <td style={{ backgroundColor: "#EAF3FF" }}>
                    <p className="colorofall td_date mb-0"> Schedule</p>
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

export default IncomeDetails;
