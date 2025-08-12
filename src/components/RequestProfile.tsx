// import React, { useState, useEffect } from "react";
// import { Row, Col, Image } from "react-bootstrap";
// import Header from "./Header";
// import Aside from "./Sidebar";
// import Footer from "./Footer";
// import proImg from "../assets/images/profile_img.png";
// import { useLocation } from "react-router-dom";
// import DriverRatingStats from "./DriverRatingStats";

// const RequestProfile: React.FC = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

//   useEffect(() => {
//     const handleResize = () => {
//       setSidebarOpen(window.innerWidth > 1200);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const location = useLocation();
//   const driverRequest = location.state || {};
//   const driver = driverRequest.driverData || null;
//   const vehicle = driverRequest.vehicle || {};

//   const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const getFullImageUrl = (path?: string) => {
//     return path ? `https://getta-api.deployment-uat.com/${path}` : proImg;
//   };

//   return (
//     <div
//       className={`bg-mains ${
//         isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
//       }`}
//     >
//       <Header
//         isSidebarOpen={isSidebarOpen}
//         toggleSidebar={toggleSidebar}
//         headingText="Driver Profile"
//         showBackButton={true}
//         showHeading={true}
//       />
//       <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

//       <section className="content_section">
//         <div className="profile_page">
//           {!driver ? (
//             <div className="text-center mt-5">
//               <h4 className="text-muted">Driver not assigned yet.</h4>
//             </div>
//           ) : (
//             <div className="profile-sec">
//               <div className="cover-image-bg"></div>

//               <div className="profile-image-wrapper">
//                 <div className="profile-image-container">
//                   <Image
//                     src={previewImage || getFullImageUrl(driver?.image)}
//                     roundedCircle
//                     className="profile-image"
//                     alt="Profile"
//                     onError={(e: any) => {
//                       e.target.onerror = null;
//                       e.target.src = proImg;
//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="profile-business-sec">
//                 <Row>
//                   <Col xs={12} lg={6} className="pe-lg-4 business-info-col">
//                     <ul className="profile-info-list">
//                       <li>
//                         <span className="label">Name</span>
//                         <span className="value">
//                           {driver?.fullName || "N/A"}
//                         </span>
//                       </li>
//                       <li>
//                         <span className="label">Phone</span>
//                         <span className="value">
//                           {driver?.phoneNumber || "N/A"}
//                         </span>
//                       </li>
//                       <li>
//                         <span className="label">Driving License</span>
//                         <span className="value">
//                           {driver?.drivingLicense || "N/A"}
//                         </span>
//                       </li>
//                       <li>
//                         <span className="label">VIN Number</span>
//                         <span className="value">
//                           {vehicle?.vehicleIdentificationNumber || "N/A"}
//                         </span>
//                       </li>
//                       <li>
//                         <span className="label">Car Type</span>
//                         <span className="value">
//                           {vehicle?.carType || "N/A"}
//                         </span>
//                       </li>
//                       <li>
//                         <span className="label">Year</span>
//                         <span className="value">{vehicle?.year || "N/A"}</span>
//                       </li>
//                       <li>
//                         <span className="label">Transmission</span>
//                         <span className="value">
//                           {vehicle?.transmission || "N/A"}
//                         </span>
//                       </li>
//                       <li>
//                         <span className="label">Seating Capacity</span>
//                         <span className="value">
//                           {vehicle?.seatingCapacity || "N/A"}
//                         </span>
//                       </li>
//                       <li>
//                         <span className="label">Bio</span>
//                         <span className="value">{driver?.bio || "N/A"}</span>
//                       </li>
//                     </ul>
//                   </Col>

//                   <Col xs={12} lg={6} className="business-documents-col">
//                     <div className="mb-4" style={{ marginTop: "25px" }}>
//                       <DriverRatingStats
//                         earnings={driver?.earnings || 0}
//                         date={new Date().toLocaleString("en-GB", {
//                           day: "2-digit",
//                           month: "short",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       />
//                     </div>

//                     <div className="upload-img-sec">
//                       <Row>
//                         <Col xs={6} sm={6} className="mb-3">
//                           <div className="business-upload-sec border rounded p-3">
//                             <h5 className="fw-bold colorofall">Total Rides</h5>
//                             <p className="mb-0 fw-bold colorofall text-center">
//                               {driver?.totalRides || 0}
//                             </p>
//                           </div>
//                         </Col>

//                         <Col xs={6} sm={6} className="mb-3">
//                           <div className="business-upload-sec border rounded p-3">
//                             <h5 className="fw-bold colorofall">Reviews</h5>
//                             <p className="mb-0 fw-bold colorofall text-center">
//                               {driver?.totalReviews || 0}
//                             </p>
//                           </div>
//                         </Col>
//                       </Row>
//                     </div>
//                   </Col>
//                 </Row>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default RequestProfile;
import React, { useState, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import Header from "./Header";
import Aside from "./Sidebar";
import Footer from "./Footer";
import proImg from "../assets/images/profile_img.png";
import { useLocation } from "react-router-dom";
import DriverRatingStats from "./DriverRatingStats";
import { useTranslation } from "react-i18next";

const RequestProfile: React.FC = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1200);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const location = useLocation();
  const driverRequest = location.state || {};
  const driver = driverRequest.driverData || null;
  const vehicle = driverRequest.vehicle || {};

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const getFullImageUrl = (path?: string) => {
    return path ? `https://getta-api.deployment-uat.com/${path}` : proImg;
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
        headingText={t("requestProfile.driverProfile")}
        showBackButton={true}
        showHeading={true}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <section className="content_section">
        <div className="profile_page">
          {!driver ? (
            <div className="text-center mt-5">
              <h4 className="text-muted">
                {t("requestProfile.driverNotAssigned")}
              </h4>
            </div>
          ) : (
            <div className="profile-sec">
              <div className="cover-image-bg"></div>

              <div className="profile-image-wrapper">
                <div className="profile-image-container">
                  <Image
                    src={previewImage || getFullImageUrl(driver?.image)}
                    roundedCircle
                    className="profile-image"
                    alt="Profile"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = proImg;
                    }}
                  />
                </div>
              </div>

              <div className="profile-business-sec">
                <Row>
                  <Col xs={12} lg={6} className="pe-lg-4 business-info-col">
                    <ul className="profile-info-list">
                      <li>
                        <span className="label">
                          {t("requestProfile.name")}
                        </span>
                        <span className="value">
                          {driver?.fullName || t("requestProfile.nA")}
                        </span>
                      </li>
                      <li>
                        <span className="label">
                          {t("requestProfile.phone")}
                        </span>
                        <span className="value">
                          {driver?.phoneNumber || t("requestProfile.nA")}
                        </span>
                      </li>
                      <li>
                        <span className="label">
                          {t("requestProfile.drivingLicense")}
                        </span>
                        <span className="value">
                          {driver?.drivingLicense || t("requestProfile.nA")}
                        </span>
                      </li>
                      <li>
                        <span className="label">
                          {t("requestProfile.vinNumber")}
                        </span>
                        <span className="value">
                          {vehicle?.vehicleIdentificationNumber ||
                            t("requestProfile.nA")}
                        </span>
                      </li>
                      <li>
                        <span className="label">
                          {t("requestProfile.carType")}
                        </span>
                        <span className="value">
                          {vehicle?.carType || t("requestProfile.nA")}
                        </span>
                      </li>
                      <li>
                        <span className="label">
                          {t("requestProfile.year")}
                        </span>
                        <span className="value">
                          {vehicle?.year || t("requestProfile.nA")}
                        </span>
                      </li>
                      <li>
                        <span className="label">
                          {t("requestProfile.transmission")}
                        </span>
                        <span className="value">
                          {vehicle?.transmission || t("requestProfile.nA")}
                        </span>
                      </li>
                      <li>
                        <span className="label">
                          {t("requestProfile.seatingCapacity")}
                        </span>
                        <span className="value">
                          {vehicle?.seatingCapacity || t("requestProfile.nA")}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("requestProfile.bio")}</span>
                        <span className="value">
                          {driver?.bio || t("requestProfile.nA")}
                        </span>
                      </li>
                    </ul>
                  </Col>

                  <Col xs={12} lg={6} className="business-documents-col">
                    <div className="mb-4" style={{ marginTop: "25px" }}>
                      <DriverRatingStats
                        earnings={driver?.earnings || 0}
                        date={new Date().toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      />
                    </div>

                    <div className="upload-img-sec">
                      <Row>
                        <Col xs={6} sm={6} className="mb-3">
                          <div className="business-upload-sec border rounded p-3">
                            <h5 className="fw-bold colorofall">
                              {t("requestProfile.totalRides")}
                            </h5>
                            <p className="mb-0 fw-bold colorofall text-center">
                              {driver?.totalRides || 0}
                            </p>
                          </div>
                        </Col>

                        <Col xs={6} sm={6} className="mb-3">
                          <div className="business-upload-sec border rounded p-3">
                            <h5 className="fw-bold colorofall">
                              {t("requestProfile.reviews")}
                            </h5>
                            <p className="mb-0 fw-bold colorofall text-center">
                              {driver?.totalReviews || 0}
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RequestProfile;
