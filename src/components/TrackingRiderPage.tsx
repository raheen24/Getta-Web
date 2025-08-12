import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiHelper } from "../services/index";
import Footer from "./Footer";
import Header from "./Header";
import Aside from "./Sidebar";
import profPic from "../assets/images/profpic.png";
import pickupIcon from "../assets/images/pickup-icon.png";
import dropIcon from "../assets/images/drop-icon.png";
import dateIcon from "../assets/images/date-icon.png";
import timeIcon from "../assets/images/time-icon.png";
import mapImage from "../assets/images/map-2.png";
import { Container, Row, Col, Card, ListGroup, Image } from "react-bootstrap";
import profileUser from "../assets/images/profile-drive-2.png";
import { useTranslation } from "react-i18next";

const TrackingRiderPage: React.FC = () => {
  const { rideId } = useParams();
  const { t } = useTranslation();
  const [rideData, setRideData] = useState<any>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchRideData = async () => {
      if (!rideId) return;

      try {
        const { response } = await apiHelper(
          "GET",
          `/vendor/get-ride-details/${rideId}`
        );
        if (response?.data?.status === 1) {
          setRideData(response.data.data);
        } else {
          console.error(t("trackingRider.failedFetch"));
        }
      } catch (err) {
        console.error(t("trackingRider.errorFetchingData"), err);
      }
    };

    fetchRideData();
  }, [rideId]);

  const {
    userId: user,
    driverId: driver,
    pickUpLocation,
    dropOffLocation,
    fare,
    startTime,
    endTime,
    distance,
    rideType,
    driverReviews,
    vehicle,
  } = rideData || {};

  const userCharges = user?.charges || {};
  const driverCharges = driver?.charges || {};

  const durationMinutes = rideData
    ? Math.floor(
        (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000
      )
    : 0;

  const totalTimeSpent = durationMinutes;

  const perMileCharge = userCharges.perMile || 0;
  const perMinuteCharge = userCharges.perMinute || 0;
  const serviceCharge = userCharges.service || 0;

  const totalCharge =
    perMileCharge * distance + perMinuteCharge * totalTimeSpent + serviceCharge;

  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        headingText={t("trackingRider.trackingRider")}
        showBackButton={true}
        showHeading={true}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <section className="content_section">
        <Row>
          <Col md={6}>
            <Card className="riderBox mb-4">
              <Card.Body>
                <div className="d_flex tracking-drive mb-3">
                  <Card.Title className="driver-title">
                    {t("trackingRider.driverInformation")}
                  </Card.Title>
                  <Image
                    src={driver?.image || profPic}
                    roundedCircle
                    width={60}
                    height={60}
                    alt="Driver"
                    className="m-3"
                  />
                </div>
                <ListGroup variant="flush" className="info-list">
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>{t("trackingRider.name")}:</strong>{" "}
                      {driver?.fullName}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>{t("trackingRider.phone")}:</strong>{" "}
                      {driver?.phoneNumber}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>{t("trackingRider.licenseNo")}:</strong>{" "}
                      {driver?.drivingLicense}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>{t("trackingRider.carType")}:</strong>{" "}
                      {vehicle?.carType || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>{t("trackingRider.vinNo")}:</strong>{" "}
                      {vehicle?.vehicleIdentificationNumber || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>{t("trackingRider.year")}:</strong>{" "}
                      {vehicle?.year || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>{t("trackingRider.transmission")}:</strong>{" "}
                      {vehicle?.transmission || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>{t("trackingRider.seatingCapacity")}:</strong>{" "}
                      {vehicle?.seatingCapacity || "N/A"}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
              <div className="driver-reviews p-2">
                <Card>
                  <Card.Body className="p-2 cards-of">
                    {driverReviews?.length > 0 ? (
                      driverReviews.map((review: any, index: number) => (
                        <div key={index} className="d-flex align-items-center">
                          <Image
                            src={profileUser}
                            roundedCircle
                            width={30}
                            height={30}
                            className="me-2"
                          />
                          <div>
                            <small>
                              <strong>
                                {review?.userId?.fullName ||
                                  t("trackingRider.anonymous")}
                              </strong>
                            </small>
                            <br />
                            <small>
                              {review?.comment || t("trackingRider.noComment")}
                            </small>
                            <br />
                            <small>
                              {t("trackingRider.rating")}:{" "}
                              {review?.rating || "N/A"}
                            </small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>{t("trackingRider.noReviews")}</div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </Card>

            <Card className="mb-4">
              <Card.Body className="p-2">
                <Image src={mapImage} alt="Map" fluid className="map-image" />
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="riderBox mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="tracking-drive d_flex mb-3">
                    <Card.Title className="user-title">
                      {t("trackingRider.userInformation")}
                    </Card.Title>
                    <Image
                      src={user?.image || profPic}
                      roundedCircle
                      width={60}
                      height={60}
                    />
                  </div>
                </div>

                <ListGroup variant="flush" className="info-list">
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>{t("trackingRider.name")}:</strong>{" "}
                      {user?.fullName}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>{t("trackingRider.phone")}:</strong>{" "}
                      {user?.phoneNumber}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="booking-info mb-2">
                  <p className="fw-bold">
                    {t("trackingRider.bookingInformation")}
                  </p>
                  <div className="date-time">
                    <Image src={dateIcon} width={15} className="me-2" />
                    {t("trackingRider.date")}:{" "}
                    {new Date(startTime).toLocaleDateString()}
                  </div>
                  <div className="date-time">
                    <Image src={timeIcon} width={18} className="me-2" />
                    {t("trackingRider.time")}:{" "}
                    {new Date(startTime).toLocaleTimeString()}
                  </div>
                </div>
                <Row>
                  <div className="trackline">
                    <Col xs={12} className="mb-3">
                      <div className="d-flex">
                        <Image src={pickupIcon} className="location-icon" />
                        <div>
                          <strong>{t("trackingRider.pickupLocation")}</strong>
                          <br />
                          {pickUpLocation?.address}
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="d-flex">
                        <Image src={dropIcon} className="location-icon" />
                        <div>
                          <strong>{t("trackingRider.dropOffLocation")}</strong>
                          <br />
                          {dropOffLocation?.address}
                        </div>
                      </div>
                    </Col>
                  </div>
                </Row>
                <div className="ride-details">
                  <div className="ride-meta">
                    <span className="fw-bold">
                      {t("trackingRider.rideType")}:
                    </span>{" "}
                    <span>{rideType}</span>
                  </div>
                  <div className="ride-meta">
                    <span className="fw-bold">
                      {t("trackingRider.totalTimeSpent")}:
                    </span>{" "}
                    <span>
                      {totalTimeSpent} {t("trackingRider.minutes")}
                    </span>
                  </div>
                  <div className="ride-meta">
                    <span className="fw-bold">
                      {t("trackingRider.totalRideCharges")}:
                    </span>{" "}
                    <span>${totalCharge.toFixed(2)}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default TrackingRiderPage;
