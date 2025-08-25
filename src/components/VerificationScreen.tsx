// import React, { useState, useEffect } from "react";
// import { Form, Image } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import logo from "../assets/images/getta-logo.png";
// import GlobalBtn from "./GlobalBtn";
// import CircularProgress from "../components/CircularProgress";
// import { apiHelper } from "../services";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { setToken, setLogin, setUser } from "../../src/redux/slice/userSlice";
// import { useTranslation } from "react-i18next";

// const OTPVerification: React.FC = () => {
//   const { t } = useTranslation();
//   const [otp, setOtp] = useState(Array(6).fill(""));
//   const [loading, setLoading] = useState(false);
//   const [resending, setResending] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const { from } = location.state || {};
//   const { user } = useSelector((state: any) => state.user);
//   const userId = localStorage.getItem("userId");

  // const handleChange = (index: number, value: string) => {
  //   if (/^[0-9]?$/.test(value)) {
  //     const newOtp = [...otp];
  //     newOtp[index] = value;
  //     setOtp(newOtp);

  //     if (value && index < 5) {
  //       document.getElementById(`digit-${index + 2}`)?.focus();
  //     }
  //   }
  // };

//   const handleVerifyOtp = async () => {
//     if (!user?.userId) {
//       toast.error(t("auth.userIdMissing"));
//       return;
//     }

//     const fullOtp = otp.join("");
//     if (fullOtp.length !== 6) {
//       toast.warning(t("auth.enterCompleteOtp"));
//       return;
//     }

//     const requestBody = {
//       userId: user.userId,
//       otp: Number(fullOtp),
//     };

//     setLoading(true);
//     try {
//       const { response, error } = await apiHelper(
//         "POST",
//         "auth/verify-otp",
//         {},
//         requestBody
//       );

//       console.log("API Response:", response);
//       console.log("API Error:", error);

//       if (!response?.data) {
//         toast.error(t("messages.invalidResponse"));
//         setLoading(false);
//         return;
//       }

//       const responseData = response.data.data;
//       const token = responseData?.user?.userAuthToken;
//       const user = responseData?.user;
//       const isProfileCompleted = responseData?.user?.isCompleted;
//       if (!token) {
//         toast.error(t("auth.tokenGenerationFailed"));
//         setLoading(false);
//         return;
//       }

//       // Store token in Redux and update user
//       dispatch(setToken(token));
//       dispatch(setUser(user));
//       dispatch(setLogin({ user, token }));

//       toast.success(t("auth.otpVerificationSuccessful"));

//       // Navigate based on profile completion
//       if (isProfileCompleted) {
//         navigate("/home"); // Profile completed, navigate to home
//       } else {
//         navigate("/create-profile"); // Profile not completed, navigate to create profile
//       }
//     } catch (err) {
//       toast.error(t("messages.somethingWentWrong"));
//       console.error("OTP verification error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle OTP resend request
//   const handleResendOtp = async () => {
//     if (!userId) {
//       toast.error(t("auth.userIdMissing"));
//       return;
//     }

//     const requestBody = { userId };
//     setResending(true);
//     try {
//       await apiHelper("POST", "auth/resend-otp", {}, requestBody);
//       toast.success(t("auth.newOtpSent"));
//     } catch (err) {
//       toast.error(t("auth.failedToResendOtp"));
//       console.error("Resend OTP error:", err);
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <div className="authBg">
//       <div className="formBox otpForm">
//         <h5 className="authTitle">{t("auth.verification")}</h5>
//         <Image src={logo} alt="Logo" className="authLogo" width={100} />
//         <h6 className="authTitle">{t("auth.pleaseVerifyAccount")}</h6>
//         <span className="colorofall">{t("auth.sixDigitCodeSent")}</span>

//         <Form className="d-flex justify-content-center gap-2 my-3">
//           {otp.map((digit, index) => (
//             <Form.Control
//               key={index}
//               type="text"
//               maxLength={1}
//               value={digit}
//               id={`digit-${index + 1}`}
//               onChange={(e) => handleChange(index, e.target.value)}
//               className="otp-input"
//               disabled={loading}
//             />
//           ))}
//         </Form>

//         <GlobalBtn
//           text={loading ? t("auth.verifying") : t("common.continue")}
//           className="w-100 mb-3"
//           onClick={handleVerifyOtp}
//           disabled={loading || resending}
//         />

//         <CircularProgress />
//         <div className="mt-3">
//           <p className="colorofall">
//             {t("auth.didntReceiveCode")}{" "}
//             <a
//               href="#"
//               className="colorofall"
//               onClick={!resending ? handleResendOtp : undefined}
//             >
//               {resending ? t("auth.resending") : t("auth.resend")}
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OTPVerification;
import React, { useState } from "react";
import { Form, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/images/getta-logo.png";
import GlobalBtn from "./GlobalBtn";
import { apiHelper } from "../services";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setLogin, setUser } from "../../src/redux/slice/userSlice";
import { useTranslation } from "react-i18next";
import CountdownTimer from "./CircularProgress";

const OTPVerification: React.FC = () => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null); // NEW

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { from } = location.state || {};
  const { user } = useSelector((state: any) => state.user);

  const getEffectiveUserId = () => (user?.userId ? String(user.userId) : null);

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`digit-${index + 2}`)?.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const effectiveUserId = getEffectiveUserId();
    if (!effectiveUserId) {
      toast.error(t("auth.userIdMissing"));
      return;
    }

    // const fullOtp = otp.join("");
    // if (fullOtp.length !== 6) {
    //   toast.warning(t("auth.enterCompleteOtp"));
    //   return;
    // }
    const isAllEmpty = otp.every((d) => d.trim() === "");
    const isAnyEmpty = otp.some((d) => d.trim() === "");
    if (isAllEmpty) {
      toast.warning(t("common.fieldsCantBeEmpty", "These fields can't be empty"));
      document.getElementById("digit-1")?.focus();
      return;
    }
    if (isAnyEmpty) {
      toast.error(t("common.fieldsCantBeEmpty", "These fields can't be empty"));
      const firstEmpty = otp.findIndex((d) => d.trim() === "");
      if (firstEmpty !== -1) {
        document.getElementById(`digit-${firstEmpty + 1}`)?.focus();
      }
      return;
    }

    const fullOtp = otp.join("");
    const requestBody: any = {
      userId: String(effectiveUserId),
      otp: Number(fullOtp),
    };
    if (otpRequestId) requestBody.otpRequestId = otpRequestId;

    setLoading(true);
    try {
      const { response } = await apiHelper(
        "POST",
        "auth/verify-otp",
        {},
        requestBody
      );

      const res = response?.data;
      if (!res) {
        toast.error(t("messages.invalidResponse"));
        setLoading(false);
        return;
      }
      if (res.status === 0) {
        toast.error(res.message || t("auth.invalidOtp"));
        setLoading(false);
        return;
      }

      const data = res.data;
      const token = data?.user?.userAuthToken;
      const userResp = data?.user;
      const isProfileCompleted = data?.user?.isCompleted;

      if (!token) {
        toast.error(t("auth.tokenGenerationFailed"));
        setLoading(false);
        return;
      }

      dispatch(setToken(token));
      dispatch(setUser(userResp));
      dispatch(setLogin({ user: userResp, token }));

      toast.success(t("auth.otpVerificationSuccessful"));

      if (isProfileCompleted) {
        navigate("/home");
      } else {
        navigate("/create-profile");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("messages.somethingWentWrong");
      toast.error(msg);
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const effectiveUserId = getEffectiveUserId();
    if (!effectiveUserId) {
      toast.error(t("auth.userIdMissing"));
      return;
    }
    if (!canResend) return;

    const requestBody = { userId: String(effectiveUserId) };
    setResending(true);
    try {
      const { response } = await apiHelper(
        "POST",
        "auth/resend-otp",
        {},
        requestBody
      );
      const res = response?.data;
      const possibleId =
        res?.data?.otpRequestId ||
        res?.data?.requestId ||
        res?.data?.otpId ||
        null;
      setOtpRequestId(possibleId);

      toast.success(t("auth.newOtpSent"));

      setOtp(Array(6).fill(""));
      setCanResend(false);
      setTimerKey((k) => k + 1);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("auth.failedToResendOtp");
      toast.error(msg);
      console.error("Resend OTP error:", err);
    } finally {
      setResending(false);
    }
  };
  

  return (
    <div className="authBg">
      <div className="formBox otpForm">
        <h5 className="authTitle">{t("auth.verification")}</h5>
        <Image src={logo} alt="Logo" className="authLogo" width={100} />
        <h6 className="authTitle">{t("auth.pleaseVerifyAccount")}</h6>
        <span className="colorofall">{t("auth.sixDigitCodeSent")}</span>

        <Form className="d-flex justify-content-center gap-2 my-3">
          {otp.map((digit, index) => (
            <Form.Control
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              id={`digit-${index + 1}`}
              onChange={(e) => handleChange(index, e.target.value)}
              className="otp-input"
              disabled={loading}
            />
          ))}
        </Form>

        <GlobalBtn
          text={loading ? t("auth.verifying") : t("common.continue")}
          className="w-100 mb-3"
          onClick={handleVerifyOtp}
          disabled={loading || resending}
        />

        {/* Countdown timer controls resend availability */}
        <div className="d-flex justify-content-center my-3">
          <CountdownTimer
            key={timerKey}
            duration={60}
            resetTrigger={timerKey}
            onFinish={() => setCanResend(true)}
          />
        </div>

        <div className="mt-3">
          <p className="colorofall">
            {t("auth.didntReceiveCode")}{" "}
            <button
              type="button"
              className="colorofall btn btn-link p-0 align-baseline"
              onClick={handleResendOtp}
              disabled={loading || resending || !canResend}
              aria-disabled={loading || resending || !canResend}
              style={{
                opacity: loading || resending || !canResend ? 0.6 : 1,
                pointerEvents:
                  loading || resending || !canResend ? "none" : "auto",
              }}
            >
              {resending ? t("auth.resending") : t("auth.resend")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
