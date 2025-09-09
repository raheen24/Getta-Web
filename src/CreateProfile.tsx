import React, { useState } from "react";
import { Row, Col, Image, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux";
import { toast, ToastContainer } from "react-toastify";
import { apiHelper } from "./services";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import GlobalBtn from "./components/GlobalBtn";
import ContinueModal from "./components/ContinueModal";
import { setLogin, setToken, setUser } from "./redux/slice/userSlice";

const MAX_BUSINESS_LEN = 30;
const MAX_LICENSE_LEN = 30;
const PHONE_DIGITS = 13;
const TAXID_DIGITS = 9;

const CreateProfile: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);

  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [taxIdentificationNumber, setTaxIdentificationNumber] = useState("");
  const [showContinue, setShowContinue] = useState(false);

  const handleContinue = () => {
    navigate("/bank-details");
  };

  // --- INPUT HANDLERS WITH LIMITS / FILTERS ---

  const handleBusinessName = (val: string) => {
    setBusinessName(val.slice(0, MAX_BUSINESS_LEN));
  };

  const handlePhoneNumber = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, PHONE_DIGITS);
    setPhoneNumber(digitsOnly);
  };

  const handleBusinessLicense = (val: string) => {
    setBusinessLicense(val.slice(0, MAX_LICENSE_LEN));
  };

  const handleTaxId = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, TAXID_DIGITS);
    setTaxIdentificationNumber(digitsOnly);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      toast.success("Profile picture uploaded successfully.");
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      toast.success("Uploaded Attachment");
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = (index: number) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // --- VALIDATION BEFORE SUBMIT ---

  const createProfile = async () => {
    if (!token) {
      toast.error(t("createProfile.authError"));
      return;
    }

    if (
      !businessName ||
      !phoneNumber ||
      !businessLicense ||
      !taxIdentificationNumber
    ) {
      toast.error(t("createProfile.fillAllFields"));
      return;
    }

    // Length checks
    if (businessName.length > MAX_BUSINESS_LEN) {
      toast.error(
        `Business name must be at most ${MAX_BUSINESS_LEN} characters.`
      );
      return;
    }
    if (businessLicense.length > MAX_LICENSE_LEN) {
      toast.error(
        `Business license must be at most ${MAX_LICENSE_LEN} characters.`
      );
      return;
    }

    if (!/^\d{13}$/.test(phoneNumber)) {
      toast.error(`Phone number must be exactly ${PHONE_DIGITS} digits.`);
      return;
    }
    if (!/^\d{9}$/.test(taxIdentificationNumber)) {
      toast.error(
        `Tax identification number must be exactly ${TAXID_DIGITS} digits.`
      );
      return;
    }

    if (!profileImage) {
      toast.error(t("createProfile.uploadImage"));
      return;
    }

    const formData = new FormData();
    formData.append("businessName", businessName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("businessLicense", businessLicense);
    formData.append("taxIdentificationNumber", taxIdentificationNumber);
    formData.append("image", profileImage);

    existingFiles.forEach((fileUrl) => {
      formData.append("taxIdentificationNumberFiles", fileUrl);
    });

    selectedFiles.forEach((file) => {
      formData.append("taxIdentificationNumberFiles", file);
    });

    try {
      const headers = { "Content-Type": "multipart/form-data" };
      const { response, error } = await apiHelper(
        "POST",
        "vendor/complete-profile",
        headers,
        formData
      );

      if (response) {
        const userData = response.data.data;
        toast.success(t("createProfile.profileCreated"));
        dispatch(setUser(userData));
        dispatch(setToken(userData.userAuthToken));
        dispatch(setLogin({ user: userData, token: userData.userAuthToken }));

        setTimeout(() => {
          navigate("/bank-details");
        }, 1500);
      } else {
        toast.error(error || t("createProfile.profileCreationFailed"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("createProfile.somethingWentWrong"));
    }
  };

  return (
    <div className="authBg">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="formBox createProfileForm">
        <h5 className="authTitle">{t("createProfile.createProfile")}</h5>

        <div className="mb-4 text-center">
          <div
            className="position-relative mx-auto"
            style={{ width: 120, height: 120 }}
          >
            <div className="profile-wrapper">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="profile-image"
                />
              ) : (
                <div className="no-image">{t("createProfile.noImage")}</div>
              )}
            </div>
            <label htmlFor="upload-profile" className="upload-button">
              <input
                type="file"
                accept="image/*"
                className="hidden-input"
                onChange={handleImageChange}
                id="upload-profile"
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
              >
                <path
                  d="M12 5v14M5 12h14"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </label>
          </div>
          <p className="text-muted mt-2">{t("createProfile.uploadImage")}</p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form className="text-start">
              <Form.Group className="inputField mb-3">
                <Form.Label>{t("createProfile.businessName")}</Form.Label>
                <Form.Control
                  type="text"
                  value={businessName}
                  maxLength={MAX_BUSINESS_LEN}
                  onChange={(e) => handleBusinessName(e.target.value)}
                />
                <small className="text-muted">
                  {businessName.length}/{MAX_BUSINESS_LEN}
                </small>
              </Form.Group>

              <Form.Group className="inputField mb-3">
                <Form.Label>{t("createProfile.phoneNumber")}</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  value={phoneNumber}
                  maxLength={PHONE_DIGITS}
                  onChange={(e) => handlePhoneNumber(e.target.value)}
                />
                <small className="text-muted">
                  {phoneNumber.length}/{PHONE_DIGITS} digits
                </small>
              </Form.Group>

              <Form.Group className="inputField mb-3">
                <Form.Label>{t("createProfile.businessLicenses")}</Form.Label>
                <Form.Control
                  type="text"
                  value={businessLicense}
                  maxLength={MAX_LICENSE_LEN}
                  onChange={(e) => handleBusinessLicense(e.target.value)}
                />
                <small className="text-muted">
                  {businessLicense.length}/{MAX_LICENSE_LEN}
                </small>
              </Form.Group>

              <Form.Group className="inputField mb-3">
                <Form.Label>
                  {t("createProfile.taxIdentificationNumber")}
                </Form.Label>
                <Form.Control
                  value={taxIdentificationNumber}
                  maxLength={TAXID_DIGITS}
                  inputMode="numeric"
                  onChange={(e) => handleTaxId(e.target.value)}
                />
                <small className="text-muted">
                  {taxIdentificationNumber.length}/{TAXID_DIGITS} digits
                </small>
              </Form.Group>
            </Form>
          </div>

          <div className="col-md-6">
            <Form.Group className="inputField mb-3">
              <Form.Label>{t("createProfile.uploadedDocumentFile")}</Form.Label>
              <div className="mediaUpload upload-box">
                <label htmlFor="document-upload" className="upload-icon">
                  <svg width="40" height="80" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                      stroke="#6c757d"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleDocumentChange}
                  className="d-none"
                  id="document-upload"
                />
              </div>
              <div className="preview-wrapper">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-preview">
                    <div className="file-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 4h16v16H4z M4 15l4-4 3 3 5-5 4 4"
                          stroke="#0a3d62"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveFile(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <GlobalBtn
            text={t("createProfile.continue")}
            color="success"
            className="w-50 mt-5 cta"
            onClick={createProfile}
          />
          <ContinueModal
            show={showContinue}
            handleClose={() => setShowContinue(false)}
            handleContinue={handleContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
