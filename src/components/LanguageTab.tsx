// import { useState , useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslations } from "../hooks/useTranslations";
// import arrowBack from "../assets/images/arrow_back.png";
// import Header from "./Header";
// import GlobalBtn from "./GlobalBtn";
// import Aside from "./Sidebar";
// const LanguageTab = () => {
//   const { t, changeLanguage, getAvailableLanguages } = useTranslations();
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 1200) {
//         setSidebarOpen(false);
//       } else {
//         setSidebarOpen(true);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize(); // Call on initial render
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   const [selectedLanguage, setSelectedLanguage] = useState("English");

//   const languages = getAvailableLanguages();

//   const handleLanguageChange = (languageCode: string, languageName: string) => {
//     setSelectedLanguage(languageName);
//     changeLanguage(languageCode);
//   };
//   const navigate = useNavigate();

//   const goBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div
//       className={`bg-mains ${
//         isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
//       }`}
//     >
//       <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <section className="content_section">
//         <div className="back-btn-sec mb-3">
//           <button onClick={goBack} className="btn p-0 border-0 bg-transparent">
//             <img src={arrowBack} alt="Back" />
//           </button>
//         </div>

//         <div className="privacy-policy-sec">
//           <div className="setting-sec">
//             <div className=" settingTabs">
//               <ul
//                 className="nav nav-pills flex-column gap-2 "
//                 id="pills-tab"
//                 role="tablist"
//               >
//                 {languages.map((lang) => (
//                   <li key={lang.code}>
//                     <button className="nav-link w-100 text-start">
//                       <div className="form-check form-switch">
//                         <label
//                           className="form-check-label"
//                           htmlFor={`lang-${lang.code}`}
//                         >
//                           {lang.name}
//                         </label>
//                         <input
//                           className="form-check-input"
//                           type="radio"
//                           name="languageSelect"
//                           id={`lang-${lang.code}`}
//                           checked={selectedLanguage === lang.name}
//                           onChange={() => handleLanguageChange(lang.code, lang.name)}
//                         />
//                       </div>
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//               <GlobalBtn
//                 text={t('common.change')}
//                 className="w-75 mt-5"
//                 onClick={() => alert(`${t('language.languageChanged')} ${selectedLanguage}`)}
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default LanguageTab;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslations } from "../hooks/useTranslations";
import arrowBack from "../assets/images/arrow_back.png";
import Header from "./Header";
import GlobalBtn from "./GlobalBtn";
import Aside from "./Sidebar";

const LanguageTab = () => {
  const { t, changeLanguage, getAvailableLanguages } = useTranslations();
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

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "English" // Get saved language from localStorage or default to English
  );

  const languages = getAvailableLanguages();

  // Handle language change
  const handleLanguageChange = (languageCode: string, languageName: string) => {
    setSelectedLanguage(languageName);
    changeLanguage(languageCode);
    localStorage.setItem("language", languageName); // Save selected language in localStorage
  };

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Check if language is set in localStorage and apply it
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
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
        <div className="back-btn-sec mb-3">
          <button onClick={goBack} className="btn p-0 border-0 bg-transparent">
            <img src={arrowBack} alt="Back" />
          </button>
        </div>

        <div className="privacy-policy-sec">
          <div className="setting-sec">
            <div className="settingTabs">
              <ul
                className="nav nav-pills flex-column gap-2 "
                id="pills-tab"
                role="tablist"
              >
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
                          onChange={() => handleLanguageChange(lang.code, lang.name)}
                        />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <GlobalBtn
                text={t('common.change')}
                className="w-75 mt-5"
                onClick={() => alert(`${t('language.languageChanged')} ${selectedLanguage}`)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LanguageTab;
