import Footer from "./components/Footer";
import Header from "./components/Header";
import GlobalBtn from "./components/GlobalBtn";
import Aside from "./components/Sidebar";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
const Limits = () => {
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
    handleResize(); // Call on initial render
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content_section">
        <div className="charges-sec bg-all">
          <div className="charges-input-box ">
            <form>
              <div className="form-group mt-3">
                <label htmlFor="chargesPerKM">{t('limits.cancellation')}</label>
                <input type="text" className="form-control" id="chargesPerKM" />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="chargesPerMinute">{t('limits.citiesLimits')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="chargesPerMinute"
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="serviceCharges">{t('limits.timeLimit')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="serviceCharges"
                />
              </div>
              <GlobalBtn text={t('common.save')} className="w-100 mt-4" />
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Limits;
