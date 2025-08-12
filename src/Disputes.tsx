import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Aside from "./components/Sidebar";
import incomeArrowDown from "./assets/images/date-table-icon.png";
import NotificationModal from "./components/NotificationModal";
import ClockIcon from "./assets/images/time-icom.png";
import profPic from "./assets/images/profpic.png";
import { Dropdown, Nav } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { apiHelper } from "../src/services/index";
import { toast } from "react-toastify";
import moment from "moment";
import { useTranslation } from "react-i18next";

const Disputes = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [disputes, setDisputes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("");
    const { t } = useTranslation();
  
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const stored = localStorage.getItem("disputesData");
    if (stored) {
      setDisputes(JSON.parse(stored));
    } else {
      fetchDisputes();
    }
  }, []);

  const fetchDisputes = async () => {
    try {
      const { response } = await apiHelper("GET", "vendor/get-disputes");
      if (response?.data?.status === 1) {
        const mapped = response.data.data.map((item, index) => ({
          id: item._id,
          driverId: item.driverId || {},
          image: item.driverId?.image || "",
          fullName: item.driverId?.fullName || "N/A",
          reason: item.reason || "No reason",
          createdAt: item.createdAt,
          attachments: item.attachments || [],
          status: item.isResolved ? "Resolved" : "Unresolved",
          index,
        }));
        setDisputes(mapped);
        localStorage.setItem("disputesData", JSON.stringify(mapped));
      } else {
        toast.error(response?.data?.message || t("disputes.failedFetch"));
      }
    } catch (err) {
      console.error("API error:", err);
      toast.error(t("disputes.somethingWentWrong"));
    }
  };

  const handleBack = () => navigate("/disputes");

  const handleRowClick = (id) => navigate(`/disputes-details/${id}`);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...disputes];
    updated[index].status = newStatus;
    setDisputes(updated);
    localStorage.setItem("disputesData", JSON.stringify(updated));
  };

  const filteredDisputes =
    activeTab === ""
      ? disputes
      : disputes.filter((d) => d.status === activeTab);

  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content_section">
        <button
          className="btn btn-outline-dark rounded-circle d-flex justify-content-center align-items-center bg-white mb-3"
          style={{ width: "42px", height: "42px" }}
          onClick={handleBack}
        >
          <BsArrowLeft size={20} />
        </button>

        <div className="d-flex justify-content-end align-items-center mb-4">
          <Nav
            variant="tabs"
            className="gap-3 border-0"
            onSelect={(key) => setActiveTab(key)}
            activeKey={activeTab}
          >
            <Nav.Item>
              <Nav.Link eventKey="Resolved" className="track-btn">
                {t("disputes.resolved")}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Unresolved" className="track-btn">
                {t("disputes.unresolved")}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <div className="table-responsive">
          <table className="table table-hover custom-driver-table">
            <thead>
              <tr>
                <th>{t("disputes.driverInfo")}</th>
                <th>{t("disputes.description")}</th>
                <th>{t("disputes.time")}</th>
                <th>{t("disputes.date")}</th>
                <th>{t("disputes.status")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisputes.map((d, index) => (
                <tr
                  key={d.id}
                  onClick={() => handleRowClick(d.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="d-flex align-items-center">
                    <img
                      src={d.image || profPic}
                      alt="profile"
                      className="rounded-circle me-2"
                      width="40"
                      height="40"
                    />
                    <div className="d-flex flex-column align-items-start td_date">
                      <p className="colorofall td_date mb-0 fw-bold">
                        {t("disputes.driverName")}
                      </p>
                      <p className="colorofall td_date mb-0">{d.fullName}</p>
                    </div>
                  </td>

                  <td>
                    <span className="text-start small colorofall income-name">
                      {d.reason || t("disputes.noReason")}
                    </span>
                  </td>
                  <td>
                    <p className="colorofall td_date mb-0 text-nowrap">
                      <img
                        src={ClockIcon}
                        alt="clock"
                        className="me-2"
                        width="16"
                        height="16"
                      />
                      {moment(d.createdAt).format("hh:mm A")}
                    </p>
                  </td>
                  <td>
                    <p className="colorofall td_date mb-0 text-nowrap">
                      <img
                        src={incomeArrowDown}
                        alt="calendar"
                        className="me-2"
                        width="16"
                        height="16"
                      />
                      {moment(d.createdAt).format("MMM DD, YYYY")}
                    </p>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Dropdown onClick={(e) => e.stopPropagation()}>
                      <Dropdown.Toggle
                        variant="secondary"
                        className="track-btn dropdown-btn"
                        size="sm"
                      >
                        {d.status}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {["Resolved", "Unresolved"].map((s) => (
                          <Dropdown.Item
                            key={s}
                            onClick={() => handleStatusChange(index, s)}
                          >
                            {s}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Disputes;
