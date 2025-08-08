import { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Aside from "./Sidebar";
import NotificationModal from "./NotificationModal";
// import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { apiHelper } from "../services/index"; // Import API helper
import Message from "./Message"; // Assuming Message component is reusable
import profPic from "../assets/images/profpic.png"; // Placeholder profile picture
import moment from "moment"; // For formatting time
const Notifications = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Function to fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setIsLoading(true); // Set loading to true when fetching starts
      const { response } = await apiHelper("GET", "common/get-notifications");
      if (response?.data?.status === 1) {
        setNotifications(response.data.data); // Set notifications in state
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("API error:", err);
      setNotifications([]);
    } finally {
      setIsLoading(false); // Set loading to false after the data has been fetched
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
        headingText="Notifications"
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

        {/* Loading spinner */}
        {isLoading ? (
          <div>Loading notifications...</div>
        ) : (
          <div className="notification_sect">
            {notifications.length === 0 ? (
              <p>No notifications available.</p>
            ) : (
              notifications.map((notification) => (
                <Message
                  key={notification._id}
                  name={notification.title} // You might want to fetch sender's name from API or use a static one for now
                  time={moment(notification.createdAt).fromNow()} // Format time as "2 mins ago"
                  text={notification.body} // Body of the notification
                  image={profPic} // Use a placeholder or an image URL if provided by the API
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
