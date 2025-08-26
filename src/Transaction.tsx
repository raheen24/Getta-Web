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
import profPic from "./assets/images/profpic.png";

interface Transaction {
  _id: string;
  driver: {
    _id: string;
    fullName: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
  driverShare: number;
}

const Transactions: React.FC = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1200);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchTransactions = async (
    startDate?: string,
    endDate?: string,
    keyword?: string
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (keyword) queryParams.append("keyword", keyword);

      const { response } = await apiHelper(
        "GET",
        `vendor/get-transactions?${queryParams.toString()}&page=${currentPage}`
      );

      if (response?.data?.status === 1) {
        setTransactions(response.data.data.transactions);
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
    fetchTransactions();
  }, [currentPage]);

  const filteredTransactions = transactions.filter((t) =>
    t.driver.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
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
                  setCurrentPage(1);
                }}
              />
              <FaSearch />
            </div>
            <div className="search-filter">
              <a onClick={() => setShowFilterModal(true)}>
                <img src={FillterIcon} alt="filter" />
              </a>
            </div>
            <NotificationModal
              show={showFilterModal}
              handleClose={() => setShowFilterModal(false)}
              onApplyFilters={({ startDate, endDate, keyword }) => {
                fetchTransactions(startDate, endDate, keyword);
                setSearchTerm(keyword || "");
                setCurrentPage(1);
              }}
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
                  <tr key={transaction._id} style={{ cursor: "pointer" }}>
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
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(transaction.updatedAt).toLocaleDateString()}
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
                  <td colSpan={4} className="text-center text-muted py-4">
                    {t("transaction.noTransactionsFound")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 px-3">
            <button
              className="btn btn-secondary"
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {t("transaction.previous")}
            </button>
            <span className="text-white">
              {t("transaction.pageOf", { page: currentPage, totalPages })}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {t("transaction.next")}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Transactions;
