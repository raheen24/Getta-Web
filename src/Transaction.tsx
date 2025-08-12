import { useState, useEffect, MouseEvent } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Aside from "./components/Sidebar";
import { FaSearch } from "react-icons/fa";
import FillterIcon from "./assets/images/fillter-icon.png";
import NotificationModal from "./components/NotificationModal";
import { useNavigate } from "react-router-dom";
import { apiHelper } from "../src/services/index";
import { toast } from "react-toastify";
import incomeArrowDown from "./assets/images/income-arrow-down.png";
import { useTranslation } from "react-i18next";

const Transaction = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const navigate = useNavigate();

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

  const fetchTransactions = async (page = 1) => {
    try {
      const { response } = await apiHelper(
        "GET",
        `vendor/get-transactions?page=${page}`
      );

      if (response?.data?.status === 1) {
        const transactionData = response.data.data.transactions;
        const paginationData = response.data.data.pagination;
        setTransactions(transactionData);
        setPagination(paginationData);
      } else {
        toast.error(response?.data?.message || t("transaction.fetchError"));
        setTransactions([]);
      }
    } catch (err) {
      toast.error(t("transaction.somethingWentWrong"));
      console.error("Fetch error:", err);
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchTransactions(pagination.page);
  }, [pagination.page]);

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.driver.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / pagination.limit);

  const paginatedTransactions = filteredTransactions.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
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
        <div className="d-flex w-100 justify-content-between align-items-center mb-3">
          <div>
            <a
              className="track-btn text-decoration-none"
              style={{ borderRadius: "32px" }}
            >
              {t("transaction.newTransaction")}
            </a>
          </div>
          <div className="filters d_flex">
            <div className="searchField">
              <input
                type="text"
                placeholder={t("transaction.searchDriverName")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              />
              <FaSearch />
            </div>
            <div className="search-filter">
              <a onClick={() => setShowModal(true)}>
                <img src={FillterIcon} alt="filter" />
              </a>
            </div>
            <NotificationModal
              show={showModal}
              handleClose={() => setShowModal(false)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover custom-driver-table">
            <thead>
              <tr>
                <th>{t("transaction.driverName")}</th>
                <th>{t("transaction.from")}</th>
                <th>{t("transaction.to")}</th>
                <th>{t("transaction.amount")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="driver-row"
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div className="d-flex track-btn2">
                        <img
                          src={transaction.driver.image || profPic}
                          alt="Driver"
                          className="rounded-circle me-2"
                          width="30"
                          height="30"
                        />
                        <p className="colorofall td_date mb-0 fw-bold">
                          {transaction.driver.fullName}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="colorofall mb-0 income-name">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span className="colorofall mb-0 income-name">
                        {new Date(transaction.updatedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <p className="colorofall td_date mb-0 fs-4 fw-bold">
                        <img
                          src={incomeArrowDown}
                          alt="Income Arrow"
                          className="rounded-circle me-2"
                          width="20"
                          height="20"
                        />
                        ${transaction.driverShare.toFixed(2)}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    {t("transaction.noTransactionsFound")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 px-3">
          <button
            className="btn btn-secondary"
            onClick={() => handlePageClick(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            {t("transaction.previous")}
          </button>
          <span className="text-white">
            {t("transaction.pageOf", { page: pagination.page, totalPages })}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => handlePageClick(pagination.page + 1)}
            disabled={pagination.page === totalPages}
          >
            {t("transaction.next")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Transaction;
