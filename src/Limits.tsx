import Footer from "./components/Footer";
import Header from "./components/Header";
import GlobalBtn from "./components/GlobalBtn";
import Aside from "./components/Sidebar";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { apiHelper } from "./services";
import { toast } from "react-toastify";

const MAX_DIGITS = 6;

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
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [cancellation, setCancellation] = useState("");
  const [cities, setCities] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const savedLimits = localStorage.getItem("limits");
    console.log("Loaded limits from storage:", savedLimits);
    if (savedLimits) {
      const data = JSON.parse(savedLimits);
      setCancellation(data.cancellation || data.cancellation === 0 ? String(data.cancellation) : "");
      setCities(data.cities || data.cities === 0 ? String(data.cities) : "");
      setTime(data.time || data.time === 0 ? String(data.time) : "");
    } else {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed.limits) {
          setCancellation(parsed.limits.cancellation?.toString() || "");
          setCities(parsed.limits.cities?.toString() || "");
          setTime(parsed.limits.time?.toString() || "");
        }
      }
    }
  }, []);

  const handleNumericChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, MAX_DIGITS);
    setter(digitsOnly);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cancellation || !cities || !time) {
      toast.error(t("validation.fillAllFields"));
      return;
    }

    const requestBody = {
      cancellation: parseFloat(cancellation),
      cities: parseFloat(cities),
      time: parseFloat(time),
    };

    try {
      const { response } = await apiHelper(
        "POST",
        "vendor/set-limits",
        {},
        requestBody
      );

      if (response?.data?.status === 1 || response?.status === 200) {
        toast.success(t("limits.savedSuccessfully") || "Limits saved successfully!");

        const responseData = response.data?.data || response.data || requestBody;
        const limitsData = responseData.limits || responseData;
        localStorage.setItem("limits", JSON.stringify(limitsData));
        console.log("Saved to storage:", limitsData);
        setCancellation(limitsData.cancellation?.toString() || "");
        setCities(limitsData.cities?.toString() || "");
        setTime(limitsData.time?.toString() || "");
      } else {
        toast.error(response?.data?.message || t("limits.saveFailed") || "Failed to save limits.");
      }
    } catch (err) {
      toast.error(t("messages.somethingWentWrong"));
      console.error("Error:", err);
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
        <div className="charges-sec bg-all">
          <div className="charges-input-box ">
            <form onSubmit={handleSubmit}>
              <div className="form-group mt-3">
                <label htmlFor="cancellation">{t('limits.cancellation')}</label>
<input
                  type="number"
                  className="form-control"
                  id="cancellation"
                  placeholder={t('limits.enterCancellation')}
                  value={cancellation}
                  onChange={(e) => handleNumericChange(setCancellation, e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="cities">{t('limits.citiesLimits')}</label>
                <input
                  type="number"
                  className="form-control"
                  id="cities"
                  placeholder={t('limits.enterCitiesLimit')}
                  value={cities}
                  onChange={(e) => handleNumericChange(setCities, e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="time">{t('limits.timeLimit')}</label>
                <input
                  type="number"
                  className="form-control"
                  id="time"
                  placeholder={t('limits.enterTimeLimit')}
                  value={time}
                  onChange={(e) => handleNumericChange(setTime, e.target.value)}
                />
              </div>
              <GlobalBtn text={t('common.save')} className="w-100 mt-4" type="submit" />
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Limits;
