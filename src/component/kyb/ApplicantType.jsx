import React, { useEffect, useState } from "react";
import { APITemplate } from "../API/Template";

const applicantTypes = [
  { key: "soleProprietorship", label: "Sole Proprietorship" },
  { key: "partnershipFirm", label: "Partnership Firm" },
  { key: "pvt-ltd", label: "Private Limited" },
  { key: "LLP", label: "LLP" },
];

const ApplicantType = ({ setStep, verification }) => {
  const [selectedApplicantType, setSelectedApplicantType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setSelectedApplicantType(verification.applicant.applicantType);
  }, [verification]);

  const handleApplicantType = async () => {
    setErrors([]);
    setLoading(true);
    if (!selectedApplicantType || selectedApplicantType == "") {
      setErrors(["applicantType"]);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("verificationId", verification?._id);
    formData.append("applicantType", selectedApplicantType);

    try {
      const response = await APITemplate(
        "user/updateApplicantOnboardingType",
        "POST",
        formData
      );
      if (response.success) {
        setStep("businessInfo");
      } else {
        console.error(response.message);
        setErrors([response.message]);
      }
    } catch (error) {
      console.error("Error updating applicant type:", error);
      setErrors(["Error updating applicant type"]);
    }
    setLoading(false);
  };

  return (
    <div className="row align-items-start justify-content-center rounded-5 min-vh-90 w-100">
      <div className="col-md-5 rounded-5 bg-white shadow-lg px-4 py-5 my-md- ">
        <div className="d-flex align-items-start gap-3">
          <button
            className="btn border_primary text_Primary_500 p-3"
            style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
            onClick={() => setStep("onboardingType")}
          >
            <i className="fa-solid fa-chevron-left fa-lg"></i>
          </button>
          <div className="flex-grow-1">
            <h4 className="fw-bold text-center mb-0">Applicant Type</h4>
            <h6 className="fw-light text-center lh-lg py-1">
              Your 'Applicant Type' helps us connect you with our best services.
            </h6>
          </div>
        </div>
        <div className="d-flex flex-column gap-2">
          <div className="arrow-line mb-4 mt-2" />
        </div>

        <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
          <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
            <span
              className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
              style={{ width: "32px", height: "32px" }}
            >
              <i className="fa-solid fa-briefcase"></i>
            </span>
            Choose your business apllication type:
          </p>

          <div className="fs-5 text_Primary_700 py-3 ps-5">
            <div className="row justify-content-start align-items-center gy-3">
              {applicantTypes.map((option) => {
                const isSelected = selectedApplicantType === option.key;

                return (
                  <div key={option} className="col-md-6">
                    <div
                      className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                        isSelected ? "bg-primary text-white" : ""
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? "#7F56D9"
                          : "rgba(127, 86, 217, 0.1)",
                      }}
                      onClick={() => setSelectedApplicantType(option.key)}
                    >
                      <input
                        type="radio"
                        checked={isSelected}
                        readOnly
                        className="form-check-input my-2 Primary _500"
                      />
                      <small className="text-nowrap">{option.label}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* <div className="d-flex justify-content-between align-items-center px-2 pt-4">
          <div
            className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
            onClick={() => {
              // setPaymentMethodBuy((prev) => ({
              //   ...prev,
              //   answer: "",
              //   answerLabel: "",
              // }));
              // setStepQ("start");
            }}
          >
            Previous
          </div>
          <div
            className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
            onClick={handleApplicantType}
            aria-disabled={loading}
          >
            Continue
          </div>
        </div> */}

        {errors.includes("applicantType") && (
          <p className="text-danger text-center fw-medium my-4">
            <i className="fa-solid fa-circle-exclamation text-danger me-2"></i>
            <span>Please select Applicant Type, to proceed further.</span>
          </p>
        )}

        <button
          disabled={loading}
          onClick={handleApplicantType}
          className="btn btn-lg text-white fw-semibold Primary_500 mt-4 w-100"
        >
          {loading ? (
            <div className="d-flex align-items-center">
              <div
                className="spinner-border "
                role="status"
                style={{ width: "1.5rem", height: "1.5rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-2">Loading...</span>
            </div>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
};

export default ApplicantType;
