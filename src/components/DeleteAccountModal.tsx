import React from "react";
import { Modal, Button } from "react-bootstrap";
import { BsXCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { apiHelper } from "../services";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setDeleteAccount } from "../redux/slice/userSlice";
import { useTranslation } from "react-i18next";

interface DeleteAccountModalProps {
  show: boolean;
  handleClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  show,
  handleClose,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleConfirm = async () => {
    try {
      const { response, error } = await apiHelper(
        "POST",
        "common/delete-account",
        {},
        {}
      );

      if (response) {
        toast.success(response.message || t("deleteAccount.success"));
        dispatch(setDeleteAccount());
        navigate("/sign-in");
      } else {
        toast.error(error?.response?.data?.message || t("deleteAccount.fail"));
      }
    } catch (err) {
      toast.error(t("deleteAccount.error"));
      console.error("Error deleting account:", err);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      className="text-center"
    >
      <Modal.Body>
        <div className="d-flex justify-content-center align-items-center mb-3">
          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "70px",
              height: "70px",
              backgroundColor: "#d7e1dd",
            }}
          >
            <BsXCircle size={40} color="#0a3d3f" />
          </div>
        </div>
        <h5 className="fw-bold mb-3 text-dark">{t("deleteAccount.heading")}</h5>
        <p className="fw-semibold">{t("deleteAccount.confirmMessage")}</p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            className="w-100 rounded-3"
          >
            {t("deleteAccount.no")}
          </Button>
          <Button
            style={{
              background: "linear-gradient(to right, #1e403f, #031e2a)",
              border: "none",
            }}
            className="w-100 rounded-3 text-white"
            onClick={handleConfirm}
          >
            {t("deleteAccount.yes")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteAccountModal;
