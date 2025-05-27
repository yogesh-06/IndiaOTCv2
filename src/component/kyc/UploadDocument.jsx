"use client";
import React, { useEffect, useState } from "react";
import DocUploader from "../DocUploader";
import { APITemplate } from "../API/Template";
import { isFileProtected } from "../global";
import PdfPassword from "../PdfPassword";

const UploadDocument = ({ setStep, verification, getVerification }) => {
  const [errors, setErrors] = useState([]);
  const [subStep, setSubStep] = useState(1);
  const [documentFrontSide, setDocumentFrontSide] = useState("");
  const [documentBackSide, setDocumentBackSide] = useState("");
  const [PANDocument, setPANDocument] = useState("");
  const [bankDocument, setBankDocument] = useState([]);
  const [showPdfPasswordModal, setShowPdfPasswordModal] = useState("none");
  const [protectedFile, setProtectedFile] = useState();
  const [loading, setLoading] = useState(false);

  const [documentType, setDocumentType] = useState(
    verification?.applicant?.documents?.[0]?.type
  );

  const onSubmitPassword = async (password) => {
    const formData = new FormData();
    formData.append("image", protectedFile);
    formData.append("password", password);
    formData.append("verificationId", verification?._id);

    try {
      // Send the image file to the server via an API endpoint
      const response = await APITemplate(
        "user/updateMultifilesBankStatement",
        "POST",
        formData
      );

      if (response.success == true) {
        // setStep("uploadBankStatement");
        setBankDocument(
          response?.data?.length &&
            response?.data.find((item) => item.type == "BANK_STATEMENT").files
        );
      }
    } catch (error) {
      // enqueueSnackbar(error.message, {
      //   variant: "error",
      // });
    }
  };

  useEffect(() => {
    if (!verification) return;
    if (verification?.applicant?.documents?.length > 0) {
      const doc = verification?.applicant?.documents[0];
      setDocumentType(doc?.type);
      setDocumentBackSide(doc?.back_side);
      setDocumentFrontSide(doc?.front_side);
      setPANDocument(
        verification?.applicant?.documents?.length > 1 &&
          verification?.applicant?.documents.find(
            (item) => item.type == "PANCARD"
          )?.portrait
      );
      setBankDocument(
        verification?.applicant?.documents.find(
          (item) => item?.type == "BANK_STATEMENT"
        )?.files
      );
    }

    if (errors?.length > 0) {
      setErrors([]);
    }
  }, [verification]);

  return (
    <div className="row align-items-start justify-content-center rounded-5 min-vh-90 w-100">
      <PdfPassword
        isOpen={showPdfPasswordModal}
        onClose={() => setShowPdfPasswordModal("none")}
        onPasswordSubmit={onSubmitPassword}
      />
      <div className="col-lg-5 rounded-5 bg-white shadow-lg p-md-4 p-4 my-md- ">
        <div className="d-flex flex-column align-items-start gap-3 p-2 pt-0 w-100">
          <div className="d-flex flex-column gap-3 w-100">
            {/* Header with back button and title */}
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn border_primary text_Primary_500 p-3"
                style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                onClick={() => setStep("initVerification")}
              >
                <i className="fa-solid fa-chevron-left fa-lg"></i>
              </button>
              <div className="flex-grow-1 text-start">
                <h4 className="fw-bold m-0">Upload Required Documents</h4>
              </div>
            </div>

            <div className="password-strength mt-md-2 px-5 py-3">
              <div className="d-flex justify-content-between ">
                <small className={`fw-bold ${"text-muted"}`}>Aadhar Card</small>
                <small className={`fw-bold ${"text-muted"}`}>PAN Card</small>
                <small className={`fw-bold ${"text-muted"}`}>
                  Bank Statement
                </small>
              </div>

              <div className="progress mt-2" style={{ height: "8px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${(subStep / 3) * 100}%`,
                    backgroundColor: subStep >= 1 ? "blue" : "orange",
                  }}
                  aria-valuenow={subStep}
                  aria-valuemin="0"
                  aria-valuemax="3"
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
              {subStep === 3 ? (
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
                        Upload latest 3-month statement
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
                        Multi-file upload supported
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
                        Password input if PDF protected
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
              ) : (
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
              )}
              {/* Document Upload Sections */}
              {subStep === 1 && (
                <div className="row gy-3 justify-content-between align-items-center py-md-3">
                  <div className="col-md-6">
                    <DocUploader
                      id={"frontDocument"}
                      title={"Front Side"}
                      documentType={"GOVERNMENT_ID"}
                      document={documentFrontSide}
                      setDocument={setDocumentFrontSide}
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
                      document={documentBackSide}
                      setDocument={setDocumentBackSide}
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

              {subStep === 3 && (
                <div
                  // className="rounded-4 bg-white shadow-lg py-3 px-4 my-5 w-100"
                  className="rounded-4 px-4 my- w-100"
                  // style={{ border: "1px solid #373737" }}
                >
                  {/* <div className="d-flex justify-content-between">
                    <button
                      onClick={() => setSubStep(2)}
                      className="btn btn-outline-dark"
                    >
                      <i className="fa fa-arrow-left"></i>
                    </button>
                    {bankDocument && bankDocument != "" && (
                      <button
                        onClick={() => setStep("questionariesData")}
                        className="btn btn-outline-dark"
                      >
                        <i className="fa fa-arrow-right"></i>
                      </button>
                    )}
                  </div> */}
                  <div className="d-flex flex-column align-items-start  p-3">
                    <div className="d-flex gap-4 p-3 w-100">
                      <div className="d-flex flex-column gap-2 text-center w-100">
                        {/* <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                          Step 4 / 5
                        </h5> */}
                        <h3 className="fw-semibold">Upload Bank Statement</h3>
                      </div>
                    </div>

                    <div className="w-100 d-flex align-items-center w-100 flex-column gap-4 ">
                      <div className="bg-light rounded-5 w-100 p-4 text-center">
                        {bankDocument?.length > 0 ? (
                          bankDocument.map((doc, index) => {
                            return (
                              <img
                                key={index}
                                src={"/images/bank-statement-preview.png"}
                                className="img-fluid"
                                width={100}
                                alt={doc?.imageURL}
                              />
                            );
                          })
                        ) : (
                          <img
                            src={"/images/bank-statement-preview.png"}
                            className="img-fluid"
                            width={100}
                            alt=""
                          />
                        )}
                      </div>
                      <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
                        <div>
                          {!bankDocument ? (
                            <label
                              htmlFor={"image"}
                              className="btn btn-outline-dark btn-lg"
                            >
                              {loading ? (
                                <div className="d-flex align-items-center">
                                  <div
                                    className="spinner-border "
                                    role="status"
                                    style={{
                                      width: "1.5rem",
                                      height: "1.5rem",
                                    }}
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </div>
                                  <span className="ms-2">Loading...</span>
                                </div>
                              ) : (
                                <>
                                  <i className="fa fa-plus"></i>
                                  Upload Document
                                </>
                              )}
                            </label>
                          ) : (
                            <div className="d-flex flex-column gap-2">
                              <div className="d-flex justify-content-center gap-2">
                                <label
                                  htmlFor={"image"}
                                  className="btn btn-lg btn-outline-dark"
                                  onClick={() => {
                                    setBankDocument([]);
                                  }}
                                >
                                  <i className="fa fa-recycle"></i>
                                  Re-upload Document
                                </label>
                                <label
                                  htmlFor={"image"}
                                  className="btn btn-lg btn-primary"
                                >
                                  Add More
                                </label>
                              </div>
                              {/* <button
                                className="btn btn-lg btn-primary"
                                onClick={() => setStep("questionariesData")}
                              >
                                Confirm
                              </button> */}
                            </div>
                          )}
                          <input
                            type="file"
                            accept="application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                            id={"image"}
                            name={"image"}
                            className="form-control d-none"
                            onChange={async (e) => {
                              setLoading(true);
                              const file = e.target.files[0];

                              if (file?.type === "application/pdf") {
                                const isProtected = await isFileProtected(file);

                                if (isProtected) {
                                  setShowPdfPasswordModal("open");
                                  setProtectedFile(file);
                                  setLoading(false);
                                  return;
                                }
                              }

                              const formData = new FormData();
                              formData.append("image", file);
                              formData.append("password", "");
                              formData.append(
                                "verificationId",
                                verification?._id
                              );

                              try {
                                const response = await APITemplate(
                                  // "user/updateBankStatement",
                                  "user/updateMultifilesBankStatement",
                                  "POST",
                                  formData
                                );
                                if (response.success == true) {
                                  // setStep("uploadBankStatement");
                                  setBankDocument(
                                    response?.data?.length &&
                                      response?.data.find(
                                        (item) => item.type == "BANK_STATEMENT"
                                      ).files
                                  );
                                }
                              } catch (error) {
                                // enqueueSnackbar(error.message, {
                                //   variant: "error",
                                // });
                              }
                              setLoading(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
            {errors.includes("PANDocument") && (
              <p className="text-warning text-center fw-semibold">
                <i className="fa-solid fa-circle-exclamation fa-lg text-warning me-2"></i>
                <span>
                  Please upload the PAN document, It&apos;s mandatory.
                </span>
              </p>
            )}
            {errors.includes("bankDocument") && (
              <p className="text-warning text-center fw-semibold">
                <i className="fa-solid fa-circle-exclamation fa-lg text-warning me-2"></i>
                <span>
                  Please upload the Bank Statement, It&apos;s mandatory.
                </span>
              </p>
            )}

            <button
              className="btn btn-lg Primary_500 text-white fw-semibold w-100 mb-2"
              onClick={() => {
                setErrors([]);
                if (
                  (subStep == 1 && documentFrontSide == "") ||
                  documentBackSide == ""
                ) {
                  setErrors(["document"]);
                  return;
                }
                if (subStep == 2 && !PANDocument) {
                  setErrors(["PANDocument"]);
                  return;
                }
                if (
                  subStep == 3 &&
                  (!bankDocument || !bankDocument?.length > 0)
                ) {
                  setErrors(["bankDocument"]);
                  return;
                }
                setSubStep(subStep == 1 ? 2 : 3);
                if (subStep === 3) {
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

export default UploadDocument;
