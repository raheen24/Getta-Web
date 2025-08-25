import React from "react";
import { Modal } from "react-bootstrap";
import LogoutIcon from "../assets/images/log_out.png";
import GlobalBtn from "./GlobalBtn";
import { useDispatch } from "react-redux";
import { setLogout } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiHelper } from "../services";
import { useTranslations } from "../hooks/useTranslations";

interface LogoutModalProps {
  show: boolean;
  handleClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslations();

  const handleLogoutAndRedirect = async () => {
    try {
      const { response, error } = await apiHelper("POST", "auth/sign-out", {});
      if (error) {
        toast.error(t("logout.logoutFailed"));
        return;
      }
      if (response?.data?.status === 1) {
        dispatch(setLogout());
        localStorage.removeItem("userToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("isLoggedIn");
        toast.success(t("logout.loggedOutSuccessfully"));
        navigate("/sign-in");
      } else {
        toast.error(t("logout.logoutFailed"));
      }
    } catch (err) {
      toast.error(t("logout.logoutError"));
      console.error("Logout error:", err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <div className="text-center p-3">
          <div className="logoutModal_icon d-block mb-3">
            <img src={LogoutIcon} alt={t("logout.logout")} />
          </div>
          <h3 className="heading mb-4">{t("logout.confirmLogout")}</h3>
          <div className="d-flex justify-content-center gap-3">
            <button className="track-btn-down" onClick={handleClose}>
              {t("common.cancel")}
            </button>
            <GlobalBtn
              text={t("logout.logout")}
              className="cta w-100"
              onClick={handleLogoutAndRedirect}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LogoutModal;
