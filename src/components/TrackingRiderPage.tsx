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

const TrackingRiderPage: React.FC = () => {
  const { rideId } = useParams();
  const [rideData, setRideData] = useState<any>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Fetch ride data when rideId changes
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
          console.error("Failed to fetch ride data");
        }
      } catch (err) {
        console.error("Error fetching ride data", err);
      }
    };

    fetchRideData();
  }, [rideId]); // Dependency array to run when rideId changes

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
  } = rideData || {}; // Optional chaining in case rideData is null initially

  const userCharges = user?.charges || {};
  const driverCharges = driver?.charges || {};

  // Calculate ride duration in minutes
  const durationMinutes = rideData
    ? Math.floor(
        (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000
      )
    : 0;

  const totalTimeSpent = durationMinutes;

  // Calculate Ride Charges
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
        headingText="Tracking Rider"
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
                    Driver Information
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
                      <strong>Name:</strong> {driver?.fullName}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>Phone:</strong> {driver?.phoneNumber}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>Driving License No:</strong>{" "}
                      {driver?.drivingLicense}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>Car Type:</strong> {vehicle?.carType || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>VIN No:</strong>{" "}
                      {vehicle?.vehicleIdentificationNumber || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>Year:</strong> {vehicle?.year || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>Transmission:</strong>{" "}
                      {vehicle?.transmission || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>Seating Capacity:</strong>{" "}
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
                            src={profileUser} // Assuming profileUser image is for user or driver
                            roundedCircle
                            width={30}
                            height={30}
                            className="me-2"
                          />
                          <div>
                            <small>
                              <strong>
                                {review?.userId?.fullName || "Anonymous"}
                              </strong>
                            </small>
                            <br />
                            <small>
                              {review?.comment || "No comment available"}
                            </small>
                            <br />
                            <small>Rating: {review?.rating || "N/A"}</small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>No reviews yet</div> // Fallback message if there are no reviews
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
                      User Information
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
                      <strong>Name:</strong> {user?.fullName}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex justify-content-between">
                      <strong>Phone:</strong> {user?.phoneNumber}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="booking-info mb-2">
                  <p className="fw-bold">Booking Information</p>
                  <div className="date-time">
                    <Image src={dateIcon} width={15} className="me-2" />
                    Date: {new Date(startTime).toLocaleDateString()}
                  </div>
                  <div className="date-time">
                    <Image src={timeIcon} width={18} className="me-2" />
                    Time: {new Date(startTime).toLocaleTimeString()}
                  </div>
                </div>
                <Row>
                  <div className="trackline">
                    <Col xs={12} className="mb-3">
                      <div className="d-flex">
                        <Image src={pickupIcon} className="location-icon" />
                        <div>
                          <strong>Pickup Location</strong>
                          <br />
                          {pickUpLocation?.address}
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="d-flex">
                        <Image src={dropIcon} className="location-icon" />
                        <div>
                          <strong>Drop Off Location</strong>
                          <br />
                          {dropOffLocation?.address}
                        </div>
                      </div>
                    </Col>
                  </div>
                </Row>
                <div className="ride-details">
                  <div className="ride-meta">
                    <span className="fw-bold">Ride Type:</span>{" "}
                    <span>{rideType}</span>
                  </div>
                  <div className="ride-meta">
                    <span className="fw-bold">Total Time Spent:</span>{" "}
                    <span>{totalTimeSpent} minutes</span>
                  </div>
                  <div className="ride-meta">
                    <span className="fw-bold">Total Ride Charges:</span>{" "}
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
