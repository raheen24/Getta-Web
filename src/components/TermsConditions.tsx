import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import arrowBack from "../assets/images/arrow_back.png";
import Header from "./Header";
import Aside from "./Sidebar";
import { apiHelper } from "../services";

const TermsAndConditionsTab = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [termsContent, setTermsContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleFetchTermsAndConditions = async () => {
      setLoading(true);
      try {
        const { response, error } = await apiHelper(
          "GET",
          "common/terms_and_conditions",
          {}
        );
        if (response && response.data.data) {
          setTermsContent(response.data.data);
        } else {
          setError("Failed to fetch terms and conditions: No data found");
        }
      } catch (err) {
        setError(
          "Unexpected error occurred while fetching terms and conditions."
        );
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    handleFetchTermsAndConditions();
  }, []);

  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <section className="content_section">
        <div className="my_drivers_page bg_wrapper">
          <div className="back-btn-sec">
            <button
              className="backBtn border-0 bg-transparent"
              onClick={() => navigate(-1)}
            >
              <img src={arrowBack} alt="Back" />
            </button>
          </div>
          <div className="privacy-policy-sec">
            <h1 className="sub-heading mb-2">Terms and Conditions</h1>
            {loading ? (
              <p>Loading terms and conditions...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <div
                className="terms-content"
                dangerouslySetInnerHTML={{ __html: termsContent || "" }}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditionsTab;
