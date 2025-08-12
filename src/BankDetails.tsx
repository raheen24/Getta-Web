import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import GlobalBtn from "./components/GlobalBtn";
import { apiHelper } from "./services";
import { setUser, setLogin, setToken } from "./redux/slice/userSlice";
import { RootState } from "./redux";
import ContinueModal from "./components/ContinueModal";

const BankDetails: React.FC = () => {
  const { t } = useTranslation();
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [showContinue, setShowContinue] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state: RootState) => state.user);
  const handleBankDetailsSubmit = async () => {
    if (!token) {
      toast.error(t("auth.authenticationError"));
      return;
    }
    if (!bankName || !accountNumber || !accountHolderName || !routingNumber) {
      toast.error(t("validation.fillAllFields"));
      return;
    }
    const formData = new FormData();
    formData.append("bankName", bankName);
    formData.append("accountNumber", accountNumber);
    formData.append("accountHolderName", accountHolderName);
    formData.append("routingNumber", routingNumber);

    try {
      const { response, error } = await apiHelper(
        "POST",
        "common/complete-profile-bank",
        { Authorization: `Bearer ${token}` },
        formData
      );

      if (response?.data) {
        dispatch(setUser(response.data.data));
        dispatch(setToken(response.data.data.userAuthToken));

        toast.success(t("bankDetails.updatedSuccessfully"));

        setShowContinue(true);
      } else {
        toast.error(t("bankDetails.updateFailed"));
      }
    } catch (err) {
      toast.error(t("messages.somethingWentWrong"));
      console.error(err);
    }
  };

  return (
    <div className="authBg">
      <div className="formBox createProfileForm">
        <h5 className="authTitle">{t("bankDetails.title")}</h5>
        <Form className="text-start">
          <Row>
            <Col lg={6} md={6} className="mb-2">
              <Form.Group className="inputField mb-3">
                <Form.Label>{t("bankDetails.bankName")}</Form.Label>
                <Form.Control
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={6} md={6} className="mb-2">
              <Form.Group className="inputField mb-3">
                <Form.Label>{t("bankDetails.accountNumber")}</Form.Label>
                <Form.Control
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={6} md={6} className="mb-2">
              <Form.Group className="inputField mb-3">
                <Form.Label>{t("bankDetails.accountHolderName")}</Form.Label>
                <Form.Control
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col lg={6} md={6} className="mb-2">
              <Form.Group className="inputField mb-3">
                <Form.Label>{t("bankDetails.routingNumber")}</Form.Label>
                <Form.Control
                  type="number"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <GlobalBtn
          text={t("common.continue")}
          color="success"
          className="w-50 mx-auto cta"
          onClick={handleBankDetailsSubmit}
        />
        <ContinueModal
          show={showContinue}
          handleClose={() => setShowContinue(false)}
          handleContinue={() => navigate("/home")}
        />
      </div>
    </div>
  );
};

export default BankDetails;
