import { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import profPic from "../assets/images/profpic.png";
import NotificationModal from "./NotificationModal";
import pickupIcon from "../assets/images/pickup-icon.png";
import DropOffIcon from "../assets/images/drop-icon-2.png";
import Aside from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { apiHelper } from "../services";
import moment from "moment";
import { useTranslation } from "react-i18next";

const DisputesDetail = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [dispute, setDispute] = useState<any>(null); // Initializing dispute as null
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1200);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchDispute = async () => {
    try {
      const { response } = await apiHelper("GET", `vendor/get-dispute/${id}`);
      if (response?.data?.status === 1) {
        const data = response.data.data;
        const formatted = {
          ...data,
          status: data?.isResolved
            ? t("disputes.resolved")
            : t("disputes.unresolved"),
        };
        setDispute(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch dispute by ID", error);
    }
  };

  useEffect(() => {
    if (id) fetchDispute();
  }, [id]);

  if (!dispute) {
    return (
      <div className="bg-mains">
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          showBackButton={true}
          showHeading={true}
        />
        <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <section className="content_section">
          <div>{t("disputes.loading")}</div> 
        </section>
        <Footer />
      </div>
    );
  }

  const {
    userId = {},
    rideId = {},
    reason,
    createdAt,
    status = t("disputes.unresolved"),
  } = dispute;
  const handleStatusChange = (newStatus: string) => {
    const updated = {
      ...dispute,
      status: newStatus,
      isResolved: newStatus === t("disputes.resolved"),
    };
    setDispute(updated);

    const stored = JSON.parse(localStorage.getItem("disputesData")) || [];
    const updatedList = stored.map((d: any) =>
      d.id === dispute._id || d.id === id ? { ...d, status: newStatus } : d
    );
    localStorage.setItem("disputesData", JSON.stringify(updatedList));

    navigate("/disputes-tabs");
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
        showBackButton={true}
        showHeading={true}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <section className="content_section">
        <NotificationModal
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
        <div className="table-responsive custom-driver-table-wrapper">
          <table className="table table-hover custom-driver-table">
            <thead>
              <tr>
                <th>{t("disputes.userName")}</th>
                <th>{t("disputes.pickupLocation")}</th>
                <th>{t("disputes.dropOffLocation")}</th>
                <th>{t("disputes.cost")}</th>
                <th>{t("disputes.date")}</th>
                <th>{t("disputes.status")}</th>
                <th>{t("disputes.bookingStatus")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={userId?.image || profPic}
                      alt="User"
                      className="rounded-circle me-2"
                      width="30"
                      height="30"
                    />
                    <p className="colorofall td_date mb-0">
                      {userId?.fullName || "N/A"}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="d-flex">
                    <img
                      src={pickupIcon}
                      className="me-2 mt-1"
                      width={12}
                      height={12}
                      alt="pickup"
                    />
                    <div className="d-flex flex-column align-items-start td_date">
                      <span className="colorofall small income-name fw-semibold">
                        {t("disputes.pickupLocation")}
                      </span>
                      <span className="colorofall income-name fs-7 fw-semibold text-start">
                        {rideId?.pickUpLocation?.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="d-flex">
                    <img
                      src={DropOffIcon}
                      className="me-2 mt-1"
                      width={18}
                      height={20}
                      alt="dropoff"
                    />
                    <div className="d-flex flex-column align-items-start td_date">
                      <span className="colorofall small income-name fw-semibold">
                        {t("disputes.dropOffLocation")}
                      </span>
                      <span className="colorofall income-name fs-7 fw-semibold text-start">
                        {rideId?.dropOffLocation?.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </td>
                <td>${rideId?.fare || 0}</td>
                <td>{moment(createdAt).format("MMM DD, YYYY")}</td>
                <td>{status}</td>
                <td>
                  {rideId?.isCompleted
                    ? t("disputes.completed")
                    : t("disputes.scheduled")}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="table-footer-note mt-4 p-3 rounded">
            <p className="mb-4">{reason}</p>
            <div className="d-flex gap-3">
              {[t("disputes.resolved"), t("disputes.unresolved")].map(
                (statusOpt) => (
                  <span
                    key={statusOpt}
                    className={`track-btn-down ${
                      statusOpt === status ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleStatusChange(statusOpt)}
                  >
                    {statusOpt}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default DisputesDetail;
