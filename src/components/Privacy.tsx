import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { apiHelper } from "../services";

const Privacy: React.FC = () => {
  const navigate = useNavigate();
  const [privacyContent, setPrivacyContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleFetchPrivacyPolicy = async () => {
      setLoading(true);
      try {
        const { response, error } = await apiHelper(
          "GET",
          "common/privacy_policy",
          {}
        );
        if (response && response.data.data) {
          setPrivacyContent(response.data.data);
        } else {
          setError("Failed to fetch privacy policy: No data found");
        }
      } catch (err) {
        setError(
          "Unexpected error occurred while fetching privacy policy."
        );
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    handleFetchPrivacyPolicy();
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-start vh-100 vw-100 p-4"
      style={{ backgroundColor: "#EAF3FF" }}
    >
      <div className="d-flex flex-column">
        <button
          className="btn btn-outline-dark mb-3 rounded-circle bg-white"
          onClick={() => navigate(-1)}
          style={{
            width: "fit-content",
            height: "fit-content",
            padding: "5px",
          }}
        >
          <IoArrowBackOutline size={24} />
        </button>
        <div
          className="p-4 rounded-4 text-left bg-all"
          style={{ maxWidth: "1200px", width: "100%", color: "#002250" }}
        >
          <h5 className="my-2 mb-2 fw-bold" style={{ color: "#002250" }}>
            Privacy Policy
          </h5>
          {loading ? (
            <p>Loading privacy policy...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div
              className="terms-content"
              dangerouslySetInnerHTML={{ __html: termsContent || "" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
