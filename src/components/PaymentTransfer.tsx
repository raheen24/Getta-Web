import { useState, useEffect } from "react";
import { Button, Image } from "react-bootstrap";
import Header from "./Header";
import profPic from "../assets/images/profpic.png";
import arrowBack from "../assets/images/arrow_back.png";
import { useNavigate } from "react-router-dom";
import Aside from "./Sidebar";
import { apiHelper } from "../services/index";
import { toast } from "react-toastify";

interface Driver {
  img: string;
  name: string;
  from: string;
  to: string;
  amount: string;
}

const PaymentTransfer = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [balance, setBalance] = useState<number>(0); // State to hold balance
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

  const [activeTab, setActiveTab] = useState("completed");

  const completed = [
    {
      img: profPic,
      name: "Ivan Smith",
      from: "Sept 14,2022",
      to: "Sept 30, 2022",
      amount: "$1254.00",
    },
    {
      img: profPic,
      name: "Ivan Smith",
      from: "Sept 14,2022",
      to: "Sept 30, 2022",
      amount: "$1254.00",
    },
    {
      img: profPic,
      name: "Ivan Smith",
      from: "Sept 14,2022",
      to: "Sept 30, 2022",
      amount: "$1254.00",
    },
  ];

  const pending = [
    {
      img: profPic,
      name: "Ivan Smith",
      from: "Oct 01,2022",
      to: "Oct 15, 2022",
      amount: "$654.00",
    },
  ];

  const navigate = useNavigate();

  const fetchBalance = async () => {
    try {
      const { response } = await apiHelper("GET", `vendor/get-balance`);

      if (response?.data?.status === 1) {
        setBalance(response.data.data.balance); // Set balance from response
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
    fetchBalance(); // Fetch balance when the component is mounted
  }, []);

  const handlePaymentTransfer = () => {
    navigate("/payment-transfer-acc");
  };

  const renderList = (list: Driver[]) =>
    list.map((driver: Driver, idx: number) => (
      <div
        key={idx}
        className="d-flex justify-content-between align-items-start p-3 border-bottom bg-white"
      >
        <div className="d-flex align-items-center" style={{ width: "20%" }}>
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

        <div className="d-flex align-items-start" style={{ width: "30%" }}>
          <div className="d-flex flex-column align-items-start td_date">
            <span className="colorofall small income-name">From</span>
            <span className="colorofall mb-0 income-name fs-7 fw-semibold text-start">
              Sep 14, 2022
            </span>
          </div>
        </div>

        <div className="d-flex align-items-start" style={{ width: "30%" }}>
          <div className="d-flex flex-column align-items-start td_date">
            <span className="colorofall small income-name">To</span>
            <span className="colorofall mb-0 income-name fs-7 fw-semibold text-start">
              Sep 30, 2022
            </span>
          </div>
        </div>

        <div className="text-end" style={{ width: "15%" }}>
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
        headingText="Payment Transfer"
      />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content_section">
        <div className="text-center my-4">
          <h2 className="fw-bold" style={{ color: "#70927f" }}>
            {balance ? `$${balance.toFixed(2)}` : "$0.00"}
          </h2>
          <p className="text-muted mb-3">Available Balance</p>
          <Button
            variant="outline-success"
            onClick={handlePaymentTransfer}
            style={{ minWidth: "200px" }}
          >
            Transfer
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
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </div>
          <div
            className={`px-3 pb-2 fw-bold ms-4 ${
              activeTab === "pending"
                ? "border-bottom border-3 border-dark"
                : "text-muted"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveTab("pending")}
          >
            Pending
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
