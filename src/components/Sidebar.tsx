import logo from "../assets/images/page-logo.png";
import HomeIcon from "../assets/images/home-icon.png";
import HomeIconActive from "../assets/images/home-icon-active.png";
import ProfileIcon from "../assets/images/profile-icon.png";
import ProfileIconActive from "../assets/images/profile-icon-active.png";
import ordersIcon from "../assets/images/orders-icon.png";
import ordersIconActive from "../assets/images/orders-icon-active.png";
import previousIcon from "../assets/images/previous-icon.png";
import PreviousIconActive from "../assets/images/previous-icon-active.png";
import restaurantIcon from "../assets/images/restaurant-icon.png";
import restaurantIconActive from "../assets/images/restaurant-icon-active.png";
import PayDrivers from "../assets/images/pay-drivers.png";
import PayDriversActive from "../assets/images/pay-drivers-active.png";
import IncomeIcon from "../assets/images/income-icon.png";
import IncomeIconActive from "../assets/images/income-icon-active.png";
import TransactionIcon from "../assets/images/transaction-icon.png";
import TransactionIconActive from "../assets/images/transaction-icon-active.png";
import TimeLog from "../assets/images/time-log-icon.png";
import TimeLogActive from "../assets/images/time-log-icon-active.png";
import DisputesIcon from "../assets/images/disputes-icon.png";
import DisputesIconActive from "../assets/images/disputes-icon-active.png";
import SettingsIcon from "../assets/images/setting-icon.png";
import SettingsIconActive from "../assets/images/setting-icon-active.png";
import LogoutIcon from "../assets/images/logout-icon.png";
import LogoutIconActive from "../assets/images/logout-icon-active.png";
import { NavLink } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import { Auth } from "firebase/auth";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
// ... (all your icon imports)

// Define the props interface
interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("userToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className={`navigation aside ${isSidebarOpen ? "open" : "collapsed"}`}>
      <div className="logoSect">
        <a href="/home">
          {/*
            This is the correction:
            The <img> tag is no longer wrapped in {isSidebarOpen && ...}.
            It will now always be rendered, and CSS will control its size.
          */}
          <img src={logo} alt="logo" />
        </a>
      </div>

      <ul className="nav__links">
        {/*
          This structure is correct. The text is conditionally rendered,
          but the icon is always there.
        */}
        <li className="list text-decoration-none">
          <NavLink
            to="/home"
            className={({ isActive }) => `text-decoration-none ${isActive ? "active" : ""}`}
          >
            <span className="icons">
              <img src={HomeIcon} className="default_icons" alt="Home" />
              <img src={HomeIconActive} className="active_icons" alt="Home Active" />
            </span>
            {isSidebarOpen && <span className="link-text">{t('navigation.home')}</span>}
          </NavLink>
        </li>

        {/* ... Repeat for all other NavLink items ... */}

        <li className="list">
          <NavLink
            to="/profile"
            className={({ isActive }) => `text-decoration-none ${isActive ? "active" : ""}`}
          >
            <span className="icons">
              <img src={ProfileIcon} className="default_icons" alt="Profile" />
              <img src={ProfileIconActive} className="active_icons" alt="Profile Active" />
            </span>
            {isSidebarOpen && <span className="link-text">{t('navigation.profile')}</span>}
          </NavLink>
        </li>

         <li className="list">
          <NavLink
            to="/my-drivers"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "active" : ""}`
            }
          >
            <span className="icons">
              <img
                src={ordersIcon}
                className="default_icons"
                alt="My Drivers"
              />
              <img
                src={ordersIconActive}
                className="active_icons"
                alt="My Drivers Active"
              />
            </span>
            {isSidebarOpen && <span className="link-text">{t('drivers.myDrivers')}</span>}
          </NavLink>
        </li>

        <li className="list">
          <NavLink
            to="/request"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "active" : ""}`
            }
          >
            <span className="icons">
              <img src={previousIcon} className="default_icons" alt="Request" />
              <img
                src={PreviousIconActive}
                className="active_icons"
                alt="Request Active"
              />
            </span>
            {isSidebarOpen && <span className="link-text">{t('navigation.previous')}</span>}
          </NavLink>
        </li>

        <li className="list">
          <NavLink
            to="/charges"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "active" : ""}`
            }
          >
            <span className="icons">
              <img
                src={restaurantIcon}
                className="default_icons"
                alt="Charges"
              />
              <img
                src={restaurantIconActive}
                className="active_icons"
                alt="Charges Active"
              />
            </span>
            {isSidebarOpen && <span className="link-text">{t('charges.charges')}</span>}
          </NavLink>
        </li>

        <li className="list">
          <NavLink
            to="/pay-drivers"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "active" : ""}`
            }
          >
            <span className="icons">
              <img
                src={PayDrivers}
                className="default_icons"
                alt="Pay Drivers"
              />
              <img
                src={PayDriversActive}
                className="active_icons"
                alt="Pay Drivers Active"
              />
            </span>
            {isSidebarOpen && <span className="link-text">{t('navigation.payDrivers')}</span>}
          </NavLink>
        </li>

        <li className="list">
          <NavLink
            to="/income"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "active" : ""}`
            }
          >
            <span className="icons">
              <img src={IncomeIcon} className="default_icons" alt="Income" />
              <img
                src={IncomeIconActive}
                className="active_icons"
                alt="Income Active"
              />
            </span>
            {isSidebarOpen && <span className="link-text">{t('navigation.income')}</span>}
          </NavLink>
        </li>

        <li className="list">
          <NavLink
            to="/transaction"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "active" : ""}`
            }
          >
            <span className="icons">
              <img
                src={TransactionIcon}
                className="default_icons"
                alt="Transaction"
              />
              <img
                src={TransactionIconActive}
                className="active_icons"
                alt="Transaction Active"
              />
            </span>
            {isSidebarOpen && <span className="link-text">{t('navigation.transaction')}</span>}
          </NavLink>
        </li>

        <li className="list">
          <NavLink
            to="/time-log"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "active" : ""}`
            }
          >
            <span className="icons">
              <img src={TimeLog} className="default_icons" alt="Time Log" />
              <img
                src={TimeLogActive}
                className="active_icons"
                alt="Time Log Active"
              />
            </span>
            {isSidebarOpen && <span className="link-text">{t('navigation.timeLog')}</span>}
          </NavLink>
        </li>

        <li className="list">
          <NavLink
            to="/disputes-tabs"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "active" : ""}`
            }
          >
            <span className="icons">
              <img
                src={DisputesIcon}
                className="default_icons"
                alt="Disputes"
              />
              <img
                src={DisputesIconActive}
                className="active_icons"
                alt="Disputes Active"
              />
            </span>
            {isSidebarOpen && <span className="link-text">{t('navigation.disputes')}</span>}
          </NavLink>
        </li>

        <li className="list">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "active" : ""}`
            }
          >
            <span className="icons">
              <img
                src={SettingsIcon}
                className="default_icons"
                alt="Settings"
              />
              <img
                src={SettingsIconActive}
                className="active_icons"
                alt="Settings Active"
              />
            </span>
            {isSidebarOpen && <span className="link-text">{t('navigation.settings')}</span>}
          </NavLink>
        </li>

        <li className="list">
          <a
            href="#!"
            data-bs-toggle="modal"
            data-bs-target="#logoutModal"
            onClick={() => setShowLogout(true)}
            className="text-decoration-none"
          >
            <span className="icons">
              <img src={LogoutIcon} className="default_icons" alt="Logout" />
              <img src={LogoutIconActive} className="active_icons" alt="Logout Active" />
            </span>
            {isSidebarOpen && <span className="link-text">{t('navigation.logout')}</span>}
          </a>
        </li>
      </ul>

      <LogoutModal
        show={showLogout}
        handleClose={() => setShowLogout(false)}
        handleLogout={handleLogout}
      />
      
      <a className="menuclose" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faXmark} />
      </a>
    </aside>
  );
};

export default Sidebar;