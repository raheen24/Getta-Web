import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalBtn from "./GlobalBtn";
import Header from "./Header";
import { Form } from "react-bootstrap";
import { FaUniversity } from "react-icons/fa";
import TransferModal from "./PaymentSuccessModal";
import Aside from "./Sidebar";
import { useTranslation } from "react-i18next";
import { apiHelper } from "./../services";
import { toast } from "react-toastify";

interface PaymentTransferAccProps {
  selectedDriver?: {
    id: string;
    name: string;
  };
}

const PaymentTransferAcc: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDriver = location.state?.selectedDriver;

  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1200) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePayment = async () => {
    if (!amount || parseInt(amount) <= 0) {
      toast.error("Amount field can’t be empty");
      return;
    }

    if (!selectedDriver?.id) {
      toast.error("Driver not selected");
      return;
    }

    try {
      const { response } = await apiHelper(
        "POST",
        `vendor/pay-driver/${selectedDriver.id}`,
        {},
        { amount: parseInt(amount) }
      );

      if (response?.data?.status === 1) {
        toast.success("Payment successful!");
        setShowModal(true);
      } else {
        toast.error(response?.data?.message || "Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong during payment");
    }
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
        showBackButton
        headingText={t("paymentTransferAcc.paymentTransfer")}
        showHeading
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content_section">
        <div className="charges-sec bg-all">
          <div>
            <h5 className="fw-bold mb-3">
              {selectedDriver?.name || t("paymentTransferAcc.driverName")}
            </h5>
            <Form.Group controlId="formAmount" className="mb-4">
              <Form.Control
                type="text"
                inputMode="numeric"
                placeholder={t("paymentTransferAcc.enterAmount")}
                value={amount}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, "");
                  setAmount(digitsOnly.slice(0, 6));
                }}
              />
            </Form.Group>

            <div className="payment-method-box mb-4">
              <div className="bank-icon-wrapper me-3">
                <FaUniversity size={18} color="#4B5563" />
              </div>
              <div className="flex-grow-1">
                <span className="fw-semibold text-dark">
                  {t("paymentTransferAcc.bankName")}
                </span>
              </div>
              <input type="radio" name="bank" checked readOnly />
            </div>

            <GlobalBtn
              text={t("paymentTransferAcc.payNow")}
              color="success"
              className="w-100 mt-5"
              onClick={handlePayment}
            />

            <TransferModal
              show={showModal}
              handleClose={() => setShowModal(false)}
              selectedDriver={selectedDriver}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTransferAcc;
