// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import NotificationsIcon from "../assets/images/notification-bell.png";
// import ProfileIcon from "../assets/images/profile-icon-active.png";
// import arrowBack from "../assets/images/arrow_back.png";
// import { useNavigate } from "react-router-dom";

// interface HeaderProps {
//   showHeading?: boolean;
//   headingText?: string;
//   showBackButton?: boolean;
//   onBack?: () => void;
// }

// const Header: React.FC<HeaderProps> = ({
//   showHeading = false,
//   headingText = "",
//   showBackButton = false,
//   onBack,
// }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleSidebar = () => {
//     setSidebarOpen((prevState) => !prevState);
//   };

//   const goBack = () => {
//     if (onBack) {
//       onBack();
//     } else {
//       navigate(-1);
//     }
//   };

//   return (
//     <div className="gap-sec">
//       <header>
//         <div
//           className="header__content user_header"
//           style={{ backgroundColor: "#EAF3FF" }}
//         >
//           <div className="header_leftSect">
//             <div className="menuSect">
//               <a
//                 href="javascript:void(0)"
//                 className="sideBar"
//                 onClick={toggleSidebar}
//               >
//                 <i className="fas fa-bars"></i>
//               </a>
//             </div>

//             {showHeading && (
//               <div className="heading">
//                 <div className="back-btn-sec d-flex align-items-center">
//                   {showBackButton && (
//                     <button onClick={goBack} className="back-btn">
//                       <img src={arrowBack} alt="Back" />
//                     </button>
//                   )}
//                   <h5 className="back-title">{headingText}</h5>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="header_rightSect">
//             <a href="/notifications" className="notification">
//               <img src={NotificationsIcon} alt="Notification" />
//             </a>
//             <a href="/profile" className="notification">
//               <img src={ProfileIcon} alt="Profile" />
//             </a>
//           </div>
//         </div>
//       </header>

//       {/* Sidebar */}
//       {sidebarOpen && (
//         <div className="sidebar">
//           <Sidebar />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Header;
import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "../assets/images/notification-bell.png";
import ProfileIcon from "../assets/images/profile-icon-active.png";
import arrowBack from "../assets/images/arrow_back.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
// The props interface remains the same.
interface HeaderProps {
  showHeading?: boolean;
  headingText?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  isSidebarOpen: boolean; // This prop is received but not directly used here. It's kept for potential future use.
  toggleSidebar: () => void; // This function from the parent will be used.
}

const Header: React.FC<HeaderProps> = ({
  showHeading = false,
  headingText = "",
  showBackButton = false,
  onBack,
  // isSidebarOpen is available if needed, but we don't need it for the toggle logic.
  toggleSidebar,
}) => {
  const navigate = useNavigate();

  // No more local state for the sidebar here.
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const toggleSidebar = () => { ... };

  const goBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // Fallback to browser history back
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

      {/*
        The Sidebar is no longer rendered here.
        It is now rendered by the parent component (Home.tsx) to properly control
        the layout of the entire page (sidebar + content).
      */}
    </div>
  );
};

export default Header;
