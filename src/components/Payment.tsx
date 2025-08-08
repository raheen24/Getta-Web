import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GlobalBtn from "./GlobalBtn";
import { ListGroup } from "react-bootstrap";
import Header from "./Header";
import Aside from "./Sidebar";
import { apiHelper } from "../services/index";
import { toast } from "react-toastify";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { driverId } = useParams();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const goBack = () => {
    navigate(-1);
  };

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

  const fetchPaymentDetails = async () => {
    if (!driverId) return;
    try {
      const { response } = await apiHelper(
        "GET",
        `vendor/get-payment-detail/${driverId}`
      );

      if (response?.data?.status === 1) {
        setPaymentDetails(response.data.data);
      } else {
        toast.error(
          response?.data?.message || "Failed to fetch payment details."
        );
      }
    } catch (err) {
      toast.error("Something went wrong while fetching payment details.");
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [driverId]);

  const {
    totalUnpaidRides,
    totalFare,
    driverShare,
    vendorShare,
    payments,
    vehicle,
  } = paymentDetails || {};

  const dateRange = payments?.[0]?.rideId
    ? `${new Date(
        payments[0].rideId.startTime
      ).toLocaleDateString()} to ${new Date(
        payments[0].rideId.endTime
      ).toLocaleDateString()}`
    : "N/A";
  const vinNumber = vehicle?.vehicleIdentificationNumber || "N/A";
  const carType = vehicle?.carType || "N/A";
  const driverName = payments?.[0]?.driverId?.fullName || "N/A";

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
        headingText="Payment"
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content_section">
        <div className="charges-sec">
          <h5 className="text-center fw-bold colorofall">Payment</h5>
          <ListGroup variant="flush">
            <ListGroup.Item className="border-0">
              <div className="justify-content-between d-flex mb-3">
                <div className="d-flex align-items-center fw-bold">
                  Date: {dateRange}
                </div>
                <div className="d-flex align-items-center fw-bold">
                  Total Rides: {totalUnpaidRides || "N/A"}
                </div>
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <div className="justify-content-between d-flex">
                <div className="d-flex align-items-center fw-bold">
                  {vinNumber}
                </div>
                <div className="d-flex align-items-center fw-bold">
                  {carType}
                </div>
              </div>
            </ListGroup.Item>
            <div className="border-bottom my-3"></div>
            <ListGroup.Item className="border-0 ">
              <div className="justify-content-between d-flex fw-bold">
                <strong>Name:</strong> {driverName}
              </div>
            </ListGroup.Item>
            <div className="border-bottom my-3"></div>

            <ListGroup.Item className="border-0">
              <div className="justify-content-between d-flex fw-bold">
                <strong>Total Rides Cost</strong> $
                {totalFare?.toFixed(2) || "N/A"}
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <div className="justify-content-between d-flex fw-bold">
                <strong>Vendor Charges 20%</strong> $
                {vendorShare?.toFixed(2) || "N/A"}
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <div className="justify-content-between d-flex fw-bold">
                <strong>Driver Share</strong> $
                {driverShare?.toFixed(2) || "N/A"}
              </div>
            </ListGroup.Item>
            <div className="border-bottom my-3"></div>

            <ListGroup.Item className="border-0">
              <div className="justify-content-between d-flex fw-bold">
                <strong>Total Cost</strong> $
                {(totalFare + vendorShare || 0).toFixed(2)}
              </div>
            </ListGroup.Item>
          </ListGroup>

          <div className="d-flex justify-content-center">
            <GlobalBtn
              text="Pay Now"
              color="success"
              className="w-50 mt-5"
              navigateTo="/payment-transfer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
