"use client";
import React, { useEffect, useState } from "react";
import DocUploader from "../DocUploader";
import { APITemplate } from "../API/Template";
import { isFileProtected } from "../global";
import PdfPassword from "../PdfPassword";

const UploadBusinessDocs = ({ setStep, verification, getVerification }) => {
  const [errors, setErrors] = useState([]);
  const [subStep, setSubStep] = useState(1);
  const [bankDocument, setBankDocument] = useState([]);
  const [showPdfPasswordModal, setShowPdfPasswordModal] = useState("none");
  const [protectedFile, setProtectedFile] = useState();
  const [loading, setLoading] = useState(false);
  // const data = {
  //   // applicantType: "soleProprietorship",
  //   // applicantType: "partnershipFirm",
  //   // applicantType: "LLP",
  //   applicantType: "pvt-ltd",
  // };

  const [proprietorDoc, setProprietorDoc] = useState("");
  const [proprietorDocType, setProprietorDocType] = useState("");

  // Partnership Firm
  const [partnershipDeedDoc, setPartnershipDeedDoc] = useState("");
  const [partnershipDoc, setPartnershipDoc] = useState("");
  const [partnershipDocType, setPartnershipDocType] = useState("");

  // LLP
  const [llpAgreement, setLlpAgreement] = useState("");
  const [LLPDocType, setLLPDocType] = useState("");
  const [llpCOI, setLlpCOI] = useState("");
  const [LLPDoc, setLLPDoc] = useState("");

  // Private Limited Company
  const [pvtLtdDoc, setPvtLtdDoc] = useState("");
  const [pvtLtdDocType, setPvtLtdDocType] = useState("");
  const [pvtCOI, setPvtCOI] = useState("");
  const [pvtMOA, setPvtMOA] = useState("");

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
      verification.applicant.documents.map((item) => {
        const { type, portrait } = item;

        if (type.startsWith("BUSINESS_PROPRIETOR_")) {
          setProprietorDoc(portrait);
          if (type.includes("MSME")) {
            setProprietorDocType("MSME");
          } else if ("Udyam") {
            setProprietorDocType("Udyam");
          } else if ("GST") {
            setProprietorDocType("GST");
          } else if ("Equivalent") {
            setProprietorDocType("Equivalent");
          }
        } else if (type === "BUSINESS_PARTNERSHIP_DEED") {
          setPartnershipDeedDoc(portrait);
        } else if (type.startsWith("BUSINESS_PARTNERSHIP_OP_")) {
          setPartnershipDoc(portrait);
          if (type.includes("PAN")) {
            setPartnershipDocType("PAN");
          } else {
            setPartnershipDocType("GST");
          }
        } else if (type === "BUSINESS_LLP_AGREEMENT") {
          setLlpAgreement(portrait);
        } else if (type === "BUSINESS_LLP_COI") {
          setLlpCOI(portrait);
        } else if (type.startsWith("BUSINESS_LLP_OP_")) {
          setLLPDoc(portrait);
          if (type.includes("PAN")) {
            setLLPDocType("PAN");
          } else {
            setLLPDocType("GST");
          }
        } else if (type === "BUSINESS_PRIVATE_COI") {
          setPvtCOI(portrait);
        } else if (type === "BUSINESS_PRIVATE_MOA") {
          setPvtMOA(portrait);
        } else if (type.startsWith("BUSINESS_PRIVATE_OP_")) {
          setPvtLtdDoc(portrait);
          if (type.includes("PAN")) {
            setPvtLtdDocType("PAN");
          } else {
            setPvtLtdDocType("GST");
          }
        } else if (type.startsWith("BANK_STATEMENT")) {
          setBankDocument(item?.files);
        }

        return null;
      });
    }

    if (errors.length > 0) {
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
                onClick={() => setStep("businessInfo")}
              >
                <i className="fa-solid fa-chevron-left fa-lg"></i>
              </button>
              <div className="flex-grow-1 text-start">
                <h4 className="fw-bold m-0">Upload Business Documents</h4>
              </div>
            </div>

            <div className="password-strength mt-md-2 px-5 py-3">
              <div className="d-flex justify-content-between ">
                <small className={`fw-bold ${"text-muted"}`}>
                  Business Documents
                </small>
                <small className={`fw-bold ${"text-muted"}`}>
                  Business Bank Statement
                </small>
                {/* <small className={`fw-bold ${"text-muted"}`}>
                  Bank Statement
                </small> */}
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

          <div className="d-flex flex-column align-items-center justify-content-center w-100 gap-4">
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

            {subStep === 2 ? (
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
                      Name & account number must be visible
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
                      Must reflect sufficient funds
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
                      You can upload up to 5 files at once.
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
                    <small className="ms-2 text-muted">Perfect Document</small>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {subStep === 1 && (
            <>
              {verification?.applicant?.applicantType ===
                "soleProprietorship" && (
                <>
                  <div className="d-flex align-items-center justify-content-start gap-2">
                    <div className="text-nowrap fw-semibold fs-5 pb-1 ">
                      Sole Proprietorship:
                    </div>
                    <select
                      onChange={(e) => setProprietorDocType(e.target.value)}
                      value={proprietorDocType}
                      className="form-select w-auto"
                    >
                      <option value="">Select</option>
                      <option value="MSME">MSME</option>
                      <option value="Udyam">Udyam</option>
                      <option value="GST">GST</option>
                      <option value="Equivalent">Equivalent</option>
                    </select>
                  </div>
                  <div className="col-6 mx-auto ">
                    {proprietorDocType && (
                      <DocUploader
                        id="soleDoc"
                        title={proprietorDocType}
                        documentType={
                          "BUSINESS_PROPRIETOR_" + proprietorDocType
                        }
                        document={proprietorDoc}
                        setDocument={setProprietorDoc}
                        mandatory
                        verificationId={verification?._id}
                        getVerification={getVerification}
                        updateURL="user/updateProprietorDocument"
                        documentPreview="/svgs/aadhar-preview.svg"
                      />
                    )}
                  </div>
                </>
              )}

              {verification?.applicant?.applicantType === "partnershipFirm" && (
                <div className="row gy-3 justify-content-between align-items-center py-md-3 w-100">
                  <div className="d-flex align-items-center justify-content-start gap-2">
                    <div className="text-nowrap fw-semibold fs-5 pb-1">
                      Partnership Firm:
                    </div>
                    <select
                      onChange={(e) => setPartnershipDocType(e.target.value)}
                      value={partnershipDocType}
                      className="form-select w-auto"
                    >
                      <option value="">Select</option>
                      <option value="PAN">PAN</option>
                      <option value="GST">GST</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <DocUploader
                      id="partnershipDeedDoc"
                      title="Partnership Deed"
                      documentType={"BUSINESS_PARTNERSHIP_DEED"}
                      document={partnershipDeedDoc}
                      setDocument={setPartnershipDeedDoc}
                      mandatory
                      verificationId={verification?._id}
                      getVerification={getVerification}
                      updateURL="user/updatePartnershipDeedDocument"
                      documentPreview="/svgs/aadhar-preview.svg"
                    />
                  </div>
                  {partnershipDocType && (
                    <div className="col-md-6">
                      <DocUploader
                        id={partnershipDocType}
                        title={partnershipDocType}
                        documentType={
                          "BUSINESS_PARTNERSHIP_OP_" + partnershipDocType
                        }
                        document={partnershipDoc}
                        setDocument={setPartnershipDoc}
                        optional
                        verificationId={verification?._id}
                        getVerification={getVerification}
                        updateURL="user/updatePartnershipOptionalDocument"
                        documentPreview="/svgs/aadhar-preview.svg"
                      />
                    </div>
                  )}
                </div>
              )}

              {verification?.applicant?.applicantType === "LLP" && (
                <div className="row gy-3 justify-content-between align-items-center py-md-3 w-100">
                  <div className="d-flex align-items-center justify-content-start gap-2">
                    <div className="text-nowrap fw-semibold fs-5 pb-1 ">
                      Limited liability partnership (LLP) :
                    </div>
                  </div>
                  <div className="col-md-6">
                    <DocUploader
                      id="llpAgreement"
                      title="LLP Agreement"
                      documentType="BUSINESS_LLP_AGREEMENT"
                      document={llpAgreement}
                      setDocument={setLlpAgreement}
                      mandatory
                      verificationId={verification?._id}
                      getVerification={getVerification}
                      updateURL="user/updateLLPAgreementDocument"
                      documentPreview="/svgs/aadhar-preview.svg"
                    />
                  </div>
                  <div className="col-md-6">
                    <DocUploader
                      id="llpCOI"
                      title="Certificate of Incorporation"
                      documentType="BUSINESS_LLP_COI"
                      document={llpCOI}
                      setDocument={setLlpCOI}
                      mandatory
                      verificationId={verification?._id}
                      getVerification={getVerification}
                      updateURL="user/updateLLPCOIDocument"
                      documentPreview="/svgs/aadhar-preview.svg"
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-start gap-2 mt-5">
                    <div className="text-nowrap">Optional Documents:</div>
                    <select
                      onChange={(e) => setLLPDocType(e.target.value)}
                      value={LLPDocType}
                      className="form-select w-auto"
                    >
                      <option value="">Select</option>
                      <option value="PAN">PAN</option>
                      <option value="GST">GST</option>
                    </select>
                  </div>
                  {LLPDocType && (
                    <div className="col-md-6 ">
                      <DocUploader
                        id={LLPDocType}
                        title={LLPDocType}
                        documentType={"BUSINESS_LLP_OP_" + LLPDocType}
                        document={LLPDoc}
                        setDocument={setLLPDoc}
                        optional
                        verificationId={verification?._id}
                        getVerification={getVerification}
                        updateURL="user/updateLLPOptionalDocument"
                        documentPreview="/svgs/aadhar-preview.svg"
                      />
                    </div>
                  )}
                </div>
              )}

              {verification?.applicant?.applicantType === "pvt-ltd" && (
                <div className="row gy-3 justify-content-between align-items-center py-md-3 w-100">
                  <div className="d-flex align-items-center justify-content-start gap-2">
                    <div className="text-nowrap fw-semibold fs-5 pb-1 ">
                      Private Limited Company:
                    </div>
                  </div>
                  <div className="col-md-6">
                    <DocUploader
                      id="privateCOI"
                      title="Certificate of Incorporation (COI)"
                      documentType="BUSINESS_PRIVATE_COI"
                      document={pvtCOI}
                      setDocument={setPvtCOI}
                      mandatory
                      verificationId={verification?._id}
                      getVerification={getVerification}
                      updateURL="user/updatePrivateCOIDocument"
                      documentPreview="/svgs/aadhar-preview.svg"
                    />
                  </div>
                  <div className="col-md-6">
                    <DocUploader
                      id="privateMOA"
                      title="MOA & AOA"
                      documentType="BUSINESS_PRIVATE_MOA"
                      document={pvtMOA}
                      setDocument={setPvtMOA}
                      mandatory
                      verificationId={verification?._id}
                      getVerification={getVerification}
                      updateURL="user/updatePrivateMOADocument"
                      documentPreview="/svgs/aadhar-preview.svg"
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-start gap-2 mt-5">
                    <div className="text-nowrap">Optional Documents:</div>
                    <select
                      onChange={(e) => setPvtLtdDocType(e.target.value)}
                      value={pvtLtdDocType}
                      className="form-select w-auto"
                    >
                      <option value="">Select</option>
                      <option value="GST">GST</option>
                      <option value="PAN">PAN</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    {pvtLtdDocType && (
                      <DocUploader
                        id={pvtLtdDocType}
                        title={pvtLtdDocType}
                        documentType={"BUSINESS_PRIVATE_OP_" + pvtLtdDocType}
                        document={pvtLtdDoc}
                        setDocument={setPvtLtdDoc}
                        optional
                        verificationId={verification?._id}
                        getVerification={getVerification}
                        updateURL="user/updatePrivateOptionalDocument"
                        documentPreview="/svgs/aadhar-preview.svg"
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {subStep === 2 && (
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
                        console.log(bankDocument.length);
                        {
                          bankDocument.length;
                        }
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
                      {bankDocument?.length < 1 ? (
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
                            <button
                              disabled={loading}
                              className="btn btn-lg btn-outline-dark"
                              onClick={async () => {
                                try {
                                  setLoading(true);
                                  const formData = new FormData();
                                  formData.append(
                                    "verificationId",
                                    verification?._id
                                  );
                                  const response = await APITemplate(
                                    "user/deleteAllBankDocuments",
                                    "POST",
                                    formData
                                  );
                                  if (response.success == true) {
                                    setBankDocument([]);
                                  }
                                } catch (error) {
                                  // enqueueSnackbar(error.message, {
                                  //   variant: "error",
                                  // });
                                }
                                setLoading(false);
                              }}
                              htmlFor={"image"}
                            >
                              <i className="fa fa-recycle"></i>
                              Re-upload Document
                            </button>
                            <label
                              htmlFor={"image"}
                              className={`btn btn-lg btn-primary ${
                                bankDocument?.length >= 5 || loading
                                  ? "disabled"
                                  : ""
                              }`}
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
                                  Add More
                                </>
                              )}
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
                          formData.append("verificationId", verification?._id);

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

          <div className="d-flex flex-column gap-4 pt-4 w-100">
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
                // if (documentFrontSide == "" || documentBackSide == "") {
                //   setErrors(["document"]);
                //   return;
                // }
                setSubStep(subStep == 1 && 2);
                if (subStep === 2) {
                  setStep("personalInfo");
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

export default UploadBusinessDocs;
