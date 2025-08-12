import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Header from "./components/Header";
import DeleteAccountModal from "./components/DeleteAccountModal";
import Aside from "./components/Sidebar";
import { apiHelper } from "./services";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true); 
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleDelete = () => {
    console.log("Deleting account...");
    setShowModal(false);
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

  const handleNotificationToggle = async () => {
    const updatedNotificationStatus = !notifications;
    console.log("Toggling notification:", updatedNotificationStatus);

    try {
      const { response, error } = await apiHelper(
        "POST",
        "common/toggle-notification",
        { isNotification: updatedNotificationStatus }
      );
      console.log("API Response:", response);

      if (response && response.data.status === 1) {
        setNotifications(updatedNotificationStatus); 
        toast.success(
          response.data.message || "Notification preference updated successfully"
        );
      } else {
        toast.error(
          response?.message || "Failed to update notification preference"
        );
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(
        "An error occurred while updating your notification preference."
      );
    }
  };

  const handleTwoFactorAuthToggle = async () => {
    const updated2FAStatus = !twoFactorAuth;
    console.log("Toggling 2FA:", updated2FAStatus); 

    try {
      const { response, error } = await apiHelper(
        "PATCH",
        "common/toggle-two-factor",
        { is2FactorEnabled: updated2FAStatus }
      );
      console.log("API Response:", response);

      if (response && response.data.status === 1) {
        setTwoFactorAuth(updated2FAStatus);
        toast.success(response.data.message || "2FA has been successfully updated");
      } else {
        toast.error(response?.data.message || "Failed to update 2FA preference");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred while updating your 2FA preference.");
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
      <section className="content_section">
        <div className="home_page bg_wrapper">
          <div className="setting-sec">
            <div className="bg_wrapper settingTabs bg-mains">
              <ul className="nav nav-pills" role="tablist">
                <li>
                  <button className="nav-link">
                    <div className="form-check form-switch">
                      <label
                        className="form-check-label"
                        htmlFor="notificationsSwitch"
                      >
                        Notifications
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="notificationsSwitch"
                        checked={notifications}
                        onChange={handleNotificationToggle}
                      />
                    </div>
                  </button>
                </li>
                <li>
                  <button className="nav-link">
                    <div className="form-check form-switch">
                      <label className="form-check-label" htmlFor="authSwitch">
                        2 Factor Authentication
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="authSwitch"
                        checked={twoFactorAuth}
                        onChange={handleTwoFactorAuthToggle}
                      />
                    </div>
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <NavLink to="/language" className="nav-link">
                    Language
                  </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                  <NavLink to="/privacy-policy" className="nav-link">
                    Privacy Policy's
                  </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                  <NavLink to="/terms-conditions" className="nav-link">
                    Terms &amp; Conditions
                  </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link btn border-0 bg-transparent text-start w-100"
                    onClick={() => setShowModal(true)}
                  >
                    Delete Account
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <NavLink to="/block-list" className="nav-link">
                    Block List
                  </NavLink>
                </li>
                <DeleteAccountModal
                  show={showModal}
                  handleClose={() => setShowModal(false)}
                  handleConfirm={handleDelete}
                />
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
