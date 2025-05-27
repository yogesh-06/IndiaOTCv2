import { APITemplate } from "@/component/API/Template";
import React, { useEffect, useState } from "react";
const OnboardingType = ({ user, setStep, getVerification }) => {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setSelected(user.type);
  }, [user]);

  const handleNationality = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];

    const formData = new FormData();
    formData.append("nationalityCountry", "IN");

    if (user?.lastVerificationId) {
      formData.append("verificationId", user?.lastVerificationId);
    }

    try {
      const response = await APITemplate(
        "user/updateNationality",
        "POST",
        formData
      );
      if (response.success == true) {
        return response?.data?.lastVerificationId;
      } else {
        setLoading(false);
        newErrors.push("nationality");
        setErrors(newErrors);
        setLoading(false);
      }
    } catch (error) {
      newErrors.push("nationalityVerification");
      setErrors(newErrors);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleNextStep = async () => {
    setErrors([]);
    setLoading(true);

    let lastVerificationId = await handleNationality();

    const formData = new FormData();
    formData.append("verificationId", lastVerificationId);
    formData.append("onboardingType", selected);

    try {
      const response = await APITemplate(
        "user/updateApplicantOnboardingType",
        "POST",
        formData
      );
      if (response.success) {
        await getVerification(lastVerificationId);
        if (selected == "individual") {
          setStep("initVerification");
        } else if (selected === "company") {
          setStep("applicantType");
        }
        setLoading(false);
      } else {
        console.error(response.message);
        setErrors([response.message]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating onboarding type:", error);
      setErrors(["Error updating onboarding type"]);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="row align-items-center justify-content-center w-100">
      <div className="col-md-5 bg-white shadow rounded-4 p-5">
        {/* <div className="row align-items-start justify-content-center rounded-5 min-vh-90 w-100">
      <div className="col-md-5 rounded-5 bg-white shadow-lg p-md-4 px-3 py-4 my-md- "> */}
        <div className="text-center mb-5">
          <h2 className="fw-semibold mt-3">Who Are You?</h2>
          <p className="text-muted mb-0">
            Please select your onboarding type to proceed.
          </p>
          {errors.length > 0 && (
            <p className="text-danger mt-2 fw-medium">{errors[0]}</p>
          )}
        </div>
        <div className="row g-4">
          {/* Individual Card */}
          <div className="col-md-6">
            <div
              className={`border rounded-4 p-4 h-100 text-center position-relative transition cursor-pointer ${
                selected === "individual"
                  ? "border-primary shadow"
                  : "border-secondary-subtle"
              }`}
              role="button"
              onClick={() => setSelected("individual")}
            >
              <div
                className={`position-absolute top-0 end-0 m-2 badge ${
                  selected === "individual"
                    ? "bg-primary"
                    : "bg-secondary-subtle"
                }`}
              >
                {selected === "individual" ? "✓ Selected" : ""}
              </div>
              <h4 className="fw-bold mt-3">I am an Individual</h4>
              <p className="text-muted small">KYC – Know Your Customer</p>
            </div>
          </div>

          {/* Business Card */}
          <div className="col-md-6">
            <div
              className={`border rounded-4 p-4 h-100 text-center position-relative transition cursor-pointer ${
                selected === "company"
                  ? "border-primary shadow"
                  : "border-secondary-subtle"
              }`}
              role="button"
              onClick={() => setSelected("company")}
            >
              <div
                className={`position-absolute top-0 end-0 m-2 badge ${
                  selected === "company" ? "bg-primary" : "bg-secondary-subtle"
                }`}
              >
                {selected === "company" ? "✓ Selected" : ""}
              </div>
              <h4 className="fw-bold mt-3">I am a Business </h4>
              <p className="text-muted small">KYB – Know Your Business</p>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-5">
          <button
            className="btn btn-primary btn-lg px-4"
            onClick={handleNextStep}
            disabled={!selected || loading}
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
    </div>
  );
};

export default OnboardingType;
