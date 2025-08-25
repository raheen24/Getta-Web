import { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Aside from "./Sidebar";
import NotificationModal from "./NotificationModal";
import { useNavigate } from "react-router-dom";
import { apiHelper } from "../services/index";
import Message from "./Message";
import profPic from "../assets/images/profpic.png";
import moment from "moment";
import { useTranslation } from "react-i18next";

const Notifications = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const { response } = await apiHelper("GET", "common/get-notifications");
      if (response?.data?.status === 1) {
        setNotifications(response.data.data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("API error:", err);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleBack = () => {
    navigate(-1);
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
        headingText={t("notifications.title")}
        showBackButton={true}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <section className="content_section">
        <div className="d-flex justify-content-end align-items-center mb-4">
          <NotificationModal
            show={showModal}
            handleClose={() => setShowModal(false)}
          />
        </div>

        {/* Loading / Empty / List */}
        {isLoading ? (
          <div>{t("notifications.loading")}</div>
        ) : (
          <div className="notification_sect">
            {notifications.length === 0 ? (
              <p>{t("notifications.empty")}</p>
            ) : (
              notifications.map((notification) => (
                <Message
                  key={notification._id}
                  name={notification.title}
                  time={moment(notification.createdAt).fromNow()}
                  text={notification.body}
                  image={profPic}
                />
              ))
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Notifications;
