import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import GlobalBtn from "./GlobalBtn";
import Header from "./Header";
import arrowBack from "../assets/images/arrow_back.png";
import { Form } from "react-bootstrap";
import { FaUniversity } from "react-icons/fa";
import TransferModal from "./PaymentSuccessModal";
import Aside from "./Sidebar";
interface PaymentTransferAccProps {
  selectedDriver: {
    name: string;
  };
}

const PaymentTransferAcc: React.FC<PaymentTransferAccProps> = ({
  selectedDriver,
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const goBack = () => {
    navigate(-1);
  };
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
  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content_section">
        <div className="back-btn-sec mb-3 d-flex align-items-center">
          <button onClick={goBack} className="back-btn">
            <img src={arrowBack} alt="Back" />
          </button>
          <h5 className="back-title">Tracking Rider</h5>
        </div>

        <div className="charges-sec bg-all">
          <div>
            <h5 className="fw-bold mb-3">
              {selectedDriver?.name || "Driver Name"}
            </h5>

            <Form.Group controlId="formAmount" className="mb-4">
              <Form.Control type="text" placeholder="Enter Amount" />
            </Form.Group>

            <div className="payment-method-box mb-4">
              <div className="bank-icon-wrapper me-3">
                <FaUniversity size={18} color="#4B5563" />
              </div>
              <div className="flex-grow-1">
                <span className="fw-semibold text-dark">
                  Bank Name: ******5487
                </span>
              </div>
              <input type="radio" name="bank" checked readOnly />
            </div>

            <GlobalBtn
              text="Pay Now"
              color="success"
              className="w-100 mt-5"
              onClick={() => setShowModal(true)}
            />

            <TransferModal
              show={showModal}
              handleClose={() => setShowModal(false)}
              selectedDriver={{ name: "Ivan Smith" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTransferAcc;
