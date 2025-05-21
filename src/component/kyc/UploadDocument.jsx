"use client";
import React, { useEffect, useState } from "react";
import DocUploader from "../DocUploader";
import { APITemplate } from "../API/Template";

const UploadDocument = ({ data, setStep, verification, getVerification }) => {
  const [errors, setErrors] = useState([]);
  const [isUAEResident, setIsUAEResident] = useState(
    data?.nationalityCountry === "AE" ? true : false
  );
  const [documentType, setDocumentType] = useState(
    verification?.applicant?.documents?.[0]?.type
  );
  const [documentFrontSide, setDocumentFrontSide] = useState("");
  const [documentBackSide, setDocumentBackSide] = useState("");
  const [UAEdocumentFrontSide, setUAEDocumentFrontSide] = useState("");
  const [UAEdocumentBackSide, setUAEDocumentBackSide] = useState("");

  const removeDocOnResidenceChange = async () => {
    const formData = new FormData();
    formData.append("document", "");
    formData.append("type", documentType);
    formData.append("documentExtractType", documentType);
    formData.append("verificationId", verification?._id);

    try {
      const response = await APITemplate(
        "user/removeResidenceDocumentImages",
        "POST",
        formData
      );
      if (response.success == true) {
        // getVerification(verification?._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!data) return;

    if (data?.documentType) {
      setDocumentType(data?.documentType);
    }
    console.log(data?.nationalityCountry);

    if (data?.documentType === "Emirate ID") {
      setIsUAEResident(true);
    } else {
      setIsUAEResident(false);
    }

    if (data?.documentType === "Emirate ID") {
      if (data?.documentFrontSide) {
        setUAEDocumentFrontSide(data?.documentFrontSide);
      }
      if (data?.documentBackSide) {
        setUAEDocumentBackSide(data?.documentBackSide);
      }

      // setDocumentFrontSide("");
      // setDocumentBackSide("");
    } else if (
      data?.documentType === "PASSPORT" ||
      data?.documentType === "OTHER_ID"
    ) {
      setDocumentFrontSide(data?.documentFrontSide);
      setDocumentBackSide(data?.documentBackSide);

      // setUAEDocumentFrontSide("");
      // setUAEDocumentBackSide("");
    }

    setErrors([]);
  }, [data]);

  // useEffect(() => {
  //   setUAEDocumentFrontSide("");
  //   setUAEDocumentBackSide("");
  //   setDocumentFrontSide("");
  //   setDocumentBackSide("");
  // }, [isUAEResident]);

  return (
    <div className="row align-items-start justify-content-center rounded-5 min-vh-90 w-100">
      <div className="col-lg-5 rounded-5 bg-white shadow-lg p-md-4 p-4 my-md- ">
        <div className="d-flex flex-column align-items-start gap-3 p-2 pt-0 w-100">
          <div className="d-flex flex-column gap-2 w-100">
            <div className="d-flex align-items-center gap-2">
              <button
                className={`btn border_primary text_Primary_500 p-3 mb-2 `}
                style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                onClick={() => setStep("initVerification")}
              >
                <i className="fa-solid fa-chevron-left fa-lg"></i>
              </button>
              <h4 className="fw-bold d-block text-center w-100 d-md-none">
                Let&apos;s Get You Verified
              </h4>
            </div>
            <h4 className="fw-bold d-none d-md-block">
              Let&apos;s Get You Verified
            </h4>
            <h6 className="text-center small text-muted lh-base py-1">
              Confirm your country of residence to learn how your personal data
              will be processed.
            </h6>
            <div className="arrow-line my-2" />
          </div>

          <div className="d-flex flex-column align-items-center justify-content-center w-100  gap-4">
            <div className="w-100 ">
              <h6 className="fw-bold text-md-start text-center">
                Are you currently residing in the UAE?
              </h6>
              <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-3 mt-2">
                <label
                  className={`btn d-flex align-items-center rounded-2 border_primary gap-3 px-3 py-1 mt-2 ${
                    isUAEResident ? "active" : ""
                  }`}
                  style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input my-2 Primary _500 text-whitem"
                    checked={isUAEResident}
                    onChange={() => {
                      setIsUAEResident(true);
                      setDocumentType("Emirate ID");
                      // if (UAEdocumentBackSide || UAEdocumentFrontSide) {
                      removeDocOnResidenceChange();
                      // }
                    }}
                  />

                  <small>Yes</small>
                </label>
                <label
                  className={`btn d-flex align-items-center rounded-2 border_primary gap-3 px-3 py-1 mt-2 ${
                    !isUAEResident ? "active" : ""
                  }`}
                  style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input my-2 Primary _500 text-whitem"
                    checked={!isUAEResident}
                    onChange={() => {
                      setIsUAEResident(false);
                      removeDocOnResidenceChange();
                      if (documentFrontSide || documentBackSide) {
                        setDocumentType("PASSPORT");
                      }
                      // setUAEDocumentFrontSide("");
                      // setUAEDocumentBackSide("");
                    }}
                  />
                  <small>No</small>
                </label>
              </div>
            </div>

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

            {isUAEResident ? (
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
                      <small className="ms-2 text-muted">
                        Perfect Document
                      </small>
                    </li>
                  </ul>
                </div>

                <div className="row gy-3 justify-content-between align-items-center py-md-3">
                  <div className="col-md-6">
                    <DocUploader
                      id={"frontDocument"}
                      title={"Front Side"}
                      documentType={"Emirate ID"}
                      document={UAEdocumentFrontSide}
                      setDocument={setUAEDocumentFrontSide}
                      verificationId={verification?._id}
                      getVerification={getVerification}
                      updateURL="user/updateResidenceDocument"
                      documentPreview="/images/UAE-ID.png"
                    />
                  </div>
                  <div className="col-md-6">
                    <DocUploader
                      id={"backDocument"}
                      title={"Back Side"}
                      documentType={"Emirate ID"}
                      document={UAEdocumentBackSide}
                      setDocument={setUAEDocumentBackSide}
                      getVerification={getVerification}
                      verificationId={verification?._id}
                      updateURL="user/updateResidenceBackDocument"
                      documentPreview={"/images/UAE-ID-Back.png"}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="w-100 text-center text-md-start">
                <h6 className="fw-bold">Select Document:</h6>
                <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-3 mt-2">
                  <label
                    className={`btn d-flex align-items-center rounded-2 border_primary gap-3 px-3 py-1 mt-2 ${
                      documentType === "PASSPORT" ? "active" : ""
                    }`}
                    style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input my-2 Primary _500 text-whitem"
                      checked={documentType === "PASSPORT"}
                      onChange={() => setDocumentType("PASSPORT")}
                    />
                    <small>Passport</small>
                  </label>
                  <label
                    className={`btn d-flex align-items-center rounded-2 border_primary gap-3 px-3 py-1 mt-2 ${
                      documentType === "OTHER_ID" ? "active" : ""
                    }`}
                    style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input my-2 Primary _500 text-whitem"
                      checked={documentType === "OTHER_ID"}
                      onChange={() => setDocumentType("OTHER_ID")}
                    />
                    <small>Other ID</small>
                  </label>
                </div>
                {(documentType == "PASSPORT" || documentType == "OTHER_ID") && (
                  <>
                    <div className="d-flex flex-column flex-md-row justify-content-start align-items-start gap-md-5 w-100 mt-4">
                      <ul className="list-unstyled">
                        <li className="d-flex align-items-start align-items-md-center mb-3">
                          <img
                            alt=""
                            src="/svgs/check-circle.svg"
                            className="rounded-2"
                            height="20"
                          />
                          <small className="ms-md-2 ms-1 text-muted">
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
                          <small className="ms-md-2 ms-1 text-muted">
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
                          <small className="ms-md-2 ms-1 text-muted">
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
                          <small className="ms-md-2 ms-1 text-muted">
                            Perfect Document
                          </small>
                        </li>
                      </ul>
                    </div>

                    <div className="row gy-3 justify-content-between align-items-center py-md-3">
                      <div className="col-md-6">
                        <DocUploader
                          id={"frontDocument"}
                          title={"Front Side"}
                          documentType={documentType}
                          document={documentFrontSide}
                          setDocument={setDocumentFrontSide}
                          verificationId={verification._id}
                          getVerification={getVerification}
                          updateURL="user/updateResidenceDocument"
                          documentPreview="/images/PASSPORT-FRONT.png"
                        />
                      </div>
                      <div className="col-md-6">
                        <DocUploader
                          id={"backDocument"}
                          title={"Back Side"}
                          documentType={documentType}
                          document={documentBackSide}
                          setDocument={setDocumentBackSide}
                          verificationId={verification._id}
                          getVerification={getVerification}
                          updateURL="user/updateResidenceBackDocument"
                          documentPreview={"/images/PASSPORT-BACK.png"}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

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
                setErrors([]);
                if (isUAEResident) {
                  if (UAEdocumentFrontSide == "" || UAEdocumentBackSide == "") {
                    setErrors(["document"]);
                    return;
                  }
                } else {
                  if (documentFrontSide == "" || documentBackSide == "") {
                    setErrors(["document"]);
                    return;
                  }
                }
                setStep("questionaries");
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
