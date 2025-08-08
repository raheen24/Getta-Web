import Header from "./Header";
import Aside from "./Sidebar";
import PieChartComponent from "./PieChartComponent";
import AreaChartComponent from "./AreaChartComponent";
import profileDrive from "../assets/images/profile-drive.png";
import { FaStar } from "react-icons/fa";
import MapofBottomProf from "./MapofBottom";
import PublishModal from "./PublishModal";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import { apiHelper } from "../services";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useState, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";

interface Driver {
  _id: string;
  image?: string;
  driverName?: string;
  name?: string;
  email?: string;
  averageRating?: number;
  rating?: number;
}

interface DriverStats {
  total: number;
  online: number;
  offline: number;
  onRides: number;
}

interface DriverStats2 {
  total: number;
  online: number;
  offline: number;
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

const Dashboard = () => {
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
    handleResize(); // Call on initial render
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [selectedTime, setSelectedTime] = useState<string>("0");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverStats, setDriverStats] = useState<DriverStats>({
    total: 0,
    online: 0,
    offline: 0,
    onRides: 0,
  });
  const [driverStats2, setDriverStats2] = useState<DriverStats2>({
    total: 0,
    online: 0,
    offline: 0,
  });
  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [revenueGraphData, setRevenueGraphData] = useState([]);
  const [recentRevenue, setRecentRevenue] = useState({
    date: "",
    revenue: 0,
    change: "0.0",
  });
  const {user,token} = useSelector((state: any) => state.user);
  console.log(token);
  const navigate = useNavigate();

  const handleTimeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleSeeAllClick = () => {
    navigate("/my-drivers");
  };

  const handleSeeProfile = (driver) => {
    navigate(`/drivers-profile`, {
      state: driver,
    });
  };
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const driverId = query.get("id");

  // const fetchDrivers = async () => {
  //   try {
  //     const { response } = await apiHelper("GET", "vendor/get-drivers");
  //     if (response?.data?.status === 1) {
  //       setDrivers(
  //         (response.data.data || []).map((item: any) => ({
  //           ...item.driver,
  //           vehicle: item.vehicle,
  //           averageRating: item.averageRating,
  //           totalReviews: item.totalReviews,
  //         }))
  //       );
  //     } else {
  //       toast.error(response?.data?.message || "Failed to fetch drivers.");
  //       setDrivers([]);
  //     }
  //   } catch (err) {
  //     toast.error("Something went wrong while fetching drivers.");
  //     console.error("Fetch error:", err);
  //     setDrivers([]);
  //   }
  // };
  const fetchDrivers = async () => {
    try {
      const { response } = await apiHelper("GET", "vendor/get-drivers");
      if (response?.data?.status === 1) {
        setDrivers(
          (response.data.data || []).map((item: any) => ({
            ...item.driver,
            vehicle: item.vehicle,
            // Ensure averageRating is a number
            averageRating: item.averageRating
              ? parseFloat(item.averageRating)
              : undefined,
            totalReviews: item.totalReviews,
          }))
        );
      } else {
        toast.error(response?.data?.message || "Failed to fetch drivers.");
        setDrivers([]);
      }
    } catch (err) {
      toast.error("Something went wrong while fetching drivers.");
      console.error("Fetch error:", err);
      setDrivers([]);
    }
  };
  const fetchStats = async () => {
    try {
      const { response } = await apiHelper("GET", "vendor/get-driver-stats");
      if (response?.data?.status === 1) {
        const stats = response.data.data;
        setDriverStats({
          total: stats.totalDrivers || 0,
          online: stats.activeDrivers || 0,
          offline: stats.inactiveDrivers || 0,
          onRides: stats.driversOnRides || 0,
        });
      } else {
        toast.error(response?.data?.message || "Failed to fetch stats.");
      }
    } catch (err) {
      toast.error("Something went wrong while fetching stats.");
      console.error("Stats fetch error:", err);
    }
  };

  const fetchTotalDrivers = async () => {
    try {
      const { response } = await apiHelper("GET", "vendor/get-stats");
      if (response?.data?.status === 1) {
        const stats = response.data.data;
        const total = stats.totalDrivers || 0;
        const online = stats.onlineDrivers || 0;
        const offline = stats.offlineDrivers || 0;

        setDriverStats2({ total, online, offline });

        const totalForPercentage = online + offline || 1;

        setPieData([
          {
            name: "Online Drivers",
            value: (online / totalForPercentage) * 100,
            color: "#73BE67",
          },
          {
            name: "Offline Drivers",
            value: (offline / totalForPercentage) * 100,
            color: "#FF0000",
          },
        ]);
      } else {
        toast.error(response?.data?.message || "Failed to fetch stats.");
      }
    } catch (err) {
      toast.error("Something went wrong while fetching stats.");
      console.error("Stats fetch error:", err);
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const { response } = await apiHelper("GET", "vendor/get-revenue");
      if (response?.data?.status === 1) {
        const revenue = response.data.data?.totalRevenue || 0;
        setTotalRevenue(revenue);
      } else {
        toast.error(response?.data?.message || "Failed to fetch revenue.");
      }
    } catch (err) {
      toast.error("Something went wrong while fetching revenue.");
      console.error("Revenue fetch error:", err);
    }
  };

  const revenueGraph = async () => {
    try {
      const { response } = await apiHelper("GET", "vendor/get-revenue-graph");
      if (response?.data?.status === 1) {
        const data = response.data.data || [];

        const formattedData = data.map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          revenue: item.totalRevenue || 0,
        }));

        setRevenueGraphData(formattedData);

        // Get latest and previous revenue
        const len = data.length;
        if (len >= 2) {
          const latest = data[len - 1];
          const previous = data[len - 2];

          const percentChange =
            previous.totalRevenue > 0
              ? ((latest.totalRevenue - previous.totalRevenue) /
                  previous.totalRevenue) *
                100
              : 0;

          setRecentRevenue({
            date: new Date(latest.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            revenue: latest.totalRevenue || 0,
            change: percentChange.toFixed(1), // e.g., "3.4"
          });
        }
      } else {
        toast.error(response?.data?.message || "Failed to fetch revenue.");
      }
    } catch (err) {
      toast.error("Something went wrong while fetching revenue.");
      console.error("Revenue fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchStats();
    fetchTotalDrivers();
    fetchTotalRevenue();
    revenueGraph();
  }, []);

  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <section className="content_section orders_Sec">
        <div className="home_page bg_wrapper">
          <div className="row">
            <div className="col-12 col-md-7 col-lg-7 mb-2">
              <div className="smb-heading">
                <h1 className="sub-heading">SMB has Successfully Registered</h1>
                <button
                  data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  onClick={() => setShowModal(true)}
                  data-bs-target="#exampleModal"
                  className="text-white rounded-3 p-1 px-4"
                  style={{ backgroundColor: "#70927F" }}
                >
                  Publish
                </button>
                <PublishModal
                  show={showModal}
                  handleClose={() => setShowModal(false)}
                />
              </div>
              <div className="bg_white bgColor">
                <div
                  className="titleSection"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <p className="title">Statistics</p>
                  <div className="inputField">
                    <select value={selectedTime} onChange={handleTimeChange}>
                      <option value="0">Last 7 Days</option>
                      <option value="1">Last 6 Days</option>
                      <option value="2">Last 5 Days</option>
                      <option value="3">Last 4 Days</option>
                      <option value="4">Last 3 Days</option>
                      <option value="5">Last 2 Days</option>
                      <option value="6">Last 1 Day</option>
                    </select>
                  </div>
                </div>
                <div className="pieChart_section">
                  <div className="pieChartLeftSect">
                    <h3
                      className="numText totalDrivers"
                      data-aos="fade-up"
                      data-aos-duration="1500"
                    >
                      {driverStats2.total.toLocaleString()}
                      <span className="bgBlue">+0%</span>
                    </h3>
                    <ul className="Barbers_list">
                      <li data-aos="fade-up" data-aos-duration="2000">
                        <p>Online Drivers</p>
                        <span className="numText">
                          {driverStats2.online.toLocaleString()}
                          <span className="bgBlue">+0%</span>
                        </span>
                      </li>
                      <li data-aos="fade-up" data-aos-duration="3000">
                        <p>Offline Drivers</p>
                        <span className="numText">
                          {driverStats2.offline.toLocaleString()}
                          <span className="bgBlue">+0%</span>
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="pieChartRightSect">
                    <div id="chartContainer" style={{ height: "250px" }}>
                      <PieChartComponent pieData={pieData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 col-lg-5 mb-2">
              <div className="bgColor bg_white">
                <div
                  className="titleSection"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <p className="title">REVENUE</p>
                  {/* <h3 className="numText totalRevenue">
                      {totalRevenue.toLocaleString(undefined, {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                      })}
                    </h3> */}
                  <h3 className="numText totalRevenue">
                    {totalRevenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h3>
                </div>
                <ul className="Barbers_list">
                  <li
                    data-aos="fade-up"
                    data-aos-duration="2000"
                    className="recentDate"
                  >
                    <p style={{ color: "#70927F" }}>{recentRevenue.date}</p>
                    <span className="numText">
                      {recentRevenue.revenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span className="bgBlue">
                        {parseFloat(recentRevenue.change) >= 0 ? "+" : ""}
                        {recentRevenue.change}%
                      </span>
                    </span>
                  </li>
                </ul>

                <div id="chartContainer2" style={{ height: "224px" }}>
                  <AreaChartComponent data={revenueGraphData} />
                </div>
              </div>
            </div>
          </div>
          <div className="index-my-drivers">
            <div className="my-drivers-heading">
              <h2 className="sub-heading">My Drivers</h2>
              <a onClick={handleSeeAllClick}>See All</a>
            </div>
            <Row>
              {/* <div className="drivers-box-sec"> */}
              {drivers.map((driver) => (
                <Col lg={3} md={4} sm={6} className="mb-3" key={driver._id}>
                  <div key={driver._id} className="driver-card">
                    <img
                      src={
                        driver.image
                          ? `https://getta-api.deployment-uat.com/${driver.image.replace(
                              /\\/g,
                              "/"
                            )}`
                          : profileDrive
                      }
                      alt="Driver"
                      className="driver-image"
                    />
                    <h6 className="driver-name">
                      {driver.driverName || driver.name || driver.fullName}
                    </h6>
                    <p className="driver-email">{driver.email || "No email"}</p>
                    <div className="driver-rating">
                      {[...Array(5)].map((_, index) => (
                        <FaStar key={index} className="star-icon" />
                      ))}
                      <span className="rating-value">
                        {driver.averageRating?.toFixed(1) ||
                          driver.rating ||
                          "0.0"}
                      </span>
                    </div>
                    <a
                      onClick={() => handleSeeProfile(driver)}
                      className="bgBlue"
                    >
                      View Profile
                    </a>
                  </div>
                </Col>
              ))}
              {/* </div> */}
            </Row>
          </div>
          <div className="index-my-drivers-map ">
            <div className="row">
              <div className="col-12 col-md-5 col-lg-4 mb-2">
                <div className="my-drivers-map bg_white">
                  <h2 className="sub-heading">My Drivers</h2>
                  <ul>
                    <li>
                      <span>Total Drivers Listed</span>
                      <span>{driverStats.total}</span>
                    </li>
                    <li>
                      <span>Online Drivers</span>
                      <span>{driverStats.online}</span>
                    </li>
                    <li>
                      <span>Offline Drivers</span>
                      <span>{driverStats.offline}</span>
                    </li>
                    <li>
                      <span>Drivers on Rides</span>
                      <span>{driverStats.onRides}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-md-7 col-lg-8">
                <div className="location_map">
                  <MapofBottomProf />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
