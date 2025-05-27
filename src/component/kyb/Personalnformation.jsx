"use client";
import React, { useEffect, useState } from "react";
import { APITemplate } from "../API/Template";

const Personalnformation = ({
  user,
  setStep,
  verification,
  getVerification,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");
  const [cityState, setCityState] = useState("");

  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.dateOfBirth) setDob(user.dateOfBirth);
      if (user.gender) setGender(user.gender);
      if (user.nationalityCountry) setNationality(user.nationalityCountry);
      if (user.address) setAddress(user.address);
      if (user.cityState) setCityState(user?.cityState);
    }
  }, [user]);

  const handleAuthPersonInfo = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];
    // setStep("uploadPersonalDocs");
    // return;
    // Validation
    if (!fullName) newErrors.push("fullName");
    if (!dob) newErrors.push("dob");
    if (!gender) newErrors.push("gender");
    if (!nationality) newErrors.push("nationality");
    if (!address) newErrors.push("address");
    if (!cityState) newErrors.push("cityState");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("dateOfBirth", dob);
    formData.append("gender", gender);
    formData.append("nationality", nationality);
    formData.append("address", address);
    formData.append("cityState", cityState);
    formData.append("verificationId", verification?._id);

    try {
      const response = await APITemplate(
        "user/updatePersonalInfo",
        "POST",
        formData
      );

      if (response.success) {
        setErrors(["successResponse"]);
        setStep("uploadPersonalDocs");
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
            onClick={() => setStep("uploadBusinessDocs")}
          >
            <i className="fa-solid fa-chevron-left fa-lg"></i>
          </button>
          <div className="flex-grow-1">
            <h4 className="fw-semibold text-center mb-0">
              Authorized Person Details
            </h4>
            <h6 className="fw-light text-center lh-lg py-1">
              Please provide the following details.
            </h6>
          </div>
        </div>
        <div className="d-flex flex-column gap-2">
          <div className="arrow-line mb-4 mt-2" />
        </div>

        <div className="w-100 d-flex align-items-center flex-column gap-4 mt-2">
          {/* Full Name */}
          <div className="w-100">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              className={`form-control form-control-lg ${
                errors.includes("fullName")
                  ? "bg-danger-subtle border border-danger"
                  : "bg-light"
              }`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.includes("fullName") && (
              <p className="small text-danger mt-2 fw-medium">
                Full name is required.
              </p>
            )}
          </div>
          <div className="row align-items-center justify-content-between w-100">
            {/* Date of Birth */}
            <div className="col-6 ps-0">
              <label htmlFor="dob">Date of Birth *</label>
              <input
                type="date"
                className={`form-control form-control-lg ${
                  errors.includes("dob")
                    ? "bg-danger-subtle border border-danger"
                    : "bg-light"
                }`}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              {errors.includes("dob") && (
                <p className="small text-danger mt-2 fw-medium">
                  Date of Birth is required.
                </p>
              )}
            </div>
            {/* Gender */}
            <div className="col-6 pe-0">
              <label htmlFor="gender">Gender *</label>
              <select
                className={`form-select form-select-lg ${
                  errors.includes("gender")
                    ? "bg-danger-subtle border border-danger"
                    : "bg-light"
                }`}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.includes("gender") && (
                <p className="small text-danger mt-2 fw-medium">
                  Gender is required.
                </p>
              )}
            </div>
          </div>

          {/* Nationality */}
          <div className="w-100">
            <label htmlFor="nationality">Nationality *</label>
            <input
              type="text"
              className={`form-control form-control-lg ${
                errors.includes("nationality")
                  ? "bg-danger-subtle border border-danger"
                  : "bg-light"
              }`}
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
            {errors.includes("nationality") && (
              <p className="small text-danger mt-2 fw-medium">
                Nationality is required.
              </p>
            )}
          </div>

          {/* Residential Address */}
          <div className="w-100">
            <label htmlFor="address">Residential Address *</label>
            <input
              type="text"
              className={`form-control form-control-lg ${
                errors.includes("address")
                  ? "bg-danger-subtle border border-danger"
                  : "bg-light"
              }`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.includes("address") && (
              <p className="small text-danger mt-2 fw-medium">
                Residential Address is required.
              </p>
            )}
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

          {/* Submit Button */}
          <button
            disabled={loading}
            onClick={handleAuthPersonInfo}
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

export default Personalnformation;
