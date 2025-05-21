import React from "react";

const OnboardingType = ({ setStep, selected, setSelected }) => {
  const handleNextStep = () => {
    if (selected === "kyc") {
      setStep("initVerification");
    } else if (selected === "kyb") {
      setStep("businessInformation");
    }
  };

  return (
    <div className="row align-items-center justify-content-center min-vh-100 bg-light">
      <div className="col-11 col-md-8 col-lg-6 bg-white rounded-4 shadow p-5">
        <div className="text-center mb-5">
          <h2 className="fw-semibold mt-3">Who Are You?</h2>
          <p className="text-muted mb-0">
            Please select your onboarding type to proceed.
          </p>
        </div>

        <div className="row g-4">
          {/* Individual Card */}
          <div className="col-md-6">
            <div
              className={`border rounded-4 p-4 h-100 text-center position-relative transition cursor-pointer ${
                selected === "kyc"
                  ? "border-primary shadow"
                  : "border-secondary-subtle"
              }`}
              role="button"
              onClick={() => setSelected("kyc")}
            >
              <div
                className={`position-absolute top-0 end-0 m-2 badge ${
                  selected === "kyc" ? "bg-primary" : "bg-secondary-subtle"
                }`}
              >
                {selected === "kyc" ? "✓ Selected" : ""}
              </div>
              <h4 className="fw-bold mt-2">I am an Individual</h4>
              <p className="text-muted small">KYC – Know Your Customer</p>
            </div>
          </div>

          {/* Business Card */}
          <div className="col-md-6">
            <div
              className={`border rounded-4 p-4 h-100 text-center position-relative transition cursor-pointer ${
                selected === "kyb"
                  ? "border-primary shadow"
                  : "border-secondary-subtle"
              }`}
              role="button"
              onClick={() => setSelected("kyb")}
            >
              <div
                className={`position-absolute top-0 end-0 m-2 badge ${
                  selected === "kyb" ? "bg-primary" : "bg-secondary-subtle"
                }`}
              >
                {selected === "kyb" ? "✓ Selected" : ""}
              </div>
              <h4 className="fw-bold mt-2">I am a Business </h4>
              <p className="text-muted small">KYB – Know Your Business</p>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-5">
          <button
            className="btn btn-primary btn-lg px-4"
            onClick={handleNextStep}
            disabled={!selected}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingType;
