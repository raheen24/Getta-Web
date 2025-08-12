import { useState, useEffect, MouseEvent } from "react";
import { FaSearch, FaStar } from "react-icons/fa";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Aside from "./components/Sidebar";
import FillterIcon from "./assets/images/fillter-icon.png";
import NotificationModal from "./components/NotificationModal";
import profPic from "./assets/images/profpic.png";
import { useNavigate } from "react-router-dom";
import BlockModal from "./components/BlockModal";
import { apiHelper } from "../src/services/index";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Driver {
  _id: string;
  name: string;
  car: string;
  vin: string;
  payment: string;
  rating: number | string;
  rides: number;
  status: "Online" | "Offline" | "Blocked";
  image?: string;
}

const DriversTable: React.FC = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [driverToBlock, setDriverToBlock] = useState<Driver | null>(null);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
      const { response } = await apiHelper("GET", "vendor/get-drivers");
      if (response?.data?.status === 1) {
        const mappedDrivers: Driver[] = response.data.data.map((item: any) => {
          const driver = item.driver || {};
          return {
            _id: driver._id,
            name: driver.fullName || "N/A",
            car: item.vehicle?.carType || "N/A",
            vin: item.vehicle?.vehicleIdentificationNumber || "N/A",
            payment: driver.isPayment
              ? t("drivers.paid")
              : t("drivers.pending"),
            rating: driver.averageRating ?? "N/A",
            rides: driver.totalRides || 0,
            status: driver.isBlocked
              ? t("drivers.blocked")
              : driver.isRide
              ? t("drivers.online")
              : t("drivers.offline"),
            image: driver.image || null,
          };
        });
        setDrivers(mappedDrivers);
      } else {
        toast.error(response?.data?.message || t("drivers.failedFetch"));
        setDrivers([]);
      }
    } catch (err) {
      toast.error(t("drivers.somethingWentWrong"));
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

  const handleRowClick = (
    e: MouseEvent<HTMLTableRowElement>,
    driver: Driver
  ) => {
    const target = e.target as HTMLElement;

    if (target.closest(".track-btn")) {
      navigate(`/tracking-details/${driver._id}`);
      return;
    }

    if (target.closest(".block-link") || target.closest(".payment-cell"))
      return;
    navigate(`/drivers-details/${driver._id}`);
  };

  const handlePayment = (
    e: MouseEvent<HTMLTableCellElement>,
    driver: Driver
  ) => {
    e.stopPropagation();
    navigate("/drivers-details");
  };

  const handleBlockClick = (
    e: MouseEvent<HTMLAnchorElement>,
    driver: Driver
  ) => {
    e.stopPropagation();
    setDriverToBlock(driver);
    setShowBlockModal(true);
  };

  const handleConfirmBlock = async () => {
    if (!driverToBlock) return;
    try {
      const { response, error } = await apiHelper(
        "POST",
        "/vendor/toggle-driver",
        {},
        { driverId: driverToBlock._id }
      );
      if (error) {
        toast.error(error || t("drivers.somethingWentWrong"));
        return;
      }
      if (response?.data?.status === 1) {
        toast.success(response?.data?.message || t("drivers.actionSuccessful"));
        setDrivers((prev) =>
          prev.map((d) =>
            d._id === driverToBlock._id
              ? {
                  ...d,
                  status:
                    d.status === t("drivers.blocked")
                      ? "Offline"
                      : t("drivers.blocked"),
                }
              : d
          )
        );
      } else {
        toast.error(response?.data?.message || t("drivers.actionFailed"));
      }
    } catch (err) {
      console.error("Block/Unblock error:", err);
      toast.error(t("drivers.somethingWentWrong"));
    }
    setShowBlockModal(false);
  };

  const handleCancelBlock = () => {
    setShowBlockModal(false);
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
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content_section">
        <div className="filters d_flex">
          <div className="searchField">
            <input
              type="text"
              placeholder={t("drivers.search")}
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

        <div className="table-responsive">
          <table className="table table-hover custom-driver-table">
            <thead>
              <tr>
                <th>{t("drivers.driverName")}</th>
                <th>{t("drivers.carType")}</th>
                <th>{t("drivers.vinNo")}</th>
                <th>{t("drivers.payment")}</th>
                <th>{t("drivers.reviews")}</th>
                <th>{t("drivers.totalRides")}</th>
                <th>{t("drivers.liveTracking")}</th>
                <th>{t("drivers.status")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedDrivers.length > 0 ? (
                paginatedDrivers.map((driver) => (
                  <tr
                    key={driver._id}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => handleRowClick(e, driver)}
                  >
                    <td>
                      <div className="track-btn2 d-flex align-items-center">
                        <img
                          src={driver.image || profPic}
                          alt="Driver"
                          className="rounded-circle me-2"
                          width="30"
                          height="30"
                        />
                        <p className="colorofall td_date mb-0">{driver.name}</p>
                      </div>
                    </td>
                    <td>{driver.car}</td>
                    <td>{driver.vin}</td>
                    <td
                      className="payment-cell"
                      onClick={(e) => handlePayment(e, driver)}
                    >
                      {driver.payment}
                    </td>
                    <td>
                      <div className="d-flex mb-0 align-items-center">
                        <FaStar className="text-warning me-1" />
                        <p className="colorofall td_date mb-0">
                          {driver.rating}
                        </p>
                      </div>
                    </td>
                    <td>{driver.rides}</td>
                    <td>
                      <a className="track-btn text-decoration-none">
                        {t("drivers.trackRider")}
                      </a>
                    </td>
                    <td className={`status-${driver.status.toLowerCase()}`}>
                      {driver.status}
                    </td>
                    <td>
                      <a
                        className="text-decoration-none colorofall td_date block-link"
                        onClick={(e) => handleBlockClick(e, driver)}
                      >
                        {driver.status === "Blocked"
                          ? t("drivers.unblock")
                          : t("drivers.block")}
                      </a>
                      {showBlockModal && driverToBlock?._id === driver._id && (
                        <BlockModal
                          userName={driverToBlock.name}
                          isBlocked={driverToBlock.status === "Blocked"}
                          onConfirm={handleConfirmBlock}
                          onCancel={handleCancelBlock}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted">
                    {t("drivers.noDriversFound")}
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

export default DriversTable;
