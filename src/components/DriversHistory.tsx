import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import profPic from "../assets/images/profpic.png";
import { FaSearch } from "react-icons/fa";
import FillterIcon from "../assets/images/fillter-icon.png";
import NotificationModal from "./NotificationModal";
import MonthNavigator from "./MonthNavigator";
import pickupIcon from "../assets/images/pickup-icon.png";
import DropOffIcon from "../assets/images/drop-icon-2.png";
import { useNavigate, useParams } from "react-router-dom";
import Aside from "./Sidebar";
import { apiHelper } from "../services/index";
import { useTranslation } from "react-i18next";

interface DriverHistory {
  userName: string;
  userImage?: string;
  pickupLocation: string;
  dropOffLocation: string;
  cost: string;
  date: string;
  status: string;
  bookingStatus: string;
}

const DriverHistory = () => {
  const { driverId } = useParams();
  const { t } = useTranslation();
  const [driverHistory, setDriverHistory] = useState<DriverHistory[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [month, setMonth] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [driverProfile, setDriverProfile] = useState<{
    name: string;
    image?: string;
  }>({ name: "", image: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleRowClick = (rideId: string) => {
    console.log("Navigating to rideId:", rideId);
    if (rideId) {
      navigate(`/rider-tracking/${rideId}`);
    } else {
      console.error("Invalid rideId:", rideId);
    }
  };

  // Update month and current date based on selectedDate
  useEffect(() => {
    setMonth(
      selectedDate.toLocaleString("default", { month: "long", year: "numeric" })
    );
    setCurrentDate(selectedDate.getDate().toString().padStart(2, "0"));
  }, [selectedDate]);

  // Fetch driver history when driverId changes
  useEffect(() => {
    const fetchDriverHistory = async () => {
      setLoading(true); // Start loading
      try {
        const { response } = await apiHelper(
          "GET",
          `/vendor/get-driver-history/${driverId}`
        );
        if (response?.data?.status === 1) {
          const rawData = response.data.data;

          if (rawData.length > 0 && rawData[0].driverId) {
            const driver = rawData[0].driverId;
            setDriverProfile({
              name: driver.fullName || "N/A",
              image: driver.image || "",
            });
          }

          const historyData: DriverHistory[] = rawData.map((history: any) => ({
            userName: history.userId?.fullName || "N/A",
            userImage: history.userId?.image || null,
            pickupLocation: history.pickUpLocation?.address || "N/A",
            dropOffLocation: history.dropOffLocation?.address || "N/A",
            cost: history.fare ? `$${history.fare.toFixed(2)}` : "$0.00",
            date: history.startTime
              ? new Date(history.startTime).toLocaleString()
              : "N/A",
            status: history.status || t("driverHistory.pending"),
            bookingStatus: history.isCancelled
              ? t("driverHistory.cancelled")
              : history.status || t("driverHistory.pending"),
            _id: history._id,
          }));

          setDriverHistory(historyData);
          setCurrentPage(1); // Reset to first page
        } else {
          console.error(
            "Error fetching driver history",
            response?.data?.message
          );
        }
      } catch (error) {
        console.error("Error fetching driver history", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    if (driverId) {
      fetchDriverHistory();
    }
  }, [driverId]);

  const filteredHistory = driverHistory.filter((h) =>
    h.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    setSelectedDate((prev) => new Date(prev.getTime() + 86400000));
  };

  const handlePrev = () => {
    setSelectedDate((prev) => new Date(prev.getTime() - 86400000));
  };

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
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        headingText={t("driverHistory.history")}
        showBackButton={true}
        onBack={() => console.log("Going back...")}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <section className="content_section">
        <div className="d-flex justify-content-end align-items-center mb-4">
          <div className="d-flex w-100 justify-content-between align-items-center mb-3">
            <div className="d-flex track-btn2">
              <img
                src={driverProfile.image ? `/${driverProfile.image}` : profPic}
                alt="Driver"
                className="rounded-circle me-2"
                width="40"
                height="40"
              />
              <p className="colorofall td_date mb-0 fw-bold fs-5">
                {driverProfile.name}
              </p>
            </div>

            <div></div>
            <div className="d-flex align-items-center gap-2">
              <MonthNavigator
                currentMonth={`${month} - ${currentDate}`}
                onPrev={handlePrev}
                onNext={handleNext}
              />
              <div className="filters d_flex">
                <div className="searchField">
                  <input
                    type="text"
                    placeholder={t("driverHistory.search")}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  <FaSearch />
                </div>
                <div className="search-filter">
                  <a onClick={() => setShowFilterModal(true)}>
                    <img src={FillterIcon} alt="filter" />
                  </a>
                </div>
                <NotificationModal
                  show={showFilterModal}
                  handleClose={() => setShowFilterModal(false)}
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-message">{t("driverHistory.loading")}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover custom-driver-table">
              <thead>
                <tr>
                  <th>{t("driverHistory.userName")}</th>
                  <th>{t("driverHistory.pickupLocation")}</th>
                  <th>{t("driverHistory.dropOffLocation")}</th>
                  <th>{t("driverHistory.cost")}</th>
                  <th>{t("driverHistory.date")}</th>
                  <th>{t("driverHistory.status")}</th>
                  <th>{t("driverHistory.bookingStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.length > 0 ? (
                  paginatedHistory.map((history, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(history._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <div className="track-btn2">
                          <img
                            src={
                              history.userImage
                                ? `/${history.userImage}`
                                : profPic
                            }
                            alt=""
                            className="rounded-circle me-2"
                            width="30"
                            height="30"
                          />
                          <p className="colorofall td_date mb-0">
                            {history.userName}
                          </p>
                        </div>
                      </td>
                      <td>{history.pickupLocation}</td>
                      <td>{history.dropOffLocation}</td>
                      <td>{history.cost}</td>
                      <td>{history.date}</td>
                      <td>{history.status}</td>
                      <td>{history.bookingStatus}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      {t("driverHistory.noHistoryFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

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
        )}

        <Footer />
      </section>
    </div>
  );
};

export default DriverHistory;
