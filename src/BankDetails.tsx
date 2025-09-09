import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import GlobalBtn from "./components/GlobalBtn";
import { apiHelper } from "./services";
import { setUser, setLogin, setToken } from "./redux/slice/userSlice";
import { RootState } from "./redux";
import ContinueModal from "./components/ContinueModal";

const MAX_NAME_LEN = 30;
const ACCT_DIGITS = 12;
const ROUTING_DIGITS = 9;

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

  // --- input handlers with limits / numeric filtering ---
  const onBankName = (v: string) => setBankName(v.slice(0, MAX_NAME_LEN));
  const onAccountHolder = (v: string) =>
    setAccountHolderName(v.slice(0, MAX_NAME_LEN));
  const onAccountNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, ACCT_DIGITS);
    setAccountNumber(digits);
  };
  const onRoutingNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, ROUTING_DIGITS);
    setRoutingNumber(digits);
  };

  const handleBankDetailsSubmit = async () => {
    if (!token) {
      toast.error(t("auth.authenticationError"));
      return;
    }

    // empty fields
    if (!bankName || !accountNumber || !accountHolderName || !routingNumber) {
      toast.warn("These fields can’t be empty.");
      return;
    }

    // length / format checks
    if (bankName.length > MAX_NAME_LEN) {
      toast.error(`Bank name must be at most ${MAX_NAME_LEN} characters.`);
      return;
    }
    if (accountHolderName.length > MAX_NAME_LEN) {
      toast.error(
        `Account holder name must be at most ${MAX_NAME_LEN} characters.`
      );
      return;
    }
    if (!/^\d{12}$/.test(accountNumber)) {
      toast.error("Account number must be 12 digits.");
      return;
    }
    if (!/^\d{9}$/.test(routingNumber)) {
      toast.error("Routing number must be 9 digits.");
      return;
    }

    const formData = new FormData();
    formData.append("bankName", bankName);
    formData.append("accountNumber", accountNumber);
    formData.append("accountHolderName", accountHolderName);
    formData.append("routingNumber", routingNumber);

    try {
      const { response } = await apiHelper(
        "POST",
        "common/complete-profile-bank",
        { Authorization: `Bearer ${token}` },
        formData
      );

      if (response?.data) {
        dispatch(setUser(response.data.data));
        dispatch(setToken(response.data.data.userAuthToken));
        dispatch(
          setLogin({
            user: response.data.data,
            token: response.data.data.userAuthToken,
          })
        );

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
      <ToastContainer position="top-center" autoClose={3000} />
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
                  maxLength={MAX_NAME_LEN}
                  onChange={(e) => onBankName(e.target.value)}
                />
                <small className="text-muted">
                  {bankName.length}/{MAX_NAME_LEN}
                </small>
              </Form.Group>
            </Col>

            <Col lg={6} md={6} className="mb-2">
              <Form.Group className="inputField mb-3">
                <Form.Label>{t("bankDetails.accountNumber")}</Form.Label>
                <Form.Control
                  type="text" // no spinner
                  inputMode="numeric" 
                  value={accountNumber}
                  maxLength={ACCT_DIGITS}
                  onChange={(e) => onAccountNumber(e.target.value)}
                  placeholder="Enter 12 digits"
                />
                <small className="text-muted">
                  {accountNumber.length}/{ACCT_DIGITS} digits
                </small>
              </Form.Group>
            </Col>

            <Col lg={6} md={6} className="mb-2">
              <Form.Group className="inputField mb-3">
                <Form.Label>{t("bankDetails.accountHolderName")}</Form.Label>
                <Form.Control
                  type="text"
                  value={accountHolderName}
                  maxLength={MAX_NAME_LEN}
                  onChange={(e) => onAccountHolder(e.target.value)}
                />
                <small className="text-muted">
                  {accountHolderName.length}/{MAX_NAME_LEN}
                </small>
              </Form.Group>
            </Col>

            <Col lg={6} md={6} className="mb-2">
              <Form.Group className="inputField mb-3">
                <Form.Label>{t("bankDetails.routingNumber")}</Form.Label>
                <Form.Control
                  type="text" // no spinner
                  inputMode="numeric"
                  value={routingNumber}
                  maxLength={ROUTING_DIGITS}
                  onChange={(e) => onRoutingNumber(e.target.value)}
                  placeholder="Enter 9 digits"
                />
                <small className="text-muted">
                  {routingNumber.length}/{ROUTING_DIGITS} digits
                </small>
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
