"use client";
import React, { useEffect } from "react";
import KycReview from "./KycReview";

const Completed = ({ setStep, verification }) => {
  // console.log(verification);

  return (
    <>
      <div className={`row align-items-start justify-content-center w-100`}>
        <div className="col-md-6 rounded-5 bg-white shadow-lg px-md-4 px-3 py-4 mb-5 ">
          <div className="d-flex flex-column align-items-center gap-3 p-md-2 pt-0 w-100">
            <div className="d-flex flex-column gap-2 w-100 p-3 ps-0">
              {/* <h4 className="fw-bold text-center">Application Under Review</h4> */}
              <h4 className="fw-bold text-center">Application submitted</h4>
              <p className="text-center text-muted">
                Your application has been submitted. We'll review and get back
                within 1 working day.
                {/* Your application has been submitted and is under review. You
                will be contacted if any additional documents are required. You
                will be notified via the contact details you have provided
                within 1 working day. */}
              </p>
              <div className="arrow-line mt-2" />
            </div>
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

            {/* {verification?.verifications?.document && ( */}
            <div className="w-100 mt-5">
              <h5 className="fw-bold mb-4 text-center text-dark">Need Help?</h5>

              <div className="d-flex flex-column flex-md-row justify-content-center align-items-stretch gap-4 px-3">
                {/* Telegram Support Card */}
                <a
                  href="https://t.me/Indiacrypto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="support-link text-decoration-none"
                >
                  <div className="support-card border rounded-4 p-4 d-flex flex-column align-items-center shadow-sm">
                    <i className="fab fa-telegram-plane fa-2x mb-3 text-primary"></i>
                    <h6 className="fw-semibold text-dark mb-1">Telegram</h6>
                    <span className="text-muted">@Indiacrypto</span>
                  </div>
                </a>

                {/* WhatsApp Support Card */}
                <a
                  href="https://wa.me/917993056397"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="support-link text-decoration-none"
                >
                  <div className="support-card border rounded-4 p-4 d-flex flex-column align-items-center shadow-sm">
                    <i className="fab fa-whatsapp fa-2x mb-3 text-success"></i>
                    <h6 className="fw-semibold text-dark mb-1">WhatsApp</h6>
                    <span className="text-muted">7993056397</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Completed;
