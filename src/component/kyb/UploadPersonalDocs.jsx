"use client";
import React, { useEffect, useState } from "react";
import DocUploader from "../DocUploader";
import { APITemplate } from "../API/Template";
import { isFileProtected } from "../global";
import PdfPassword from "../PdfPassword";

const UploadPersonalDocs = ({
  data,
  setStep,
  verification,
  getVerification,
}) => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subStep, setSubStep] = useState(1);
  const [aadharFrontSide, setAadharFrontSide] = useState("");
  const [aadharBackSide, setAadharBackSide] = useState("");
  const [PANDocument, setPANDocument] = useState("");

  const [documentType, setDocumentType] = useState(
    verification?.applicant?.documents?.[0]?.type
  );

  useEffect(() => {
    if (!data) return;

    if (data?.documentType) {
      setDocumentType(data?.documentType);
    }
    if (data?.aadharFrontSide) {
      setAadharFrontSide(data?.aadharFrontSide);
    }
    if (data?.aadharBackSide) {
      setAadharBackSide(data?.aadharBackSide);
    }
    if (data?.panCard) {
      setPANDocument(data?.panCard);
    }
    if (errors.length > 0) {
      setErrors([]);
    }
  }, [data]);

  return (
    <div className="row align-items-start justify-content-center rounded-5 min-vh-90 w-100">
      <div className="col-lg-5 rounded-5 bg-white shadow-lg p-md-4 p-4 my-md- ">
        <div className="d-flex flex-column align-items-start gap-3 p-2 pt-0 w-100">
          <div className="d-flex flex-column gap-3 w-100">
            {/* Header with back button and title */}
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn border_primary text_Primary_500 p-3"
                style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                onClick={() => setStep("personalInfo")}
              >
                <i className="fa-solid fa-chevron-left fa-lg"></i>
              </button>
              <div className="flex-grow-1 text-start">
                <h4 className="fw-bold m-0">Upload Personal Documents</h4>
              </div>
            </div>

            <div className="password-strength mt-md-2 px-5 py-3">
              <div className="d-flex justify-content-between ">
                <small className={`fw-bold ${"text-muted"}`}>Aadhar Card</small>
                <small className={`fw-bold ${"text-muted"}`}>PAN Card</small>
              </div>

              <div className="progress mt-2" style={{ height: "8px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${(subStep / 2) * 100}%`,
                    backgroundColor: subStep >= 1 ? "blue" : "orange",
                  }}
                  aria-valuenow={subStep}
                  aria-valuemin="0"
                  aria-valuemax="2"
                />
              </div>
            </div>

            <div className="arrow-line my-2" />
          </div>

          <div className="d-flex flex-column align-items-center justify-content-center w-100  gap-4">
            <small
              className="smaller text-md-start text-center"
              style={{ fontSize: "14px" }}
            >
              By clicking the “Continue” button I agree that I have read the and
              give my consent to the processing of my
              <span className="text_Primary_500 "> privacy notice </span>
              data, including biometrics, as described in this{" "}
              <span className="text_Primary_500">
                notification to processing of personal data.
              </span>
            </small>
            <>
              <div className="d-flex flex-column flex-md-row justify-content-start align-items-start gap-md-5 w-100 mt-3">
                <ul className="list-unstyled">
                  <li className="d-flex align-items-start align-items-md-center mb-3">
                    <img
                      alt=""
                      src="/svgs/check-circle.svg"
                      className="rounded-2"
                      height="20"
                    />
                    <small className="ms-2 text-muted">
                      Show all details of the document
                    </small>
                  </li>
                  <li className="d-flex align-items-start align-items-md-center">
                    <img
                      alt=""
                      src="/svgs/check-circle.svg"
                      className="rounded-2"
                      height="20"
                    />
                    <small className="ms-2 text-muted">
                      All data must be clear
                    </small>
                  </li>
                </ul>
                <ul className="list-unstyled">
                  <li className="d-flex align-items-start align-items-md-center mb-3">
                    <img
                      alt=""
                      src="/svgs/check-circle.svg"
                      className="rounded-2"
                      height="20"
                    />
                    <small className="ms-2 text-muted">
                      No glares or shadow
                    </small>
                  </li>
                  <li className="d-flex align-items-start align-items-md-center">
                    <img
                      alt=""
                      src="/svgs/check-circle.svg"
                      className="rounded-2"
                      height="20"
                    />
                    <small className="ms-2 text-muted">Perfect Document</small>
                  </li>
                </ul>
              </div>

              {/* Document Upload Sections */}
              {subStep === 1 && (
                <div className="row gy-3 justify-content-between align-items-center py-md-3">
                  <div className="col-md-6">
                    <DocUploader
                      id={"frontDocument"}
                      title={"Front Side"}
                      documentType={"GOVERNMENT_ID"}
                      document={aadharFrontSide}
                      setDocument={setAadharFrontSide}
                      verificationId={verification?._id}
                      getVerification={getVerification}
                      updateURL="user/updateResidenceDocument"
                      documentPreview="/svgs/aadhar-preview.svg"
                    />
                  </div>
                  <div className="col-md-6">
                    <DocUploader
                      id={"backDocument"}
                      title={"Back Side"}
                      documentType={"GOVERNMENT_ID"}
                      document={aadharBackSide}
                      setDocument={setAadharBackSide}
                      getVerification={getVerification}
                      verificationId={verification?._id}
                      updateURL="user/updateResidenceBackDocument"
                      documentPreview="/svgs/aadhar-preview.svg"
                    />
                  </div>
                </div>
              )}

              {subStep === 2 && (
                <div className="col-md-6">
                  <DocUploader
                    id={"panCard"}
                    title={"PAN Card"}
                    documentType={"PANCARD"}
                    document={PANDocument}
                    setDocument={setPANDocument}
                    verificationId={verification?._id}
                    getVerification={getVerification}
                    updateURL="user/updatePancard"
                    documentPreview="/svgs/aadhar-preview.svg"
                  />
                </div>
              )}
            </>

            {errors.includes("document") && (
              <p className="text-warning text-center fw-semibold">
                <i className="fa-solid fa-circle-exclamation fa-lg text-warning me-2"></i>
                <span>
                  Please upload both front & back side of the document{" "}
                </span>
              </p>
            )}
            <button
              className="btn btn-lg Primary_500 text-white fw-semibold w-100 mb-2"
              onClick={() => {
                // setErrors([]);
                // if (aadharFrontSide == "" || aadharBackSide == "") {
                //   setErrors(["document"]);
                //   return;
                // }
                setSubStep(subStep == 1 && 2);
                if (subStep === 2) {
                  setStep("questionaries");
                }
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPersonalDocs;
