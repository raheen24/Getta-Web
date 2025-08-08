import React, { useState, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import Header from "./../components/Header";
import Aside from "./../components/Sidebar";
import Footer from "./../components/Footer";
import proImg from "../assets/images/profile_img.png";
import GraphAndNum from "../assets/images/graphandnum.png";
import { useLocation, useSearchParams } from "react-router-dom";
import { apiHelper } from "../services";
import DriverRatingStats from "./DriverRatingStats";

const ProfilePage: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
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
    handleResize(); // Call on initial render
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [searchParams] = useSearchParams();
  const driverId = searchParams.get("id");
  //   const [driver, setDriver] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const location = useLocation();
  const driver = location.state || {};
  const vehicle = driver.vehicle || {};
  //   const fetchDriver = async () => {
  //     try {
  //       console.log("Fetching driver with ID:", driverId);
  //       const result = await apiHelper(
  //         "GET",
  //         `/vendor/get-drivers?id=${driverId}`
  //       );
  //       console.log("Driver API result:", result.response.data.data[0]);

  //       if (result) {
  //         setDriver(result.response.data.data[0]);
  //       } else {
  //         console.error("Failed to fetch driver:", result?.data?.message);
  //       }
  //     } catch (err) {
  //       console.error("API error:", err);
  //     }
  //   };

  //   useEffect(() => {
  //     if (!driverId) {
  //       console.error("No driver ID in URL");
  //       return;
  //     }
  //     fetchDriver();
  //   }, [driverId]);

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
        headingText="Driver Profile"
        showBackButton={true}
        showHeading={true}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <section className="content_section">
        <div className="profile_page">
          {!driver ? (
            <p className="text-center mt-5">Loading driver data...</p>
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
                        <span className="label"> Name</span>
                        <span className="value">
                          {driver?.fullName || "N/A"}
                        </span>
                      </li>
                      <li>
                        <span className="label">Phone</span>
                        <span className="value">
                          {driver?.phoneNumber || "N/A"}
                        </span>
                      </li>
                      <li>
                        <span className="label">Driving License</span>
                        <span className="value">
                          {driver?.drivingLicense || "N/A"}
                        </span>
                      </li>
                      <li>
                        <span className="label">VIN Number</span>
                        <span className="value">
                          {vehicle?.vehicleIdentificationNumber || "N/A"}
                        </span>
                      </li>
                      <li>
                        <span className="label">Car Type</span>
                        <span className="value">
                          {vehicle?.carType || "N/A"}
                        </span>
                      </li>
                      <li>
                        <span className="label">Year</span>
                        <span className="value">{vehicle?.year || "N/A"}</span>
                      </li>
                      <li>
                        <span className="label">Transmission</span>
                        <span className="value">
                          {vehicle?.transmission || "N/A"}
                        </span>
                      </li>
                      <li>
                        <span className="label">Seating Capacity</span>
                        <span className="value">
                          {vehicle?.seatingCapacity || "N/A"}
                        </span>
                      </li>

                      <li>
                        <span className="label">Bio</span>
                        <span className="value">{driver?.bio || "N/A"}</span>
                      </li>
                    </ul>
                  </Col>

                  <Col xs={12} lg={6} className="business-documents-col">
                    <div className="mb-4" style={{ marginTop: "25px" }}>
                      {/* <DriverRatingStats
                        totalRides={driver?.totalRides || 0}
                        totalReviews={driver?.totalReviews || 0}
                        averageRating={driver?.averageRating || 0}
                      /> */}
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
                            <div className="d-block">
                              <h5 className="fw-bold colorofall">
                                Total Rides
                              </h5>
                              <p className="mb-0 fw-bold colorofall text-center">
                                {driver?.totalRides || 0}
                              </p>
                            </div>
                          </div>
                        </Col>

                        <Col xs={6} sm={6} className="mb-3">
                          <div className="business-upload-sec border rounded p-3">
                            <div className="d-block">
                              <h5 className="fw-bold colorofall">Reviews</h5>
                              <p className="mb-0 fw-bold colorofall text-center">
                                {driver?.totalReviews || 0}
                              </p>
                            </div>
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

export default ProfilePage;
