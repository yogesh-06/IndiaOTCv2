"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { APITemplate } from "../API/Template";

const Declaration = ({ data, setStep, verification, getVerification }) => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [declaration, setDeclaration] = useState({
    type: "No",
    fullName: "",
    relation: "",
  });

  useEffect(() => {
    if (verification?.applicant?.declaration) {
      setDeclaration(
        verification?.applicant?.declaration || {
          type: "Yes",
          fullName: "",
          relation: "",
        }
      );
      setIsChecked(verification?.applicant?.declaration !== "" ? true : false);
    }
  }, [verification]);

  useEffect(() => {
    if (data?.declaration) {
      setDeclaration(
        data?.declaration || {
          type: "Yes",
          fullName: "",
          relation: "",
        }
      );
      setIsChecked(data?.declaration !== "" ? true : false);
    }
  }, [data]);

  const handleDeclaration = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];
    if (!isChecked) {
      setLoading(false);
      newErrors.push("unchecked");
      setErrors(newErrors);
    }
    if (!declaration) {
      setLoading(false);
      newErrors.push("declaration");
      setErrors(newErrors);
    }
    if (declaration.type == "Yes") {
      if (!declaration.fullName) {
        setLoading(false);
        newErrors.push("declaration");
        setErrors(newErrors);
      }
      if (!declaration.relation) {
        setLoading(false);
        newErrors.push("declaration");
        setErrors(newErrors);
      }
    }

    if (newErrors.length > 0) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("declaration", JSON.stringify(declaration));
    formData.append("verificationId", verification?._id);

    try {
      const response = await APITemplate(
        "user/handleDeclarationAgreement",
        "POST",
        formData
      );
      if (response.success) {
        const newErrors = [];
        newErrors.push("sucessResponse", 200);
        setErrors(newErrors);
        await APITemplate("user/submitReview", "POST", {
          verificationId: verification?._id,
        });
        await getVerification(verification?._id);
        setStep("completed");
        // useEffect(() => {
        window.location.reload();
        // }, [verification]);
      } else {
        const newErrors = [];
        newErrors.push("verification", 100);
        setErrors(newErrors);
        setLoading(false);
      }
    } catch (error) {
      const newErrors = [];
      newErrors.push("SomethingWrong", 100);
      setErrors(newErrors);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className={`row align-items-start justify-content-center w-100`}>
      <div className="col-md-5 rounded-5 bg-white shadow-lg p-4 mb-5">
        <div className="d-flex w-100 flex-column align-items-center gap-3 p-md-3 pt-0 w-100">
          <div className="d-flex flex-column gap-2 w-100">
            <div>
              <button
                className={`btn border_primary text_Primary_500 p-3 mb-2 `}
                style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                onClick={() => setStep("questionaries")}
              >
                <i className="fa-solid fa-chevron-left fa-lg"></i>
              </button>
            </div>
            <h4 className="fw-bold">Declaration Agreement</h4>
            <div className="arrow-line my-2" />
            <div className="my-3">
              <div className="progress rounded-2" style={{ height: "14px" }}>
                <div
                  className="progress-bar Primary_500"
                  role="progressbar"
                  style={{
                    width: `100%`,
                  }}
                  aria-valuenow={100}
                  aria-valuemin="0"
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          </div>
          <div
            className="fw-light w-100 text-muted lh-lg py-1"
            style={{
              fontSize: "13px",
            }}
          >
            <div className="text-dark fs-6">
              <div className="w-100 mb-4">
                <h6 className="fw-bold text-md-start text-center">
                  Are you acting on behalf of someone else?
                </h6>
                <div className="d-flex w-100 justify-content-center justify-content-md-start align-items-center gap-3 mt-2">
                  <label
                    className={`btn d-flex align-items-center rounded-2 border_primary gap-3 px-3 py-1 mt-2 ${
                      declaration?.type === "Yes" ? "active" : ""
                    }`}
                    style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input my-2 Primary _500 text-whitem"
                      checked={declaration?.type === "Yes"}
                      onChange={() => {
                        setDeclaration((prev) => ({
                          ...prev,
                          type: "Yes",
                        }));
                      }}
                    />
                    <small>Yes</small>
                  </label>
                  <label
                    className={`btn d-flex align-items-center rounded-2 border_primary gap-3 px-3 py-1 mt-2 ${
                      declaration?.type === "No" ? "active" : ""
                    }`}
                    style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input my-2 Primary _500 text-whitem"
                      checked={declaration?.type === "No"}
                      onChange={() => {
                        setDeclaration((prev) => ({
                          type: "No",
                          fullName: "",
                          relation: "",
                        }));
                      }}
                    />
                    <small>No</small>
                  </label>
                </div>
              </div>
              {declaration?.type === "Yes" && (
                <>
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={declaration?.fullName}
                      onChange={(e) =>
                        setDeclaration({
                          ...declaration,
                          fullName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mt-3">
                    <label className="form-label">Relation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={declaration?.relation}
                      onChange={(e) =>
                        setDeclaration({
                          ...declaration,
                          relation: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
            <span className="d-flex align-items-md-center align-items-start gap-2 px-md-1 mt-4">
              <input
                type="checkbox"
                className="form-check-input mt-md-0 mt-2"
                id="useragreement"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="useragreement" className="">
                I agree to the{" "}
                <Link
                  target="_blank"
                  className="text_Primary_500 fw-semibold text-decoration-underline link-offset-3"
                  href="/terms-of-use"
                >
                  Terms of Agreement
                </Link>{" "}
                to confirm agreement.
              </label>
            </span>
          </div>

          <p
            className="d-flex flex-column align-items-start text-danger fw-medium m-0 p-0 py-2 gap-2 h-100"
            style={{ fontSize: "13px" }}
          >
            {errors.includes("declaration") && (
              <span className="d-flex align-items-start">
                <i className="fa-solid fa-circle-exclamation me-2"></i>
                Enter Declaration Statement.
              </span>
            )}
            {errors.includes("unchecked") && (
              <span className="d-flex align-items-md-start align-items-start">
                <i className="fa-solid fa-circle-exclamation me-1 mt-md-0 mt-1"></i>
                You need to accept our Terms of Agreement to proceed further.
              </span>
            )}
          </p>

          {errors.includes(100) && (
            <p
              className="text-danger  fw-medium m-0 p-0 pt-2 "
              style={{ fontSize: "13px" }}
            >
              {errors[0]}
            </p>
          )}

          {errors.includes(200) && (
            <p
              className="text-success  fw-medium m-0 p-0 pt-2 "
              style={{ fontSize: "13px" }}
            >
              {errors[0]}
            </p>
          )}
          <div className="d-flex justify-content-between align-items-center px-md-2 pt-md-2 w-100">
            <div className="text-secondary text-decoration-underline link-offset-3 fw-semibold cursor-pointer">
              Previous
            </div>
            <button
              disabled={loading}
              onClick={handleDeclaration}
              className="btn Primary_500 text-white fw-medium"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Declaration;
