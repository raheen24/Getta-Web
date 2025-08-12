import { useState, useEffect } from "react";
import { Button, Image } from "react-bootstrap";
import Header from "./Header";
import profPic from "../assets/images/profpic.png";
import { useNavigate } from "react-router-dom";
import Aside from "./Sidebar";
import { apiHelper } from "../services/index";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Driver {
  img: string;
  name: string;
  from: string;
  to: string;
  amount: string;
}

const PaymentTransfer = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [completed, setCompleted] = useState<Driver[]>([]);
  const [pending, setPending] = useState<Driver[]>([]);
  const [activeTab, setActiveTab] = useState("completed");

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

  const navigate = useNavigate();

  const fetchBalance = async () => {
    try {
      const { response } = await apiHelper("GET", `vendor/get-balance`);

      if (response?.data?.status === 1) {
        setBalance(response.data.data.balance);
      } else {
        toast.error(response?.data?.message || t("paymentTransfer.fetchError"));
      }
    } catch (err) {
      toast.error(t("paymentTransfer.somethingWentWrong"));
      console.error("Fetch error:", err);
    }
  };

  const fetchPayments = async (status: string) => {
    try {
      const { response } = await apiHelper(
        "GET",
        `vendor/get-payment-history?status=${status}`
      );

      if (response?.data?.status === 1) {
        const payments = response.data.data.payments.map((payment: any) => ({
          img: profPic,
          name: payment.driverId.email,
          from: new Date(payment.rideId.createdAt).toLocaleDateString(),
          to: new Date(payment.driverPaidDate).toLocaleDateString(),
          amount: `$${payment.amount.toFixed(2)}`,
        }));

        if (status === "completed") {
          setCompleted(payments);
        } else {
          setPending(payments);
        }
      } else {
        toast.error(response?.data?.message || t("paymentTransfer.fetchError"));
      }
    } catch (err) {
      toast.error(t("paymentTransfer.somethingWentWrong"));
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchPayments("completed");
    fetchPayments("pending");
  }, []);

  const handlePaymentTransfer = () => {
    navigate("/payment-transfer-acc");
  };

  const renderList = (list: Driver[]) =>
    list.map((driver: Driver, idx: number) => (
      <div
        key={idx}
        className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white"
      >
        <div className="d-flex align-items-center" style={{ width: "30%" }}>
          <Image
            src={driver.img}
            alt=""
            roundedCircle
            width={40}
            height={40}
            className="me-3"
          />
          <p className="colorofall td_date mb-0 fw-semibold">{driver.name}</p>
        </div>

        <div className="d-flex align-items-center" style={{ width: "30%" }}>
          <div className="d-flex flex-column align-items-start td_date">
            <span className="colorofall small income-name">
              {t("paymentTransfer.from")}
            </span>
            <span className="colorofall mb-0 income-name fs-7  text-start">
              {driver.from}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center" style={{ width: "30%" }}>
          <div className="d-flex flex-column align-items-start td_date">
            <span className="colorofall small income-name">
              {t("paymentTransfer.to")}
            </span>
            <span className="colorofall mb-0 income-name fs-7  text-start">
              {driver.to}
            </span>
          </div>
        </div>

        <div className="text-center " style={{ width: "10%" }}>
          <p className="colorofall td_date mb-0 fs-6 fw-semibold">
            {driver.amount}
          </p>
        </div>
      </div>
    ));

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
        headingText={t("paymentTransfer.payment")}
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content_section">
        <div className="text-center my-4">
          <h2 className="fw-bold" style={{ color: "#70927f" }}>
            {balance ? `$${balance.toFixed(2)}` : "$0.00"}
          </h2>
          <p className="text-muted mb-3">
            {t("paymentTransfer.availableBalance")}
          </p>
          <Button
            variant="outline-success"
            onClick={handlePaymentTransfer}
            style={{ minWidth: "200px" }}
          >
            {t("paymentTransfer.transfer")}
          </Button>
        </div>

        <div className="d-flex justify-content-center mb-3 border-bottom">
          <div
            className={`px-3 pb-2 fw-bold ${
              activeTab === "completed"
                ? "border-bottom border-3 border-dark"
                : "text-muted"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveTab("completed");
              fetchPayments("completed");
            }}
          >
            {t("paymentTransfer.completed")}
          </div>
          <div
            className={`px-3 pb-2 fw-bold ms-4 ${
              activeTab === "pending"
                ? "border-bottom border-3 border-dark"
                : "text-muted"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveTab("pending");
              fetchPayments("pending");
            }}
          >
            {t("paymentTransfer.pending")}
          </div>
        </div>

        <div className="rounded bg-white shadow-sm">
          {activeTab === "completed"
            ? renderList(completed)
            : renderList(pending)}
        </div>
      </div>
    </div>
  );
};

export default PaymentTransfer;
