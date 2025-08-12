import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./assets/images/getta-logo.png";
import { MdEmail } from "react-icons/md";
import GlobalBtn from "./components/GlobalBtn";
import { apiHelper } from "./services";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setUser, setFcmToken } from "./redux/slice/userSlice";
import { requestFirebaseNotificationPermission } from "./../public/notificationService";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const SignInWithEmail: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fcmToken } = useSelector((state: any) => state.user);

  const handleSigin = async () => {
    if (!email.trim()) {
      toast.error(t("validation.enterEmail"));
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      toast.error(t("validation.invalidEmail"));
      return;
    }

    setLoading(true);

    const requestBody = {
      email,
      userDeviceToken: fcmToken,
      userDeviceType: "ios",
      role: "vendor",
      authProvider: "email",
    };

    try {
      const { response, error } = await apiHelper(
        "POST",
        "/auth/sign-in",
        {},
        requestBody
      );

      console.log("API Response:", response);
      console.log("API Error:", error);

      if (response?.data?.status === 1 && response?.data?.data?.userId) {
        const userData = {
          userId: response.data.data.userId,
          email: response.data.data.email,
        };
        const fcmToken = await requestFirebaseNotificationPermission();
        if (fcmToken) {
          dispatch(setFcmToken(fcmToken));
        }

        dispatch(setUser(userData));
        toast.success(t("auth.otpSent"));

        setTimeout(() => {
          navigate("/verification-screen");
        }, 1500);
      } else {
        const message =
          response?.data?.message ||
          error?.response?.data?.message ||
          t("auth.signInFailed");
        toast.error(message);
      }
    } catch (err: any) {
      toast.error(t("messages.somethingWentWrong"));
      console.error("Catch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authBg">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="formBox">
        <h5 className="text-center mb-3 authTitle">
          {t("auth.signInWithEmail")}
        </h5>
        <div className="d-flex justify-content-center">
          <img src={logo} alt="GETTA Logo" className="authLogo" />
        </div>
        <div className="text-center colorofall">
          <h5 className="authTitle">{t("auth.welcomeBack")}</h5>
          <p className="para">{t("auth.pleaseSignIn")}</p>
        </div>
        <div className="text-start my-3">
          <label className="form-label colorofall">{t("auth.email")}</label>
          <div className="input-group">
            <span className="input-group-text bg-transparent pe-2">
              <MdEmail />
            </span>
            <input
              type="email"
              className="form-control border-start-0 py-3"
              placeholder="ivansmith@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <GlobalBtn
          text={loading ? t("auth.signingIn") : t("common.continue")}
          color="success"
          className="w-100"
          onClick={handleSigin}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default SignInWithEmail;
