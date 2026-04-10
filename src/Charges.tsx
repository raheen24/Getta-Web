import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Aside from "./components/Sidebar";
import GlobalBtn from "./components/GlobalBtn";
import { apiHelper } from "./services";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/slice/userSlice";
import { useTranslation } from "react-i18next";

const MAX_DIGITS = 6;

const Charges = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1200);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dispatch = useDispatch();

  const [perMile, setPerMile] = useState("");
  const [perMinute, setPerMinute] = useState("");
  const [service, setService] = useState("");

  useEffect(() => {
    const savedCharges = localStorage.getItem("charges");
    console.log("Loaded charges from storage:", savedCharges);
    if (savedCharges) {
      const data = JSON.parse(savedCharges);
      setPerMile(data.perMile || data.perMile === 0 ? String(data.perMile) : "");
      setPerMinute(data.perMinute || data.perMinute === 0 ? String(data.perMinute) : "");
      setService(data.service || data.service === 0 ? String(data.service) : "");
    } else {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed.charges) {
          setPerMile(parsed.charges.perMile?.toString() || "");
          setPerMinute(parsed.charges.perMinute?.toString() || "");
          setService(parsed.charges.service?.toString() || "");
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

    if (!perMile || !perMinute || !service) {
      toast.error(t("validation.fillAllFields"));
      return;
    }

    const requestBody = {
      perMile: parseFloat(perMile),
      perMinute: parseFloat(perMinute),
      service: parseFloat(service),
    };

    try {
      const { response } = await apiHelper(
        "POST",
        "vendor/set-charges",
        {},
        requestBody
      ); 

      console.log("Charges response:", response);

      if (response?.data?.status === 1 || response?.status === 200) {
        toast.success(t("charges.savedSuccessfully"));

        const responseData = response.data?.data || response.data || requestBody;
        const chargesData = responseData.charges || responseData;
        localStorage.setItem("charges", JSON.stringify(chargesData));
        console.log("Saved to storage:", chargesData);
        setPerMile(chargesData.perMile?.toString() || "");
        setPerMinute(chargesData.perMinute?.toString() || "");
        setService(chargesData.service?.toString() || "");
      } else {
        toast.error(response?.data?.message || t("charges.saveFailed"));
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
          <div className="charges-input-box">
            <form onSubmit={handleSubmit}>
              <div className="form-group mt-3">
                <label htmlFor="perMile">{t("charges.perKm")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="perMile"
                  placeholder={t("charges.enterChargesPerKm")}
                  value={perMile}
                  onChange={(e) =>
                    handleNumericChange(setPerMile, e.target.value)
                  }
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="perMinute">{t("charges.perMinute")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="perMinute"
                  placeholder={t("charges.enterChargesPerMinute")}
                  value={perMinute}
                  onChange={(e) =>
                    handleNumericChange(setPerMinute, e.target.value)
                  }
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="service">{t("charges.serviceCharges")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="service"
                  placeholder={t("charges.enterServiceCharges")}
                  value={service}
                  onChange={(e) =>
                    handleNumericChange(setService, e.target.value)
                  }
                />
              </div>

              <GlobalBtn
                text={t("common.save")}
                className="w-100 mt-4"
                type="submit"
              />
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Charges;
