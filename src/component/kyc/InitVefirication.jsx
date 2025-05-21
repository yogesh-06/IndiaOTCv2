"use client";
import React, { useEffect, useState } from "react";
import { APITemplate } from "../API/Template";
import { useUser } from "@/context/UserContext";
import countries from "../../utils/countryCode.json";

const InitVefirication = ({
  data,
  setStep,
  verifification,
  getVerification,
}) => {
  const { user } = useUser();
  // const geoDetails = await getGeoDetails();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  useEffect(() => {
    if (user?.phone) {
      setPhoneNumber(user?.phone);
      setTelegramUsername(user?.telegramUsername);
    }
  }, [user]);

  useEffect(() => {
    if (data?.phone) {
      setPhoneNumber(data?.phone);
      setTelegramUsername(data?.telegramUsername);
    }
  }, [data]);

  const handleNationality = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];

    const formData = new FormData();
    formData.append("nationalityCountry", "AE");

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

  const handleIdentityVerification = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];
    if (!phoneNumber) {
      setLoading(false);
      newErrors.push("phone");
      setErrors(newErrors);
    }
    const dubaiRegex = /^\d{9}$/;

    // if (phoneNumber && !dubaiRegex.test(phoneNumber)) {
    //   newErrors.push("phone");
    //   setErrors(newErrors);
    //   setLoading(false);
    //   return;
    // }

    if (newErrors.length > 0) {
      setLoading(false);
      return;
    }
    let lastVerificationId = await handleNationality();

    const formData = new FormData();
    formData.append("phone", phoneNumber);
    formData.append("telegramUsername", telegramUsername);
    formData.append("verificationId", lastVerificationId);

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
        await getVerification(lastVerificationId);
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
      <div className="col-md-5 rounded-5 bg-white shadow-lg p-md-4 px-3 py-4 my-md- ">
        <div className="d-flex flex-column gap-2">
          <h4 className="fw-bold text-center">Identity Verification</h4>
          <h6 className="fw-light lh-lg py-1">
            Your Telegram ID helps us connect you with our support desk faster.
          </h6>
          <div className="arrow-line mb-4" />
        </div>

        <div className="w-100 d-flex align-items-center w-100 flex-column gap-4">
          <div className="w-100">
            <label htmlFor="phone">UAE Mobile Number * </label>
            <div className="d-flex flex-column justify-content-center position-relative mt-2">
              <div className="row g-2 align-items-center">
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
                    {countries.map((country, index) => (
                      <option key={index} value={`+${country?.dial_code}`}>
                        +{country?.dial_code}
                      </option>
                    ))}
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
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                    <i className="fa-solid fa-phone fa-lg text-secondary" />
                  </div>
                </div>
              </div>
            </div>
            {errors.includes("phone") && (
              <p className="text-danger mt-2 fw-medium">
                Please enter a valid phone number must begin with +971 or 05 and
                be 9 digits.
              </p>
            )}
          </div>
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

          {errors.includes("verification") && (
            <p className="text-danger mt-2 fw-medium">
              Issue with verification
            </p>
          )}

          {errors.includes("somethingWrong") && (
            <p className="text-danger mt-2 fw-medium">Something Went Wrong</p>
          )}

          {errors.includes("nationality") && (
            <p className="text-danger mt-2 fw-medium">
              Nationality Updation Failed
            </p>
          )}
          {errors.includes("nationalityVerification") && (
            <p className="text-danger mt-2 fw-medium">
              Nationality Updation Failed
            </p>
          )}

          <button
            disabled={loading}
            onClick={handleIdentityVerification}
            className="btn btn-lg text-white fw-semibold Primary_500 mt-2 w-100"
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
    // </div>
  );
};

export default InitVefirication;
