import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Header from "./components/Header";
import DeleteAccountModal from "./components/DeleteAccountModal";
import Aside from "./components/Sidebar";
import { apiHelper } from "./services";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "./redux";
import { useTranslation } from "react-i18next";

const LS_KEY = "app_settings";

const SettingsPage = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));

  const { token } = useSelector((s: RootState) => s.user);

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const handleDelete = () => {
    console.log("Deleting account...");
    setShowModal(false);
  };

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 1200);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed.notifications === "boolean")
          setNotifications(parsed.notifications);
        if (typeof parsed.twoFactorAuth === "boolean")
          setTwoFactorAuth(parsed.twoFactorAuth);
      } catch {}
    }

    const fetchSettings = async () => {
      if (!token) return;
      try {
        const { response } = await apiHelper("GET", "common/user-settings", {
          Authorization: `Bearer ${token}`,
        });
        if (response?.data?.status === 1) {
          const serverNotif = !!response.data.data?.isNotification;
          const server2FA = !!response.data.data?.is2FactorEnabled;
          setNotifications(serverNotif);
          setTwoFactorAuth(server2FA);
          localStorage.setItem(
            LS_KEY,
            JSON.stringify({
              notifications: serverNotif,
              twoFactorAuth: server2FA,
            })
          );
        }
      } catch (e) {
        console.warn("fetch settings failed", e);
      }
    };
    fetchSettings();
  }, [token]);

  const writeToLocal = (notif: boolean, twoFA: boolean) => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ notifications: notif, twoFactorAuth: twoFA })
    );
  };

  const handleNotificationToggle = async () => {
    const next = !notifications;

    try {
      const { response } = await apiHelper(
        "POST",
        "common/toggle-notification",
        { Authorization: `Bearer ${token}` },
        { isNotification: next }
      );

      if (response && response.data.status === 1) {
        setNotifications(next);
        writeToLocal(next, twoFactorAuth);
        toast.success(
          response.data.message || t("settings.notificationSuccess")
        );
      } else {
        toast.error(response?.data?.message || t("settings.notificationFail"));
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(t("settings.notificationError"));
    }
  };

  const handleTwoFactorAuthToggle = async () => {
    const next = !twoFactorAuth;

    try {
      const { response } = await apiHelper(
        "PATCH",
        "common/toggle-two-factor",
        { Authorization: `Bearer ${token}` },
        { is2FactorEnabled: next }
      );

      if (response && response.data.status === 1) {
        setTwoFactorAuth(next);
        writeToLocal(notifications, next);
        toast.success(response.data.message || t("settings.twoFASuccess"));
      } else {
        toast.error(response?.data?.message || t("settings.twoFAFail"));
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(t("settings.twoFAError"));
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
                        {t("settings.notifications")}
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
                        {t("settings.twoFactorAuth")}
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
                    {t("settings.language")}
                  </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                  <NavLink to="/privacy-policy" className="nav-link">
                    {t("settings.privacyPolicy")}
                  </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                  <NavLink to="/terms-conditions" className="nav-link">
                    {t("settings.termsConditions")}
                  </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link btn border-0 bg-transparent text-start w-100"
                    onClick={() => setShowModal(true)}
                  >
                    {t("settings.deleteAccount")}
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <NavLink to="/block-list" className="nav-link">
                    {t("settings.blockList")}
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
