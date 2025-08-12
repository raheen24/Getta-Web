import React, { useState, useEffect } from "react";
import { Row, Col, Image, Form } from "react-bootstrap";
import Header from "./components/Header";
import Aside from "./components/Sidebar";
import Footer from "./components/Footer";
import proImg from "./assets/images/profile_img.png";
import edit from "./assets/images/edit.png";
import uploadbg from "./assets/images/gallery-icon.png";
import BusinessUploadIcon from "./assets/images/business-upload-icon.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux";
import { toast, ToastContainer } from "react-toastify";
import { apiHelper } from "./services";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import GlobalBtn from "./components/GlobalBtn";
import { setUser } from "./redux/slice/userSlice";

const EditProfile: React.FC = () => {
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

  // const getFullImageUrl = (path?: string) => {
  //   return path
  //     ? `https://client1.appsstaging.com:3017/${path.replace(/\\/g, "/")}`
  //     : "/default-profile.png";
  // };

   const getFullImageUrl = (path?: string) => {
    return path
      ? `https://client1.appsstaging.com:3017/${path.replace(/\\/g, "/")}`
      : "/default-profile.png";
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        toast.error("Authentication error! Please login again.");
        return;
      }
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const { response, error } = await apiHelper(
          "GET",
          "vendor/get-profile",
          headers
        );
        if (response) {
          const data = response.data.data;
          setBusinessName(data.businessName || "");
          setPhoneNumber(data.phoneNumber || "");
          setBusinessLicense(data.businessLicense || "");
          setTaxIdentificationNumber(data.taxIdentificationNumber || "");
          if (data.image) {
            setPreviewImage(getFullImageUrl(data.image)); // Display the current profile image
          }

          // Set existing documents if available
          if (data.taxIdentificationNumberFiles?.length > 0) {
            setExistingFiles(data.taxIdentificationNumberFiles); // Display previously uploaded documents
          }
        } else {
          toast.error(error || "Failed to fetch profile data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while fetching profile");
      }
    };

    fetchProfile();
  }, [token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Show preview for the new image
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...newFiles]); // Add newly selected files
  };

  const handleRemoveNewFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index)); // Remove new file from the list
  };

  const handleRemoveExistingFile = (index: number) => {
    // Handle removal of existing file from the UI
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateProfile = async () => {
    if (
      !businessName ||
      !phoneNumber ||
      !businessLicense ||
      !taxIdentificationNumber
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    // Append form data fields
    formData.append("businessName", businessName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("businessLicense", businessLicense);
    formData.append("taxIdentificationNumber", taxIdentificationNumber);

    // If a new profile image is selected, append it
    if (profileImage) {
      formData.append("image", profileImage);
    }

    // Append existing documents
    existingFiles.forEach((fileUrl) => {
      formData.append("taxIdentificationNumberFiles", fileUrl);
    });

    // Append newly selected document files
    selectedFiles.forEach((file) => {
      formData.append("taxIdentificationNumberFiles", file);
    });

    try {
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };
      const { response, error } = await apiHelper(
        "POST",
        "vendor/complete-profile", // Submit the updated profile data
        headers,
        formData
      );

      if (response) {
        toast.success("Profile updated successfully!");
        dispatch(setUser(response.data.data)); // Update the Redux store with new user data
        setTimeout(() => navigate("/profile"), 1500); // Redirect to profile page
      } else {
        toast.error(error || "Profile update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during the update");
    }
  };

  return (
    <div className="authBg">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="formBox createProfileForm">
        <h5 className="authTitle">{t("editProfile.editProfile")}</h5>

        <div className="mb-4 text-center">
          <div
            className="position-relative mx-auto"
            style={{ width: "120px", height: "120px" }}
          >
            <div className="profile-wrapper">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="profile-image"
                />
              ) : (
                <div className="no-image">{t("editProfile.noImage")}</div>
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
          <p className="text-muted mt-2">{t("editProfile.uploadImage")}</p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form className="text-start">
              <Form.Group className="inputField mb-3">
                <Form.Label>{t("editProfile.businessName")}</Form.Label>
                <Form.Control
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="inputField mb-3">
                <Form.Label>{t("editProfile.phoneNumber")}</Form.Label>
                <Form.Control
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="inputField mb-3">
                <Form.Label>{t("editProfile.businessLicenses")}</Form.Label>
                <Form.Control
                  type="text"
                  value={businessLicense}
                  onChange={(e) => setBusinessLicense(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="inputField mb-3">
                <Form.Label>
                  {t("editProfile.taxIdentificationNumber")}
                </Form.Label>
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
              <Form.Label>{t("editProfile.uploadedDocumentFile")}</Form.Label>
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
                {existingFiles.map((fileUrl, index) => (
                  <div key={`existing-${index}`} className="file-preview">
                    <img
                      src={getFullImageUrl(fileUrl)}
                      alt={`Uploaded ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveNewFile(index)} // Remove new file
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {selectedFiles.map((file, index) => (
                  <div key={`local-${index}`} className="file-preview">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`File ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveNewFile(index)}
                    >
                      {t("editProfile.remove")}
                    </button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <GlobalBtn
            text={t("editProfile.updateProfile")}
            color="success"
            className="w-50 mt-5 cta"
            onClick={handleUpdateProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
