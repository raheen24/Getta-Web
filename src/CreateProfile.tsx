import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";

import GlobalBtn from "./components/GlobalBtn";
import ContinueModal from "./components/ContinueModal";
import { apiHelper } from "./services";
import { setUser, setLogin, setToken } from "./redux/slice/userSlice";
import { RootState } from "./redux";
import { useTranslation } from "react-i18next";

const CreateProfile: React.FC = () => {
  const { t } = useTranslation();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [taxIdentificationNumber, setTaxIdentificationNumber] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showContinue, setShowContinue] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);

  const handleContinue = () => {
    navigate("/bank-details");
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const createProfile = async () => {
    if (!token) {
      toast.error("Authentication error! Please login again.");
      return;
    }

    if (
      !businessName ||
      !phoneNumber ||
      !businessLicense ||
      !taxIdentificationNumber
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!profileImage) {
      toast.error("Please upload a profile image.");
      return;
    }

    const formData = new FormData();
    formData.append("businessName", businessName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("businessLicense", businessLicense);
    formData.append("taxIdentificationNumber", taxIdentificationNumber);
    formData.append("image", profileImage);

    try {
      const headers = { "Content-Type": "multipart/form-data" };
      const { response, error } = await apiHelper(
        "POST",
        "/vendor/complete-profile",
        headers,
        formData
      );

      if (response) {
        const userData = response.data.data;
        toast.success("Profile created successfully!");
        dispatch(setUser(userData));
        dispatch(setToken(userData.userAuthToken));
        dispatch(setLogin({ user: userData, token: userData.userAuthToken }));

        setTimeout(() => {
          navigate("/bank-details"); 
        }, 1500);
      } else {
        toast.error(error || "Failed to complete profile.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="authBg">
      <div className="formBox createProfileForm">
        <h5 className="authTitle">Create Profile</h5>
        {/* Profile Form */}
        <div className="mb-4 text-center">
          <div
            className="position-relative mx-auto"
            style={{ width: 120, height: 120 }}
          >
            <div className="profile-wrapper">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="no-image">No Image</div>
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
          <p className="text-muted mt-2">Upload Your Image</p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form className="text-start">
              <Form.Group className="inputField mb-3">
                <Form.Label>Business Name</Form.Label>
                <Form.Control
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="inputField mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="inputField mb-3">
                <Form.Label>Business Licenses</Form.Label>
                <Form.Control
                  type="text"
                  value={businessLicense}
                  onChange={(e) => setBusinessLicense(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="inputField mb-3">
                <Form.Label>Tax Identification Number</Form.Label>
                <Form.Control
                  as="textarea"
                  value={taxIdentificationNumber}
                  onChange={(e) => setTaxIdentificationNumber(e.target.value)}
                />
              </Form.Group>
            </Form>
          </div>

          <div className="col-md-6">
            <Form.Group className="inputField mb-3">
              <Form.Label>Upload Document File</Form.Label>
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
            text="Continue"
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
