"use client";
import React, { useEffect, useState } from "react";
import { APITemplate } from "../API/Template";

const InitVefirication = ({ data, setStep, verification }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [countryCode, setCountryCode] = useState("+971");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");
  const [cityState, setCityState] = useState("");
  console.log(verification);

  useEffect(() => {
    if (data) {
      setWhatsappNumber(data?.phone || "");
      setTelegramUsername(data?.telegramUsername || "");
      setFullName(data?.fullName || "");
      setDob(data?.dateOfBirth || "");
      setGender(data?.gender || "");
      setNationality(data?.nationality || "");
      setAddress(data?.address || "");
      setCityState(data?.cityState || "");
      setCountryCode(data?.countryCode || "+971");
    }
  }, [data]);

  const handleIdentityVerification = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];
    if (!whatsappNumber) {
      setLoading(false);
      newErrors.push("phone");
      setErrors(newErrors);
    }
    const indiaRegex = /^\d{10}$/;

    if (whatsappNumber && !indiaRegex.test(whatsappNumber)) {
      newErrors.push("phone");
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    if (newErrors.length > 0) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("phone", whatsappNumber || "");
    formData.append("telegramUsername", telegramUsername || "");
    formData.append("fullName", fullName || "");
    formData.append("dateOfBirth", dob || "");
    formData.append("gender", gender || "");
    formData.append("nationality", nationality || "");
    formData.append("address", address || "");
    formData.append("cityState", cityState || "");
    formData.append("countryCode", countryCode || "+971");
    formData.append("verificationId", verification?._id);

    try {
      const response = await APITemplate(
        "user/updateIdentityVerification",
        "POST",
        formData
      );
      if (response.success) {
        const newErrors = [];
        newErrors.push("sucessResponse");
        setErrors(newErrors);
        setStep("uploadDocument");
      } else {
        const newErrors = [];
        newErrors.push("verification");
        setErrors(newErrors);
        setLoading(false);
      }
    } catch (error) {
      const newErrors = [];
      newErrors.push("SomethingWrong");
      setErrors(newErrors);
      setLoading(false);
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
            onClick={() => setStep("onboardingType")}
          >
            <i className="fa-solid fa-chevron-left fa-lg"></i>
          </button>
          <div className="flex-grow-1">
            <h4 className="fw-semibold text-center mb-0">
              Contact & Personal Details
            </h4>
            <h6 className="fw-light text-center lh-lg py-1">
              Please provide your details to proceed with identity verification.
            </h6>
          </div>
        </div>
        <div className="d-flex flex-column gap-2">
          <div className="arrow-line mb-4 mt-2" />
        </div>

        <div className="w-100 d-flex align-items-center flex-column gap-4">
          {/* WhatsApp Mobile Number */}
          <div className="w-100">
            <label htmlFor="whatsapp">WhatsApp Mobile Number *</label>
            <div className="row g-2 align-items-center mt-2">
              <div className="col-12 col-md-auto">
                <select
                  className={`form-select form-select-lg rounded-3 ${
                    errors.includes("phone")
                      ? "bg-danger-subtle border border-danger"
                      : "bg-secondary-subtle"
                  }`}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+91">+91</option>
                </select>
              </div>
              <div className="col position-relative">
                <input
                  type="text"
                  className={`form-control form-control-lg ps-3 pe-5 rounded-3 ${
                    errors.includes("phone")
                      ? "bg-danger-subtle border border-danger"
                      : "bg-light"
                  }`}
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
                <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                  <i className="fa-brands fa-whatsapp fa-2xl text-success" />
                </div>
              </div>
            </div>
            {errors.includes("phone") && (
              <p className="text-danger mt-2 fw-medium">
                Please enter a valid phone number must begin with +91 and be 10
                digits.
              </p>
            )}
          </div>

          {/* Telegram ID (Optional) */}
          <div className="w-100">
            <label htmlFor="telegramUsername">Telegram ID</label>
            <div className="d-flex flex-column justify-content-center position-relative mt-2">
              <input
                type="text"
                className="form-control form-control-lg bg-light w-100 my-2"
                placeholder="@Telegram"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
              />
              <div className="position-absolute end-0 mt-1 me-3 translate-end-x">
                <i
                  className="fa-brands fa-telegram fa-2xl"
                  style={{ color: "#239ce3" }}
                ></i>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="w-100">
            <label htmlFor="fullName">Full Name (as per Aadhaar/PAN) </label>
            <input
              type="text"
              className="form-control form-control-lg bg-light"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="row align-items-center justify-content-between w-100">
            {/* Date of Birth */}
            <div className="col-6 ps-0">
              <label htmlFor="dob">Date of Birth </label>
              <input
                type="date"
                className="form-control form-control-lg bg-light"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            {/* Gender */}
            <div className="col-6 pe-0">
              <label htmlFor="gender">Gender </label>
              <select
                className="form-select form-select-lg bg-light"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {/* Nationality */}
          <div className="w-100">
            <label htmlFor="nationality">Nationality </label>
            <input
              type="text"
              className="form-control form-control-lg bg-light"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
          </div>

          {/* Residential Address */}
          <div className="w-100">
            <label htmlFor="address">Residential Address </label>
            <textarea
              className="form-control form-control-lg bg-light"
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* City & State */}
          <div className="w-100">
            <label htmlFor="cityState">City & State </label>
            <input
              type="text"
              className="form-control form-control-lg bg-light"
              value={cityState}
              onChange={(e) => setCityState(e.target.value)}
            />
          </div>

          {/* Error messages (optional logic based on your state) */}
          {errors.includes("somethingWrong") && (
            <p className="text-danger mt-2 fw-medium">Something Went Wrong</p>
          )}

          {/* Submit Button */}
          <button
            disabled={loading}
            onClick={handleIdentityVerification}
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

export default InitVefirication;
