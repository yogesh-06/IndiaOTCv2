"use client";
import Link from "next/link";
import React, { useState } from "react";
import TakePhoto from "../TakePhoto";
import { APITemplate } from "../API/Template";

const LivenessVerification = ({ setStep, verification, getVerification }) => {
  const [loading, setLoading] = useState(false);
  const [showPhotoCaptureModal, setPhotoCaptureModal] = useState("none");
  const [continueWithPhone, setContinueWithPhone] = useState(false);
  const [selfie, setSelfie] = useState("");
  const handlePhotoCaptureModal = async () => {
    setPhotoCaptureModal("open");
  };

  const handleSelfieUpload = async (binaryData, image) => {
    setLoading(true);
    const formData = new FormData();
    const blob = new Blob([binaryData], { type: "image/png" });

    formData.append("image", blob);
    formData.append("verificationId", verification?._id);

    try {
      const response = await APITemplate(
        "user/updateSelfieVerification",
        "POST",
        formData
      );
      if (response.success == true) {
        await getVerification(verification?._id);
        setSelfie(response?.data?.image);
        setTimeout(() => {
          // setStep("completed");
        }, 500);
      } else {
        console.log(response.message);

        // enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  const handleSelfieError = async (err) => {
    stopWebcam();
    console.error("Error accessing webcam: ", err);
    setCameraOn(false);

    const formData = new FormData();
    // formData.append("email", user?.email);
    const responseLink = await APITemplate(
      "user/genJWTUserToken",
      "POST",
      formData
    );
    if (responseLink.success == true) {
      const localUrl = responseLink.data;
      setQrCodeUrl(localUrl);
    } else {
      enqueueSnackbar(
        responseLink.message,
        { variant: "error" },
        { autoHideDuration: 500 }
      );
    }

    enqueueSnackbar("Error accessing webcam.", {
      variant: "error",
      autoHideDuration: 5000,
    });
  };

  const handleSelfieMobile = async (err) => {
    try {
      setImageSelfieData("");
      const formData = new FormData();
      formData.append("email", user?.email);
      const responseLink = await APITemplate(
        "user/genJWTUserToken",
        "POST",
        formData
      );
      if (responseLink.success == true) {
        const localUrl = responseLink.data;
        setQrCodeUrl(localUrl);
      } else {
        enqueueSnackbar(
          responseLink.message,
          { variant: "error" },
          { autoHideDuration: 500 }
        );
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(
        "Somethng went wrong",
        { variant: "error" },
        { autoHideDuration: 500 }
      );
    }
  };

  return (
    <div
      className={`row align-items-center justify-content-center min-vh-90 w-100`}
    >
      <TakePhoto
        isOpen={showPhotoCaptureModal}
        onClose={() => setPhotoCaptureModal("none")}
        onPhotoSubmit={handleSelfieUpload}
      />
      <div className="col-md-5 rounded-5 bg-white shadow-lg p-4 my-5">
        <div className="d-flex flex-column align-items-start gap-3 px-2 pt-0 w-100">
          <div className="d-flex flex-column gap-3 w-100 p-3">
            <div>
              <button
                className={`btn border_primary text_Primary_500 p-3 mb-2 `}
                style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                onClick={() => setStep("uploadDocument")}
              >
                <i className="fa-solid fa-chevron-left fa-lg"></i>
              </button>
            </div>
            <h4 className="fw-bold">Liveness Verification</h4>
            <div className="arrow-line my-2" />
            <div className="bg-light rounded-2 p-3 pb-0 text-center">
              <p
                className={`small text-muted py-3 ${
                  !continueWithPhone && "d-none"
                }`}
              >
                Scan the QR Code below and continue with phone.
              </p>
              <img
                src={
                  !continueWithPhone
                    ? selfie || "/svgs/selfie-preview.svg"
                    : "/svgs/qr-preview.svg"
                }
                alt=""
                className="img-fluid"
              />
            </div>

            {!continueWithPhone ? (
              <div className="d-flex flex-column gap-1">
                {!selfie ? (
                  <button
                    className="btn btn-lg fs-6 Primary_500 text-white fw-medium"
                    disabled={loading}
                    onClick={() => handlePhotoCaptureModal()}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center">
                        <span
                          className="spinner-border me-2"
                          role="status"
                          style={{ width: "1.5rem", height: "1.5rem" }}
                        />
                        Loading...
                      </div>
                    ) : (
                      "Take a photo with Holding Document"
                    )}
                  </button>
                ) : (
                  <button
                    className="btn btn-lg fs-6 Primary_500 text-white fw-medium w-100"
                    disabled={loading}
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        setStep("questionaries");
                        setLoading(false);
                      }, 2000);
                    }}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center">
                        <span
                          className="spinner-border me-2"
                          role="status"
                          style={{ width: "1.5rem", height: "1.5rem" }}
                        />
                        Loading...
                      </div>
                    ) : (
                      "Continue"
                    )}
                  </button>
                )}
                <p className="text-center">
                  <small
                    className="text_Primary_500 text-decoration-underline link-offset-3 small fw-semibold cursor-pointer"
                    onClick={() => setContinueWithPhone(true)}
                  >
                    Or continue on your phone
                  </small>
                </p>
              </div>
            ) : (
              <button
                className="btn btn-lg fs-6 Primary_500 text-white fw-medium"
                onClick={() => setContinueWithPhone(false)}
              >
                Take A Selfie
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivenessVerification;
