"use client";
import React, { useEffect } from "react";
import KycReview from "./KycReview";

const Completed = ({ setStep, verification }) => {
  // console.log(verification);

  return (
    <div className={`row align-items-start justify-content-center w-100`}>
      <div className="col-md-6 rounded-5 bg-white shadow-lg px-md-4 px-3 py-4 mb-5 ">
        <div className="d-flex flex-column align-items-center gap-3 p-md-2 pt-0 w-100">
          <div className="d-flex flex-column gap-2 w-100 p-3 ps-0">
            {/* <div>
              <button
                className={`btn border_primary text_Primary_500 p-3 mb-2 `}
                style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                onClick={() => setStep("declaration")}
              >
                <i className="fa-solid fa-chevron-left fa-lg"></i>
              </button>
            </div> */}
            <h4 className="fw-bold text-center">Application Under Review</h4>
            <p
              className="small text-center fw-light text-muted lh-base pb-1"
              style={{ fontSize: "13px" }}
            >
              Your application has been submitted and is under review. You will
              be contacted if any additional documents are required. You will be
              notified via the contact details you have provided within 1
              working day.
            </p>
            <div className="arrow-line mt-2" />
          </div>
          {/* {verification?.verifications?.document && ( */}
          <KycReview
            title="Email"
            status={"approved"}
            step="register"
            setStep={setStep}
          />
          {/* )} */}
          {verification?.verifications?.profile?.verified && (
            <KycReview
              title="Phone"
              status={"approved"}
              step="initVerification"
              setStep={setStep}
            />
          )}
          {verification?.verifications?.document?.verified && (
            <KycReview
              title="Identification"
              status={verification?.verifications?.document?.verified}
              reason={verification?.verifications?.document?.comment}
              step="uploadDocument"
              setStep={setStep}
            />
          )}
          {verification?.verifications?.questionaries && (
            <KycReview
              title="Questionaries"
              status={verification?.verifications?.questionaries?.verified}
              reason={verification?.verifications?.questionaries?.comment}
              step="questionaries"
              setStep={setStep}
            />
          )}
          {verification?.verifications?.document && (
            <KycReview
              title="Declaration"
              status={"approved"}
              step="declaration"
              setStep={setStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Completed;
