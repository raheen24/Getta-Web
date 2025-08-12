import { useState, useEffect, useCallback } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Aside from "./components/Sidebar";
import NotificationModal from "./components/NotificationModal";
import profPic from "./assets/images/profpic.png";
import FillterIcon from "./assets/images/fillter-icon.png";
import { FaSearch } from "react-icons/fa";
import { apiHelper } from "../src/services/index";
import { toast } from "react-toastify";
import moment from "moment";
import { useTranslation } from "react-i18next";

type DriverLog = {
  name: string;
  image: string;
  date: string;
  timeSpent: string;
};

const TimeLog = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [drivers, setDrivers] = useState<DriverLog[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleResize = useCallback(() => {
    setSidebarOpen(window.innerWidth > 1200);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const formatImageUrl = (path: string): string => {
    const base = import.meta.env.VITE_REACT_APP_API_BASE_URL || "";
    return path ? `${base}/${path.replace(/\\/g, "/")}` : profPic;
  };

  const fetchDrivers = useCallback(async () => {
    try {
      const res = await apiHelper("GET", "vendor/get-time-logs", {}, null);
      const data = res?.response?.data?.data;

      if (Array.isArray(data)) {
        const formatted: DriverLog[] = data.map((driver: any) => {
          const lastRideDate = driver.lastRideDate;
          const isValidDate = lastRideDate && moment(lastRideDate).isValid();
          return {
            name: driver.driverName || "N/A",
            image: driver.driverImage || "",
            date: isValidDate
              ? moment(lastRideDate).format("YYYY-MM-DD HH:mm")
              : t("timeLog.noRidesCompleted"),
            timeSpent: driver.totalRideTime || "0h 0m",
          };
        });

        setDrivers(formatted);
        setCurrentPage(1);
      } else {
        toast.error(t("timeLog.unexpectedResponseFormat"));
        setDrivers([]);
      }
    } catch (error) {
      console.error("Error fetching driver logs:", error);
      toast.error(t("timeLog.fetchError"));
    }
  }, [t]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

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
        <div className="filters d_flex">
          <div className="searchField">
            <input
              type="text"
              placeholder={t("timeLog.search")}
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
        </div>

        <NotificationModal
          show={showFilterModal}
          handleClose={() => setShowFilterModal(false)}
        />

        <div className="table-responsive">
          <table className="table table-hover custom-driver-table">
            <thead className="thead">
              <tr>
                <th className="header-cell text-start">{t("timeLog.driverName")}</th>
                <th className="header-cell text-start">{t("timeLog.lastRideDate")}</th>
                <th className="header-cell text-start">{t("timeLog.timeSpent")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDrivers.length > 0 ? (
                paginatedDrivers.map((driver, index) => (
                  <tr key={index} className="custom-row">
                    <td className="custom-cell">
                      <div className="d-flex track-btn2 align-items-center">
                        <img
                          src={formatImageUrl(driver.image)}
                          alt="Profile"
                          className="rounded-circle me-2"
                          width="30"
                          height="30"
                        />
                        <p className="colorofall td_date mb-0">{driver.name}</p>
                      </div>
                    </td>
                    <td className="custom-cell">
                      <p className="colorofall td_date mb-0 text-start">
                        {driver.date}
                      </p>
                    </td>
                    <td className="custom-cell">
                      <p className="colorofall td_date mb-0 text-start">
                        {driver.timeSpent}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-3">
                    {t("timeLog.noDriversFound")}
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
      </div>
      <Footer />
    </div>
  );
};

export default TimeLog;
