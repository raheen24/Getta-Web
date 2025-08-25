import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslations } from "../hooks/useTranslations";
import arrowBack from "../assets/images/arrow_back.png";
import Header from "./Header";
import GlobalBtn from "./GlobalBtn";
import Aside from "./Sidebar";
import { toast } from "react-toastify";

const LanguageTab = () => {
  const { t, changeLanguage, getAvailableLanguages } = useTranslations();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "English"
  );

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const navigate = useNavigate();

  // Sidebar responsive toggle
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 1200);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Available languages
  const languages = getAvailableLanguages(); // [{ code: "en", name: "English" }, ... ]

  // Handle language selection
  const handleLanguageChange = (languageCode: string, languageName: string) => {
    setSelectedLanguage(languageName);
    changeLanguage(languageCode);
    localStorage.setItem("language", languageName);
  };

  const goBack = () => navigate(-1);

  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <section className="content_section">
        <div className="back-btn-sec mb-3">
          <button onClick={goBack} className="btn p-0 border-0 bg-transparent">
            <img src={arrowBack} alt={t("common.back")} />
          </button>
        </div>

        <div className="privacy-policy-sec">
          <div className="setting-sec">
            <div className="settingTabs">
              <ul className="nav nav-pills flex-column gap-2" role="tablist">
                {languages.map((lang) => (
                  <li key={lang.code}>
                    <button className="nav-link w-100 text-start">
                      <div className="form-check form-switch">
                        <label
                          className="form-check-label"
                          htmlFor={`lang-${lang.code}`}
                        >
                          {lang.name}
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="languageSelect"
                          id={`lang-${lang.code}`}
                          checked={selectedLanguage === lang.name}
                          onChange={() =>
                            handleLanguageChange(lang.code, lang.name)
                          }
                        />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <GlobalBtn
                text={t("common.change")}
                className="w-75 mt-5"
                onClick={() => {
                  toast.success(
                    `${t("language.languageChanged")} ${selectedLanguage}`
                  );
                  setTimeout(() => navigate("/settings"), 1500);
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LanguageTab;
