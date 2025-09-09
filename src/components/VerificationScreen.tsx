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
    if (!user?.userId) {
      toast.error(t("auth.userIdMissing"));
      return;
    }

    const isAllEmpty = otp.every((d) => d.trim() === "");
    const isAnyEmpty = otp.some((d) => d.trim() === "");
    if (isAllEmpty) {
      toast.warning(
        t("common.fieldsCantBeEmpty", {
          defaultValue: "OTP field can't be empty",
        })
      );
      document.getElementById("digit-1")?.focus();
      return;
    }
    if (isAnyEmpty) {
      toast.error(
        t("common.fieldsCantBeEmpty", {
          defaultValue: "OTP field can't be empty",
        })
      );
      const firstEmpty = otp.findIndex((d) => d.trim() === "");
      if (firstEmpty !== -1) {
        document.getElementById(`digit-${firstEmpty + 1}`)?.focus();
      }
      return;
    }

    const fullOtp = otp.join("");
    const requestBody: any = {
      userId: user.userId,
      otp: Number(fullOtp),
    };
    if (otpRequestId) requestBody.otpRequestId = otpRequestId;

    setLoading(true);

    const normalizeOtpError = (
      resOrErr: any
    ): "expired" | "invalid" | "other" => {
      const msg = String(resOrErr?.message || resOrErr || "").toLowerCase();
      const code = resOrErr?.errorCode || resOrErr?.code;

      if (
        msg.includes("expired") ||
        msg.includes("not found") ||
        code === "OTP_EXPIRED" ||
        code === 4002
      ) {
        return "expired";
      }
      if (msg.includes("invalid") || code === "INVALID_OTP" || code === 4001) {
        return "invalid";
      }
      return "other";
    };

    try {
      const { response, error } = await apiHelper(
        "POST",
        "auth/verify-otp",
        {},
        requestBody
      );

      const res = response?.data;

      if (!res) {
        toast.error(t("messages.invalidOtp"));
        return;
      }

      console.log("OTP Verify Response:", res);
      if (res.status === 0 || res.success === false) {
        const type = normalizeOtpError(res);
        if (type === "expired") {
          toast.error(
            t(
              "auth.otpExpired",
              "Your OTP has expired. Please request a new one."
            )
          );
        } else if (type === "invalid") {
          toast.error(t("auth.invalidOtp", "Invalid OTP. Please try again."));
        } else {
          toast.error(res.message || t("messages.somethingWentWrong"));
        }
        return;
      }

      const responseData = response.data.data;
      const token = responseData?.user?.userAuthToken;
      const user = responseData?.user;
      const isProfileCompleted = responseData?.user?.isCompleted;
      if (!token) {
        toast.error(t("auth.tokenGenerationFailed"));
        setLoading(false);
        return;
      }

      dispatch(setToken(token));
      dispatch(setUser(user));
      dispatch(setLogin({ user, token }));

      toast.success(t("auth.otpVerificationSuccessful"));
      if (isProfileCompleted) {
        navigate("/home"); 
      } else {
        navigate("/create-profile"); 
      }
    } catch (err) {
      toast.error(t("messages.somethingWentWrong"));
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
      console.log("Resend OTP Response:", res);

      const possibleId =
        res?.data?.otpRequestId ||
        res?.data?.requestId ||
        res?.data?.otpId ||
        null;
      setOtpRequestId(possibleId);
      toast.success(
        res?.message ||
          t("auth.newOtpSent", "A new OTP has been sent to your number.")
      );
      setOtp(Array(6).fill(""));
      setCanResend(false);
      setTimerKey((k) => k + 1);
    } catch (err: any) {
      console.error("Resend OTP error:", err?.response?.data || err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("auth.failedToResendOtp", "Failed to resend OTP. Please try again.");
      toast.error(msg);
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
