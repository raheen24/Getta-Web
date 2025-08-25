import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import arrowBack from "../assets/images/arrow_back.png";
import Header from "./Header";
import Aside from "./Sidebar";
import { apiHelper } from "../services";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [privacyContent, setPrivacyContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { t, i18n } = useTranslation();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleFetchPrivacyPolicy = async () => {
      setLoading(true);
      try {
        const { response, error } = await apiHelper(
          "GET",
          `common/privacy_policy?lang=${i18n.language}`,
          {}
        );

        if (response && response.data.data) {
          setPrivacyContent(response.data.data);
        } else {
          setError(t("privacyPolicy.noData"));
        }
      } catch (err) {
        setError(t("privacyPolicy.fetchError"));
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    handleFetchPrivacyPolicy();
  }, [i18n.language, t]);

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
              className="backBtn border-0 bg-transparent mb-2"
              onClick={() => navigate(-1)}
            >
              <img src={arrowBack} alt={t("common.back")} />
            </button>
          </div>
          <div className="privacy-policy-sec">
            <h1 className="sub-heading mb-3">{t("privacyPolicy.title")}</h1>
            {loading ? (
              <p>{t("privacyPolicy.loading")}</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <div
                className="terms-content"
                dangerouslySetInnerHTML={{ __html: privacyContent || "" }}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
