import React, { useState, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import Header from "./../components/Header";
import Aside from "./../components/Sidebar";
import Footer from "./../components/Footer";
import proImg from "../assets/images/profile_img.png";
import { useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DriverRatingStats from "./DriverRatingStats";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
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
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 

  const [searchParams] = useSearchParams();
  const driverId = searchParams.get("id");

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const location = useLocation();
  const driver = location.state || {};
  const vehicle = driver.vehicle || {};

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
        headingText={t("profile.title")}
        showBackButton={true}
        showHeading={true}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <section className="content_section">
        <div className="profile_page">
          {!driver ? (
            <p className="text-center mt-5">{t("profile.loading")}</p>
          ) : (
            <div className="profile-sec">
              <div className="cover-image-bg"></div>

              <div className="profile-image-wrapper">
                <div className="profile-image-container">
                  <Image
                    src={previewImage || getFullImageUrl(driver?.image)}
                    roundedCircle
                    className="profile-image"
                    alt={t("profile.imageAlt")}
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
                        <span className="label">{t("profile.name")}</span>
                        <span className="value">
                          {driver?.fullName || t("common.notAvailable")}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("profile.phone")}</span>
                        <span className="value">
                          {driver?.phoneNumber || t("common.notAvailable")}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("profile.license")}</span>
                        <span className="value">
                          {driver?.drivingLicense || t("common.notAvailable")}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("profile.vin")}</span>
                        <span className="value">
                          {vehicle?.vehicleIdentificationNumber ||
                            t("common.notAvailable")}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("profile.carType")}</span>
                        <span className="value">
                          {vehicle?.carType || t("common.notAvailable")}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("profile.year")}</span>
                        <span className="value">
                          {vehicle?.year || t("common.notAvailable")}
                        </span>
                      </li>
                      <li>
                        <span className="label">
                          {t("profile.transmission")}
                        </span>
                        <span className="value">
                          {vehicle?.transmission || t("common.notAvailable")}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("profile.capacity")}</span>
                        <span className="value">
                          {vehicle?.seatingCapacity || t("common.notAvailable")}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("profile.bio")}</span>
                        <span className="value">
                          {driver?.bio || t("common.notAvailable")}
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
                            <div className="d-block">
                              <h5 className="fw-bold colorofall">
                                {t("profile.totalRides")}
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
                              <h5 className="fw-bold colorofall">
                                {t("profile.reviews")}
                              </h5>
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
