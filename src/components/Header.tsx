import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "../assets/images/notification-bell.png";
import ProfileIcon from "../assets/images/profile-icon-active.png";
import arrowBack from "../assets/images/arrow_back.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
interface HeaderProps {
  showHeading?: boolean;
  headingText?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showHeading = false,
  headingText = "",
  showBackButton = false,
  onBack,
  toggleSidebar,
}) => {
  const navigate = useNavigate();

  const goBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); 
    }
  };

  return (
    <div className="gap-sec">
      <header>
        <div
          className="header__content user_header"
          style={{ backgroundColor: "#EAF3FF" }}
        >
          <div className="header_leftSect">
            <a className="menubar" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </a>

            {showHeading && (
              <div className="heading">
                <div className="back-btn-sec d-flex align-items-center">
                  {showBackButton && (
                    <button onClick={goBack} className="back-btn">
                      <img src={arrowBack} alt="Back" />
                    </button>
                  )}
                  <h5 className="back-title">{headingText}</h5>
                </div>
              </div>
            )}
          </div>

          <div className="header_rightSect">
            <a href="/notifications" className="notification">
              <img src={NotificationsIcon} alt="Notification" />
            </a>
            <a href="/profile" className="notification">
              <img src={ProfileIcon} alt="Profile" />
            </a>
          </div>
        </div>
      </header>
    </div>
  );
};
export default Header;
