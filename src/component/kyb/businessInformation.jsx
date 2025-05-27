import React, { useEffect, useState } from "react";
import { APITemplate } from "../API/Template";

const BusinessInformation = ({ setStep, verification, getVerification }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [natureOfBusiness, setNatureOfBusiness] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [businessCountryCode, setBusinessCountryCode] = useState("+91");
  const [whatsappBusinessNumber, setWhatsappBusinessNumber] = useState("");

  useEffect(() => {
    const businessInfo = verification?.applicant?.businessInfo;
    if (verification && businessInfo) {
      if (businessInfo?.businessName)
        setBusinessName(businessInfo?.businessName);
      if (businessInfo?.natureOfBusiness)
        setNatureOfBusiness(businessInfo?.natureOfBusiness);
      if (businessInfo?.businessCityState)
        setBusinessCityState(businessInfo?.businessCityState);
      if (businessInfo?.businessCountryCode)
        setBusinessCountryCode(businessInfo?.businessCountryCode);
      if (businessInfo?.whatsappBusinessNumber)
        setWhatsappBusinessNumber(businessInfo?.whatsappBusinessNumber);
      if (businessInfo?.city) setCity(businessInfo?.city);
      if (businessInfo?.state) setState(businessInfo?.state);
      if (businessInfo?.GSTNumber) setGstNumber(businessInfo?.GSTNumber);
      if (businessInfo?.PANNumber) setPanNumber(businessInfo?.PANNumber);
    }
  }, [verification]);

  const handleBusinessInfo = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];

    // Validation
    if (!businessName) newErrors.push("businessName");
    if (!natureOfBusiness) newErrors.push("natureOfBusiness");
    if (!city) newErrors.push("businessCity");
    if (!state) newErrors.push("businessState");

    const indiaRegex = /^\d{10}$/;
    if (!whatsappBusinessNumber || !indiaRegex.test(whatsappBusinessNumber)) {
      newErrors.push("businessPhone");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("city", city);
    formData.append("state", state);
    formData.append("GSTNumber", gstNumber);
    formData.append("PANNumber", panNumber);
    formData.append("businessName", businessName);
    formData.append("natureOfBusiness", natureOfBusiness);
    formData.append("whatsappBusinessNumber", whatsappBusinessNumber);
    formData.append("verificationId", verification?._id);

    try {
      const response = await APITemplate(
        "user/updateBusinessInfo",
        "POST",
        formData
      );

      if (response.success) {
        setErrors(["successResponse"]);
        setStep("uploadBusinessDocs");
      } else {
        setErrors(["verification"]);
      }
    } catch (error) {
      setErrors(["somethingWrong"]);
    }

    setLoading(false);
  };

  return (
    <div className="row align-items-start justify-content-center rounded-5 min-vh-90 w-100">
      <div className="col-md-5 rounded-5 bg-white shadow-lg py-md-5 px-4">
        <div className="d-flex align-items-start gap-3">
          <button
            className="btn border_primary text_Primary_500 p-3"
            style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
            onClick={() => setStep("applicantType")}
          >
            <i className="fa-solid fa-chevron-left fa-lg"></i>
          </button>
          <div className="flex-grow-1">
            <h4 className="fw-bold text-center mb-0">Business Information</h4>
            <h6 className="fw-light text-center lh-lg py-1">
              Please provide your business to proceed further.
            </h6>
          </div>
        </div>
        <div className="d-flex flex-column gap-2">
          <div className="arrow-line mb-4 mt-2" />
        </div>

        <div className="w-100 d-flex align-items-center flex-column gap-4">
          {/* Business Name */}
          <div className="w-100">
            <label htmlFor="businessName">Business Name *</label>
            <input
              type="text"
              className={`form-control form-control-lg ${
                errors.includes("businessName")
                  ? "bg-danger-subtle border border-danger"
                  : "bg-light"
              }`}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            {errors.includes("businessName") && (
              <p className="small text-danger mt-2 fw-medium">
                Business name is required.
              </p>
            )}
          </div>

          {/* Nature of Business */}
          <div className="w-100">
            <label htmlFor="natureOfBusiness">Nature of Business *</label>
            <input
              type="text"
              className={`form-control form-control-lg ${
                errors.includes("natureOfBusiness")
                  ? "bg-danger-subtle border border-danger"
                  : "bg-light"
              }`}
              value={natureOfBusiness}
              onChange={(e) => setNatureOfBusiness(e.target.value)}
            />
            {errors.includes("natureOfBusiness") && (
              <p className="small text-danger mt-2 fw-medium">
                Nature of business is required.
              </p>
            )}
          </div>

          {/* City & State */}
          <div className="w-100">
            <label>City & State *</label>
            <div className="row">
              {/* City */}
              <div className="col-md-6">
                <input
                  type="text"
                  placeholder="City"
                  className={`form-control form-control-lg ${
                    errors.includes("businessCity")
                      ? "bg-danger-subtle border border-danger"
                      : "bg-light"
                  }`}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                {errors.includes("businessCity") && (
                  <p className="small text-danger mt-2 fw-medium">
                    City is required.
                  </p>
                )}
              </div>

              {/* State */}
              <div className="col-md-6 mt-3 mt-md-0">
                <input
                  type="text"
                  placeholder="State"
                  className={`form-control form-control-lg ${
                    errors.includes("businessState")
                      ? "bg-danger-subtle border border-danger"
                      : "bg-light"
                  }`}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                {errors.includes("businessState") && (
                  <p className="small text-danger mt-2 fw-medium">
                    State is required.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* GST Number (Optional) */}
          <div className="w-100">
            <label htmlFor="gstNumber">GST Number (Optional)</label>
            <input
              type="text"
              className="form-control form-control-lg bg-light"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
            />
          </div>

          {/* PAN Number (Optional) */}
          <div className="w-100">
            <label htmlFor="panNumber">PAN Number (Optional)</label>
            <input
              type="text"
              className="form-control form-control-lg bg-light"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value)}
            />
          </div>

          {/* WhatsApp Business Number */}
          <div className="w-100">
            <label htmlFor="whatsappBusiness">WhatsApp Business Number *</label>
            <div className="row g-2 align-items-center mt-2">
              <div className="col-12 col-md-auto">
                <select
                  className={`form-select form-select-lg rounded-3 ${
                    errors.includes("businessPhone")
                      ? "bg-danger-subtle border border-danger"
                      : "bg-secondary-subtle"
                  }`}
                  value={businessCountryCode}
                  onChange={(e) => setBusinessCountryCode(e.target.value)}
                >
                  <option value="+91">+91</option>
                </select>
              </div>
              <div className="col position-relative">
                <input
                  type="text"
                  className={`form-control form-control-lg ps-3 pe-5 rounded-3 ${
                    errors.includes("businessPhone")
                      ? "bg-danger-subtle border border-danger"
                      : "bg-light"
                  }`}
                  value={whatsappBusinessNumber}
                  onChange={(e) => setWhatsappBusinessNumber(e.target.value)}
                />
                <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                  <i className="fa-brands fa-whatsapp fa-2xl text-success" />
                </div>
              </div>
            </div>
            {errors.includes("businessPhone") && (
              <p className="small text-danger mt-2 fw-medium">
                Please enter a valid phone number that begins with +91 and is 10
                digits long.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            onClick={handleBusinessInfo}
            className="btn btn-lg text-white fw-semibold Primary_500 mt-2 w-100"
          >
            {loading ? (
              <div className="d-flex align-items-center">
                <div
                  className="spinner-border"
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

export default BusinessInformation;
