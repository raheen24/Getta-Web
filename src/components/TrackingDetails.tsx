import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { Image, Card, Row, Col, Badge, ListGroup } from "react-bootstrap";
import mapImage from "../assets/images/map-2.png";
import profileDriver from "../assets/images/profile-drive.png";
import pickupIcon from "../assets/images/pickup-icon.png";
import dropIcon from "../assets/images/drop-icon.png";
import dateIcon from "../assets/images/date-icon.png";
import timeIcon from "../assets/images/time-icon.png";
import Header from "./Header";
import Aside from "./Sidebar";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;
const TrackingDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const driverId = queryParams.get("driverId");
  const [driverLocation, setDriverLocation] = useState<any | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state: any) => state.user);
  const { driver: driverData } = location.state || {};

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!driverId || !token) {
      console.error("Driver ID or token is missing.");
      return;
    }

    const socket = io("https://client1.appsstaging.com:3017", {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on("connect", () => console.log("Socket connected successfully!"));
    socket.on("connect_error", (error) =>
      console.error("Socket connection error:", error)
    );
    socket.on("disconnect", () => console.log("Socket disconnected."));

    socket.emit("track-driver", { driverId });

    socket.on("driverLocation", (locationData) => {
      if (locationData && locationData.coordinates) {
        setDriverLocation(locationData);
      }
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [driverId, token]);

  if (!driverData) {
    return <div>{t("noDriverData")}</div>;
  }

  const { driver, vehicle, averageRating } = driverData;
  // driver.location se pickup details
  const pickupAddress = driver?.location?.address || t("notAvailable");

  // drop-off agar API me nahi aata to fallback
  const dropOffAddress = driverData?.dropOffLocation || "N/A";

  // charges API se (driver.charges)
  const rideCharges = driver?.charges
    ? `$${driver.charges.service || 0}.00`
    : t("notAvailable");

  // API me rideType ka explicit field nahi hai,
  // to aap driver.isRide (true/false) ya driverData.rideType ka use kar sakte ho:
  const rideType = driver?.isRide
    ? t("trackingDetails.onDemand")
    : t("trackingDetails.preBooking");

  // date/time API ke createdAt se
  const rideDate = driver?.createdAt
    ? new Date(driver.createdAt).toLocaleDateString()
    : "N/A";

  const rideTime = driver?.createdAt
    ? new Date(driver.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        showBackButton={true}
        showHeading={true}
        headingText={t("trackingDetails.trackingDetails")}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="content_section">
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Card.Title className="mb-0">
                    {t("trackingDetails.driverInformation")}
                  </Card.Title>
                  <Image
                    src={driver?.image || profileDriver}
                    roundedCircle
                    width={60}
                    height={60}
                  />
                </div>
                <ListGroup variant="flush">
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>{t("trackingDetails.name")}:</strong>
                      {driver?.fullName || t("notAvailable")}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>{t("trackingDetails.phone")}:</strong>{" "}
                      {driver?.phoneNumber || t("notAvailable")}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>{t("trackingDetails.carType")}:</strong>{" "}
                      {vehicle?.carType || t("notAvailable")}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>{t("trackingDetails.vinNumber")}:</strong>{" "}
                      {vehicle?.vehicleIdentificationNumber ||
                        t("notAvailable")}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>{t("trackingDetails.year")}:</strong>{" "}
                      {vehicle?.year || t("notAvailable")}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>{t("trackingDetails.transmission")}:</strong>{" "}
                      {vehicle?.transmission || t("notAvailable")}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>{t("trackingDetails.seatingCapacity")}:</strong>{" "}
                      {vehicle?.seatingCapacity || t("notAvailable")}
                    </div>
                  </ListGroup.Item>
                </ListGroup>

                <div className="mt-4">
                  <strong>{t("trackingDetails.reviews")}</strong>{" "}
                  <Badge bg="warning" text="dark">
                    ★{averageRating || t("notAvailable")}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body className="p-2">
                {driverLocation?.coordinates ? (
                  <MapContainer
                    center={[
                      driverLocation.coordinates[1],
                      driverLocation.coordinates[0],
                    ]}
                    zoom={15}
                    style={{ height: "300px", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker
                      position={[
                        driverLocation.coordinates[1],
                        driverLocation.coordinates[0],
                      ]}
                    >
                      <Popup>Driver Current Location</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <Image
                    src={mapImage}
                    alt={t("trackingDetails.map")}
                    fluid
                    rounded
                  />
                )}
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <Image src={dateIcon} width={18} className="me-2" />
                    {t("trackingDetails.date")}: {rideDate}
                  </div>
                  <div>
                    <Image src={timeIcon} width={18} className="me-2" />
                    {t("time")}: {rideTime}
                  </div>
                </div>
                <hr />
                <Row>
                  <Col xs={12} className="mb-3">
                    <div className="d-flex">
                      <Image
                        src={pickupIcon}
                        width={20}
                        className="me-2 mt-1"
                      />
                      <div>
                        <strong>{t("trackingDetails.pickupLocation")}</strong>
                        <br />
                        {pickupAddress}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="d-flex">
                      <Image src={dropIcon} width={20} className="me-2 mt-1" />
                      <div>
                        <strong>{t("trackingDetails.dropOffLocation")}</strong>
                        <br />
                        {dropOffAddress}
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={4}>
                    <strong>{t("trackingDetails.rideType")}:</strong>{" "}
                    <span className="text-primary">{rideType}</span>
                  </Col>
                  <Col md={4}>
                    <strong>{t("trackingDetails.totalTimeSpent")}:</strong>
                    {" N/A "}
                  </Col>
                  <Col md={4}>
                    <strong>{t("trackingDetails.rideCharges")}:</strong>{" "}
                    {rideCharges}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TrackingDetails;
