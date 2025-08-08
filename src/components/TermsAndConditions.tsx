import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { apiHelper } from "../services"; // Assuming you have the apiHelper setup in your services

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();
  const [termsContent, setTermsContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleFetchTermsAndConditions = async () => {
      setLoading(true);
      try {
        const { response, error } = await apiHelper(
          "GET",
          "common/terms_and_conditions",
          {}
        );
        if (response && response.data.data) {
          setTermsContent(response.data.data);
        } else {
          setError("Failed to fetch terms and conditions: No data found");
        }
      } catch (err) {
        setError(
          "Unexpected error occurred while fetching terms and conditions."
        );
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    handleFetchTermsAndConditions();
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
            Terms and Conditions
          </h5>
          {loading ? (
            <p>Loading terms and conditions...</p>
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

export default TermsAndConditions;
