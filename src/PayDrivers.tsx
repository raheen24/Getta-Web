import { useState, useEffect } from "react";
import { FaSearch, FaStar } from "react-icons/fa";
import Footer from "./components/Footer";
import Header from "./components/Header";
import FillterIcon from "./assets/images/fillter-icon.png";
import NotificationModal from "./components/NotificationModal";
import profPic from "./assets/images/profpic.png";
import { useNavigate } from "react-router-dom";
import Aside from "./components/Sidebar";
import { apiHelper } from "../src/services/index";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const PayDrives = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { t } = useTranslation();
  const navigate = useNavigate();

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
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchDrivers = async () => {
    try {
      const { response } = await apiHelper("GET", "vendor/get-payments-detail");

      if (response?.data?.status === 1) {
        const mappedDrivers = response.data.data.map((item: any) => {
          const driver = item.driver || {};
          return {
            _id: driver._id,
            name: driver.fullName || "N/A",
            car: item.vehicle?.carType || "N/A",
            vin: item.vehicle?.vehicleIdentificationNumber || "N/A",
            payment: item.paymentStatus || "N/A",
            rating: driver.averageReview ?? "N/A",
            rides: item.totalCompletedRides || 0,
            status: driver.isBlocked
              ? "Blocked"
              : driver.isRide
              ? "Online"
              : "Offline",
            image: driver.image || profPic,
          };
        });
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
  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
          <div className="d-flex w-100 justify-content-between align-items-center mb-3">
            <div>
             <p className="mb-0">
                {t("payDrives.listDrivers")}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="searchField">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
                <FaSearch />
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
        <hr style={{ borderTop: "1px solid #000" }} />

        <div className="table-responsive">
          <table className="table table-hover custom-driver-table">
            <thead>
              <tr>
                <th>{t("payDrives.driverName")}</th>
                <th>{t("payDrives.carType")}</th>
                <th>{t("payDrives.vinNo")}</th>
                <th>{t("payDrives.reviews")}</th>
                <th>{t("payDrives.totalRides")}</th>
                <th>{t("payDrives.payment")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDrivers.length > 0 ? (
                paginatedDrivers.map((driver, index) => (
                  <tr className="table-row" key={index}>
                    <td>
                      <div className="d-flex track-btn2">
                        <img
                          src={driver.image}
                          alt={driver.name}
                          className="rounded-circle me-2"
                          width="30"
                          height="30"
                        />
                        <p className="colorofall td_date mb-0">{driver.name}</p>
                      </div>
                    </td>
                    <td>
                      <p className="colorofall td_date mb-0">{driver.car}</p>
                    </td>
                    <td>
                      <p className="colorofall td_date mb-0">{driver.vin}</p>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaStar className="text-warning me-1" />
                        <p className="colorofall td_date mb-0">
                          {driver.rating}
                        </p>
                      </div>
                    </td>
                    <td>
                      <p className="colorofall td_date mb-0">{driver.rides}</p>
                    </td>
                    <td
                      className="cursor-pointer"
                      style={{
                        color: driver.payment === "Paid" ? "green" : "red",
                        cursor: "pointer",
                      }}
                      onClick={
                        () =>
                          driver.payment === "Paid"
                            ? navigate(`/paid-details/${driver._id}`)
                            : navigate(`/payment/${driver._id}`)
                      }
                    >
                      <p className="colorofall td_date mb-0">
                        {driver.payment}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No drivers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-end mt-3">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1
                        ? "bg-success text-white rounded"
                        : ""
                    }`}
                    onClick={() => handlePageClick(i + 1)}
                    style={{ cursor: "pointer" }}
                  >
                    <a
                      className={`page-link ${
                        currentPage === i + 1 ? "text-white" : ""
                      }`}
                      href="#!"
                    >
                      {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PayDrives;
