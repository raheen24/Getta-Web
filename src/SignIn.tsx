import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./assets/images/getta-logo.png";
import { MdEmail } from "react-icons/md";
import phoneIcon from "./assets/images/phone-icon.png";
import { FaGoogle, FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { appleProvider, auth, provider } from "./../public/firebase";
import { apiHelper } from "./services";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/sign-in-with-email");
  };


  const handleClickPhone = () => {
    navigate("/sign-in-with-phone");
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      toast.success(`${t('messages.welcome')} ${user.displayName || t('common.user')}!`);
      console.log("Apple Sign-In Success", user);
    } catch (error) {
      toast.error(t('auth.appleSignInFailed'));
      console.error("Apple Sign-In Error", error);
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      const requestBody = {
        email: user.email,
        authProvider: "google",
        userDeviceToken: "1234567890", 
        userDeviceType: "ios",
        userSocialToken: token,
        role: "user",
      };
      const { response, error } = await apiHelper(
        "POST",
        "/auth/social-sign-in",
        {},
        requestBody
      );

      if (response) {
        console.log("API success:", response.data);

        localStorage.setItem("userToken", token);
        localStorage.setItem("userEmail", user.email ?? "");
        localStorage.setItem("isLoggedIn", "true");

        if(response?.data?.data?.isCompleted){
          navigate('/home')
        }else{
          navigate('/create-profile')
        }
        
      } else {
        console.error("API error:", error?.response?.data || error);
      }
    } catch (error) {
      console.error("🔥 Firebase Sign-In error:", error);
    }
  };

  return (
    <div className="authBg">
      <div className="formBox">
        <img src={logo} alt="GETTA Logo" className="authLogo" />

        <button className="btn cta mb-3" onClick={handleClick}>
          <MdEmail /> {t('auth.signInWithEmail')}
        </button>

        <button className="btn cta mb-3" onClick={handleClickPhone}>
          <img src={phoneIcon} alt="phone icon" /> {t('auth.signInWithPhone')}
        </button>

        <button
          className="btn cta mb-3"
          style={{ background: "#F84D3B" }}
          onClick={handleSignIn}
        >
          <FaGoogle /> {t('auth.signInWithGoogle')}
        </button>

        <button className="btn cta" style={{ background: "#000" }} onClick={handleAppleSignIn}>
          <FaApple /> {t('auth.signInWithApple')}
        </button>

        <p className="mt-3 text-muted mt-5">
          {t('auth.bySigningIn')} <br />
          <Link to="/terms" className="fw-bold" style={{ color: "#002250" }}>
            {t('auth.termsAndPrivacy')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
