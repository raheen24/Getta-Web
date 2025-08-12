import React, { useState, useEffect } from "react";
import { Row, Col, Image, Form } from "react-bootstrap";
import Header from "./components/Header";
import Aside from "./components/Sidebar";
import Footer from "./components/Footer";
import proImg from "./assets/images/profile_img.png";
import edit from "./assets/images/edit.png";
import uploadbg from "./assets/images/gallery-icon.png";
import BusinessUploadIcon from "./assets/images/business-upload-icon.png";
import { useSelector } from "react-redux";
import { RootState } from "./redux";
import { toast } from "react-toastify";
import { apiHelper } from "./services";
import { useTranslation } from "react-i18next";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const token = useSelector((state: RootState) => state.user.token);
  const [userData, setUserData] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1200);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProfile = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const { response, error } = await apiHelper(
        "GET",
        "/vendor/get-profile",
        headers
      );

      if (response) {
        console.log("Profile data:", response.data.data);
        setUserData(response.data.data);
      } else {
        toast.error(error || t("profilePage.fetchError"));
      }
    } catch (err) {
      toast.error(t("profilePage.fetchError"));
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const getFullImageUrl = (path?: string) => {
    if (!path) {
      return proImg;
    }

    if (path.startsWith("http") || path.startsWith("https")) {
      return path;
    }
    return `https://client1.appsstaging.com:3017/${path.replace(/\\/g, "/")}`;
  };

  return (
    <div
      className={`bg-mains ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Aside isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <section className="content_section">
        <div className="profile_page">
          <div className="profile-sec">
            <div className="cover-image-bg"></div>
            <div className="profile-image-wrapper">
              <div className="profile-image-container">
                <Image
                  src={getFullImageUrl(userData?.image)}
                  alt="Profile"
                  roundedCircle
                  className="profile-image"
                />
              </div>
              <a href="/edit-profile" className="edit-profile-btn">
                <Image src={uploadbg} width="18" alt="Edit" />
              </a>
            </div>

            <div className="profile-business-sec">
              <Row>
                <Col xs={12} lg={6} className="pe-lg-4 business-info-col">
                  <ul className="profile-info-list">
                    <li>
                      <span className="label">
                        {t("profilePage.businessName")}
                      </span>
                      <span className="value">
                        {userData?.businessName || t("profilePage.nA")}
                      </span>
                    </li>
                    <li>
                      <span className="label">
                        {t("profilePage.phoneNumber")}
                      </span>
                      <span className="value">
                        {userData?.phoneNumber || t("profilePage.nA")}
                      </span>
                    </li>
                    <li>
                      <span className="label">
                        {t("profilePage.businessLicenses")}
                      </span>
                      <span className="value">
                        {userData?.businessLicense || t("profilePage.nA")}
                      </span>
                    </li>
                    <li>
                      <span className="label">
                        {t("profilePage.taxIdentificationNumber")}
                      </span>
                      <span className="value">
                        {userData?.taxIdentificationNumber ||
                          t("profilePage.nA")}
                      </span>
                    </li>
                  </ul>
                </Col>

                <Col xs={12} lg={6} className="business-documents-col">
                  <Form.Group className="inputField mb-3">
                    <Form.Label>
                      {t("profilePage.uploadedDocumentFile")}
                    </Form.Label>
                    <div className="mediaUpload upload-box">
                      <label htmlFor="document-upload" className="upload-icon">
                        <Image
                          src={BusinessUploadIcon}
                          fluid
                          alt="Business Upload"
                        />
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
                      {userData?.taxIdentificationNumberFiles?.map(
                        (fileUrl: string, index: number) => (
                          <div key={`api-${index}`} className="file-preview">
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
                          </div>
                        )
                      )}
                      {filePreviews.map((previewUrl, index) => (
                        <div key={`local-${index}`} className="file-preview">
                          <img
                            src={previewUrl}
                            alt={`Selected ${index}`}
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
                            onClick={() => handleRemoveFile(index)}
                          >
                            {t("profilePage.remove")}
                          </button>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProfilePage;
