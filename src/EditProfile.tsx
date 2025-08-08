import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GlobalBtn from "./components/GlobalBtn";
import { apiHelper } from "./services";
import { setUser } from "./redux/slice/userSlice";
import { RootState } from "./redux";

const EditProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token); // Token from Redux store

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // For displaying image preview
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // New document files
  const [existingFiles, setExistingFiles] = useState<string[]>([]); // Existing document files

  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [taxIdentificationNumber, setTaxIdentificationNumber] = useState("");

  const getFullImageUrl = (path?: string) => {
    return path
      ? `https://getta-api-new.deployment-uat.com/${path.replace(/\\/g, "/")}`
      : "/default-profile.png"; // Return default if no image path
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
          "vendor/get-profile", // Fetch profile data from the API
          headers
        );
        if (response) {
          const data = response.data.data;
          setBusinessName(data.businessName || "");
          setPhoneNumber(data.phoneNumber || "");
          setBusinessLicense(data.businessLicense || "");
          setTaxIdentificationNumber(data.taxIdentificationNumber || "");

          // Set profile image if exists
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
        <h5 className="authTitle">Edit Profile</h5>

        <div className="mb-4 text-center">
          <div
            className="position-relative mx-auto"
            style={{ width: "120px", height: "120px" }}
          >
            <div className="profile-wrapper">
              {previewImage ? (
                <img
                  src={previewImage} // Show image preview if available
                  alt="Profile Preview"
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
                onChange={handleImageChange} // Update profile image
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
                  onChange={(e) => setBusinessName(e.target.value)} // Handle input changes
                />
              </Form.Group>
              <Form.Group className="inputField mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)} // Handle input changes
                />
              </Form.Group>
              <Form.Group className="inputField mb-3">
                <Form.Label>Business Licenses</Form.Label>
                <Form.Control
                  type="text"
                  value={businessLicense}
                  onChange={(e) => setBusinessLicense(e.target.value)} // Handle input changes
                />
              </Form.Group>
              <Form.Group className="inputField mb-3">
                <Form.Label>Tax Identification Number</Form.Label>
                <Form.Control
                  as="textarea"
                  value={taxIdentificationNumber}
                  onChange={(e) => setTaxIdentificationNumber(e.target.value)} // Handle input changes
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
                  onChange={handleDocumentChange} // Handle document upload
                  className="d-none"
                  id="document-upload"
                />
              </div>

              {/* Document previews */}
              <div className="preview-wrapper">
                {/* Existing documents from the API */}
                {existingFiles.map((fileUrl, index) => (
                  <div key={`existing-${index}`} className="file-preview">
                    <img
                      src={getFullImageUrl(fileUrl)} // Display existing documents
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
                      onClick={() => handleRemoveExistingFile(index)} // Remove existing file
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* New files selected by the user */}
                {selectedFiles.map((file, index) => (
                  <div key={`local-${index}`} className="file-preview">
                    <img
                      src={URL.createObjectURL(file)} // Show preview for new document files
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
                      onClick={() => handleRemoveNewFile(index)} // Remove new file
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
            text="Update Profile"
            color="success"
            className="w-50 mt-5 cta"
            onClick={handleUpdateProfile} // Handle form submission
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
