import Footer from "./components/Footer";
import Header from "./components/Header";
import profPic from "./assets/images/profpic.png";
import incomeArrowDown from "./assets/images/income-arrow-down.png";
import { useNavigate } from "react-router-dom";
import Aside from "./components/Sidebar";
import { apiHelper } from "../src/services/index";
import { toast } from "react-toastify";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Income = () => {
  const { t } = useTranslation();
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

  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  const fetchDrivers = async (page = 1) => {
    try {
      const { response } = await apiHelper(
        "GET",
        `/vendor/get-income?page=${page}`
      );

      if (response?.data?.status === 1) {
        const payments = response.data.data.payments || [];
        const pagData = response.data.data.pagination;

        const mappedDrivers = payments.map((item) => ({
          name: item.driver?.fullName || "N/A",
          amount: item.amount ? `$${item.amount.toFixed(2)}` : "$0.00",
          status: item.status || "N/A",
          createdAt: moment(item.createdAt).format("MMM D, YYYY"),
          image: item.driver?.image || profPic,
        }));

        setDrivers(mappedDrivers);
        setPagination(pagData);
      } else {
        toast.error(response?.data?.message || t("income.fetchError"));
        setDrivers([]);
      }
    } catch (err) {
      toast.error(t("income.somethingWentWrong"));
      console.error("Fetch error:", err);
      setDrivers([]);
    }
  };

  useEffect(() => {
    fetchDrivers(pagination.page);
  }, [pagination.page]);

  const handleRowClick = () => {
    navigate("/income-details");
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  };

  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content_section">
        <div className="table-responsive">
          <table className="table table-hover custom-driver-table">
            <tbody>
              {/* <tr>
                <th>{t("income.driverName")}</th>
                <th>{t("income.from")}</th>
                <th>{t("income.to")}</th>
                <th>{t("income.amount")}</th>
              </tr> */}
              {drivers.map((driver, index) => (
                <tr
                  key={index}
                  className="driver-row"
                  onClick={handleRowClick}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div className="d-flex track-btn2">
                      <img
                        src={driver.image}
                        alt=""
                        className="rounded-circle me-2"
                        width="30"
                        height="30"
                      />
                      <p className="colorofall td_date mb-0 fw-bold">
                        {driver.name}
                      </p>
                    </div>
                  </td>

                  <td>
                    <div className="d-flex flex-column align-items-start td_date">
                      <span className="text-muted small income-name">
                        {t("income.status")}
                      </span>
                      <span className="colorofall mb-0 income-name">
                        {driver.status}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="d-flex flex-column align-items-start td_date">
                      <span className="text-muted small income-name">
                        {t("income.date")}
                      </span>
                      <span className="colorofall mb-0 income-name">
                        {driver.createdAt}
                      </span>
                    </div>
                  </td>

                  <td>
                    <p className="colorofall td_date mb-0 fs-4 fw-bold">
                      <img
                        src={incomeArrowDown}
                        alt=""
                        className="rounded-circle me-2"
                        width="20"
                        height="20"
                      />
                      {driver.amount}
                    </p>
                  </td>
                </tr>
              ))}
              {drivers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    {t("income.noIncomeData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3 px-3">
          <button
            className="btn btn-secondary"
            onClick={() => handlePageClick(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            {t("income.previous")}
          </button>
          <span className="text-white">
            {t("income.pageOf", {
              page: pagination.page,
              totalPages: pagination.pages,
            })}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => handlePageClick(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            {t("income.next")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Income;
