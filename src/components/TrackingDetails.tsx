// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { io } from "socket.io-client";
// import { Image, Card, Row, Col, Badge, ListGroup } from "react-bootstrap";
// import mapImage from "../assets/images/map-2.png";
// import profileDriver from "../assets/images/profile-drive.png";
// import profileUser from "../assets/images/profile-drive-2.png";
// import pickupIcon from "../assets/images/pickup-icon.png";
// import dropIcon from "../assets/images/drop-icon.png";
// import dateIcon from "../assets/images/date-icon.png";
// import timeIcon from "../assets/images/time-icon.png";
// import arrowBack from "../assets/images/arrow_back.png";
// import Header from "./Header";
// import Aside from "./Sidebar";

// const TrackingDetails = () => {
//   const location = useLocation();
//   const { driver } = location.state;
//   const [driverLocation, setDriverLocation] = useState(null);
//   const [isSidebarOpen, setSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   useEffect(() => {
//     const socket = io("https://getta-api-new.deployment-uat.com", {
//       transports: ["websocket"],
//       query: { driverId: driver._id },
//     });

//     socket.on("driverLocation", (locationData) => {
//       setDriverLocation(locationData);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [driver]);

//   const goBack = () => {
//     window.history.back();
//   };

//   return (
//     <div
//       className={`bg-mains ${
//         isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
//       }`}
//     >
//       {/* Header */}
//       <Header
//         isSidebarOpen={isSidebarOpen}
//         toggleSidebar={toggleSidebar}
//         showBackButton={true}
//         showHeading={true}
//         headingText="Tracking Details"
//       />

//       {/* Sidebar */}
//       <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

//       {/* Main content section */}
//       <div className="content_section">
//         <Row>
//           {/* Driver Info */}
//           <Col md={6}>
//             <Card className="mb-4">
//               <Card.Body>
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <Card.Title className="mb-0">Driver Information</Card.Title>
//                   <Image
//                     src={profileDriver}
//                     roundedCircle
//                     width={60}
//                     height={60}
//                   />
//                 </div>
//                 <ListGroup variant="flush">
//                   <ListGroup.Item className="border-0">
//                     <div className="justify-content-between d-flex">
//                       <strong>Name:</strong>
//                       {driver.name}
//                     </div>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="border-0">
//                     <div className="justify-content-between d-flex">
//                       <strong>Phone:</strong> {driver.phoneNumber}
//                     </div>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="border-0">
//                     <div className="justify-content-between d-flex">
//                       <strong>Car Type:</strong> {driver.vehicle?.carType}
//                     </div>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="border-0">
//                     <div className="justify-content-between d-flex">
//                       <strong>VIN No:</strong>{" "}
//                       {driver.vehicle?.vehicleIdentificationNumber}
//                     </div>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="border-0">
//                     <div className="justify-content-between d-flex">
//                       <strong>Year:</strong> {driver.vehicle?.year}
//                     </div>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="border-0">
//                     <div className="justify-content-between d-flex">
//                       <strong>Transmission:</strong>{" "}
//                       {driver.vehicle?.transmission}
//                     </div>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="border-0">
//                     <div className="justify-content-between d-flex">
//                       <strong>Seating Capacity:</strong>{" "}
//                       {driver.vehicle?.seatingCapacity}
//                     </div>
//                   </ListGroup.Item>
//                 </ListGroup>

//                 <div className="mt-4">
//                   <strong>Reviews</strong>{" "}
//                   <Badge bg="warning" text="dark">
//                     ★ {driver.averageRating || "N/A"}
//                   </Badge>
//                 </div>
//               </Card.Body>
//             </Card>
//             {/* User Info */}
//             <Card className="mb-4">
//               <Card.Body>
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <Card.Title className="mb-0">User Information</Card.Title>
//                   <Image
//                     src={profileUser}
//                     roundedCircle
//                     width={60}
//                     height={60}
//                   />
//                 </div>
//                 <ListGroup variant="flush">
//                   <ListGroup.Item className="border-0">
//                     <div className="justify-content-between d-flex">
//                       <strong>Name:</strong> {driver.user?.name}
//                     </div>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="border-0">
//                     <div className="justify-content-between d-flex">
//                       <strong>Phone:</strong> {driver.user?.phoneNumber}
//                     </div>
//                   </ListGroup.Item>
//                 </ListGroup>

//                 <div className="mt-4">
//                   <strong>Reviews</strong>{" "}
//                   <Badge bg="warning" text="dark">
//                     ★ {driver.user?.averageRating || "N/A"}
//                   </Badge>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>

//           {/* Map + Driver's Location */}
//           <Col md={6}>
//             <Card className="mb-4">
//               <Card.Body className="p-2">
//                 <Image src={mapImage} alt="Map" fluid rounded />
//               </Card.Body>
//             </Card>

//             <Card>
//               <Card.Body>
//                 <div className="d-flex justify-content-between">
//                   <div>
//                     <Image src={dateIcon} width={18} className="me-2" /> Date:
//                     Sept 12, 2023
//                   </div>
//                   <div>
//                     <Image src={timeIcon} width={18} className="me-2" /> Time:
//                     10:00am
//                   </div>
//                 </div>
//                 <hr />

//                 <Row>
//                   <Col xs={12} className="mb-3">
//                     <div className="d-flex">
//                       <Image
//                         src={pickupIcon}
//                         width={20}
//                         className="me-2 mt-1"
//                       />
//                       <div>
//                         <strong>Pickup Location</strong>
//                         <br />
//                         {driverLocation?.address || "Loading..."}
//                       </div>
//                     </div>
//                   </Col>
//                   <Col xs={12}>
//                     <div className="d-flex">
//                       <Image src={dropIcon} width={20} className="me-2 mt-1" />
//                       <div>
//                         <strong>Drop Off Location</strong>
//                         <br />
//                         {"Abc Line, Santa Ana, CA 85486"}{" "}
//                         {/* Replace with dynamic data */}
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>

//                 <Row className="mt-3">
//                   <Col md={4}>
//                     <strong>Ride Type:</strong>{" "}
//                     <span className="text-primary">Pre Booking</span>
//                   </Col>
//                   <Col md={4}>
//                     <strong>Total Time Spent:</strong> 1h 19min
//                   </Col>
//                   <Col md={4}>
//                     <strong>Ride Charges:</strong> $80.00
//                   </Col>
//                 </Row>

//                 {driverLocation ? (
//                   <div className="mt-3">
//                     <strong>Driver Current Location:</strong>
//                     <p>Latitude: {driverLocation.coordinates[1]}</p>
//                     <p>Longitude: {driverLocation.coordinates[0]}</p>
//                   </div>
//                 ) : (
//                   <p>Waiting for driver location...</p>
//                 )}
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// };

// export default TrackingDetails;
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { Image, Card, Row, Col, Badge, ListGroup } from "react-bootstrap";
import mapImage from "../assets/images/map-2.png";
import profileDriver from "../assets/images/profile-drive.png";
import profileUser from "../assets/images/profile-drive-2.png";
import pickupIcon from "../assets/images/pickup-icon.png";
import dropIcon from "../assets/images/drop-icon.png";
import dateIcon from "../assets/images/date-icon.png";
import timeIcon from "../assets/images/time-icon.png";
import arrowBack from "../assets/images/arrow_back.png";
import Header from "./Header";
import Aside from "./Sidebar";

const TrackingDetails = () => {
  const location = useLocation();
  const { driver } = location.state || {}; // Ensure driver is defined, otherwise handle gracefully
  const [driverLocation, setDriverLocation] = useState<any | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!driver?._id) {
      console.error("No driver found in location state.");
      return;
    }

    const socket = io("https://getta-api-new.deployment-uat.com", {
      transports: ["websocket"],
      query: { driverId: driver._id },
    });

    socket.on("driverLocation", (locationData) => {
      if (locationData && locationData.coordinates) {
        setDriverLocation(locationData);
      }
      setLoading(false); // Stop loading once the location data is received
    });

    return () => {
      socket.disconnect();
    };
  }, [driver]);

  const goBack = () => {
    window.history.back();
  };

  if (!driver) {
    return <div>No driver data available</div>; // Gracefully handle if the driver object is missing
  }

  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      {/* Header */}
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        showBackButton={true}
        showHeading={true}
        headingText="Tracking Details"
      />

      {/* Sidebar */}
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content section */}
      <div className="content_section">
        <Row>
          {/* Driver Info */}
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Card.Title className="mb-0">Driver Information</Card.Title>
                  <Image
                    src={profileDriver}
                    roundedCircle
                    width={60}
                    height={60}
                  />
                </div>
                <ListGroup variant="flush">
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>Name:</strong>
                      {driver.name || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>Phone:</strong> {driver.phoneNumber || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>Car Type:</strong>{" "}
                      {driver.vehicle?.carType || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>VIN No:</strong>{" "}
                      {driver.vehicle?.vehicleIdentificationNumber || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>Year:</strong> {driver.vehicle?.year || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>Transmission:</strong>{" "}
                      {driver.vehicle?.transmission || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>Seating Capacity:</strong>{" "}
                      {driver.vehicle?.seatingCapacity || "N/A"}
                    </div>
                  </ListGroup.Item>
                </ListGroup>

                <div className="mt-4">
                  <strong>Reviews</strong>{" "}
                  <Badge bg="warning" text="dark">
                    ★ {driver.averageRating || "N/A"}
                  </Badge>
                </div>
              </Card.Body>
            </Card>

            {/* User Info */}
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Card.Title className="mb-0">User Information</Card.Title>
                  <Image
                    src={profileUser}
                    roundedCircle
                    width={60}
                    height={60}
                  />
                </div>
                <ListGroup variant="flush">
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>Name:</strong> {driver.user?.name || "N/A"}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="justify-content-between d-flex">
                      <strong>Phone:</strong>{" "}
                      {driver.user?.phoneNumber || "N/A"}
                    </div>
                  </ListGroup.Item>
                </ListGroup>

                <div className="mt-4">
                  <strong>Reviews</strong>{" "}
                  <Badge bg="warning" text="dark">
                    ★ {driver.user?.averageRating || "N/A"}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Map + Driver's Location */}
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body className="p-2">
                <Image src={mapImage} alt="Map" fluid rounded />
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <Image src={dateIcon} width={18} className="me-2" /> Date:
                    Sept 12, 2023
                  </div>
                  <div>
                    <Image src={timeIcon} width={18} className="me-2" /> Time:
                    10:00am
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
                        <strong>Pickup Location</strong>
                        <br />
                        {driverLocation?.address || "Loading..."}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="d-flex">
                      <Image src={dropIcon} width={20} className="me-2 mt-1" />
                      <div>
                        <strong>Drop Off Location</strong>
                        <br />
                        {"Abc Line, Santa Ana, CA 85486"}{" "}
                        {/* Replace with dynamic data */}
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={4}>
                    <strong>Ride Type:</strong>{" "}
                    <span className="text-primary">Pre Booking</span>
                  </Col>
                  <Col md={4}>
                    <strong>Total Time Spent:</strong> 1h 19min
                  </Col>
                  <Col md={4}>
                    <strong>Ride Charges:</strong> $80.00
                  </Col>
                </Row>

                {loading ? (
                  <p>Waiting for driver location...</p>
                ) : (
                  driverLocation && (
                    <div className="mt-3">
                      <strong>Driver Current Location:</strong>
                      <p>Latitude: {driverLocation.coordinates[1]}</p>
                      <p>Longitude: {driverLocation.coordinates[0]}</p>
                    </div>
                  )
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TrackingDetails;
