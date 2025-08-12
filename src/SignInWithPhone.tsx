import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./assets/images/getta-logo.png";
import GlobalBtn from "./components/GlobalBtn";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./../public/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

const SignInWithPhone: React.FC = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [countryCode, setCountryCode] = useState("");
  const [dialCode, setDialCode] = useState("");

  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response: any) => {
          },
          "expired-callback": () => {
            alert("Recaptcha expired, try again");
          },
        }
      );
    }
  };

  const handleSendOTP = async () => {
    if (!phone.startsWith("+")) {
      alert("Phone number must be in international format like +1234567890");
      return;
    }

    setUpRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      console.log("OTP sent to:", phone);
      navigate("/verification-screen", {
        state: {
          from: location.pathname,
          phone,
          countryCode,
          dialCode,
        },
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("Failed to send OTP. Check the console for details.");
    }
  };

  return (
    <div className="authBg">
      <div className="formBox">
        <h5 className="authTitle">Sign In with Phone</h5>
        <div className="d-flex justify-content-center">
          <img src={logo} alt="GETTA Logo" className="authLogo" />
        </div>
        <div className="my-5 text-center colorofall">
          <h5 className="authTitle">Welcome Back!</h5>
          <p>Please Sign-in to your account</p>
        </div>
        <div className="phone-input-container">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <PhoneInput
            country={"us"}
            enableSearch
            disableSearchIcon
            placeholder="+1 123 456 7890"
            value={phone}
            onChange={(value, country) => {
              setPhone("+" + value);
              setCountryCode(country?.countryCode || "");
              setDialCode(country?.dialCode || "");
            }}
            inputClass="w-full !py-2 !px-4 !border-transparent !bg-transparent"
            containerClass="!border-b !border-gray-300 !rounded-none !bg-transparent"
            buttonClass="!border-transparent !bg-transparent !rounded-none"
            dropdownClass="!border-gray-200 !shadow-lg"
            inputStyle={{
              border: "none",
              boxShadow: "none",
              paddingLeft: "48px",
              width: "100%",
            }}
            containerStyle={{
              background: "transparent",
            }}
            specialLabel=""
          />
        </div>

        <GlobalBtn
          text="Continue"
          color="success"
          className="w-100 mt-5"
          onClick={handleSendOTP}
        />

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default SignInWithPhone;
