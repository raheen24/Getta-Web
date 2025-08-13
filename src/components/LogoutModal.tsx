import React from "react";
import { Modal } from "react-bootstrap";
import LogoutIcon from "../assets/images/log_out.png";
import GlobalBtn from "./GlobalBtn";
import { useDispatch } from "react-redux";
import { setLogout } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiHelper } from "../services";

interface LogoutModalProps {
  show: boolean;
  handleClose: () => void;
}
const LogoutModal: React.FC<LogoutModalProps> = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogoutAndRedirect = async () => {
    try {
      const { response, error } = await apiHelper("POST", "auth/sign-out", {});
      if (error) {
        toast.error("Logout failed. Please try again.");
        return;
      }
      if (response?.data?.status === 1) {
        dispatch(setLogout());
        localStorage.removeItem("userToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("isLoggedIn");
        toast.success("You have logged out successfully.");
        navigate("/sign-in");
      }
      else {
        toast.error("Failed to log out. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred while logging out.");
      console.error("Logout error:", err);
    }
  };


  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <div className="text-center p-3">
          <a
            href="javascript:void(0)"
            className="logoutModal_icon d-block mb-3"
          >
            <img src={LogoutIcon} alt="Logout" />
          </a>
          <h3 className="heading mb-4">Are you sure you want to logout?</h3>
          <div className="d-flex justify-content-center gap-3">
            <button className="track-btn-down" onClick={handleClose}>
              Cancel
            </button>
            <GlobalBtn
              text="Logout"
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
