"use client";
import React, { useState } from "react";
import TakePhoto from "./TakePhoto";
import { APITemplate } from "./API/Template";

const DocUploader = ({
  id,
  title,
  document,
  setDocument,
  documentType = "",
  documentPreview,
  getVerification,
  verificationId,
  updateURL,
}) => {
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [showPhotoCaptureModal, setPhotoCaptureModal] = useState("none");

  const handleCapturedPhoto = async (binaryData, image) => {
    setPhotoLoading(true);
    const formData = new FormData();
    const blob = new Blob([binaryData], { type: "image/png" });
    const extractDocType =
      documentType === "PANCARD" ? "Pan Card" : "Aadhaar Card";

    formData.append("document", blob);
    formData.append("verificationId", verificationId);
    formData.append("documentExtractType", extractDocType);
    formData.append("type", documentType);

    try {
      // Send the image file to the server via an API endpoint
      const response = await APITemplate(updateURL, "POST", formData);
      if (response.success == true) {
        getVerification(verificationId);
        setDocument(response.data.image);
      }
    } catch (error) {
      setPhotoLoading(false);
      // enqueueSnackbar(error.message, {
      //   variant: "error",
      // });
    }
    setPhotoLoading(false);
  };

  const handlePhotoCaptureModal = async () => {
    setPhotoCaptureModal("open");
  };

  const handleDocumentUpload = async (e) => {
    setLoading(true);
    const formData = new FormData();
    const extractDocType =
      documentType === "PANCARD" ? "Pan Card" : "Aadhaar Card";

    formData.append("document", e.target.files[0]);
    formData.append("type", documentType);
    formData.append("documentExtractType", extractDocType);
    formData.append("verificationId", verificationId);

    try {
      // Send the image file to the server via an API endpoint
      const response = await APITemplate(updateURL, "POST", formData);
      if (response.success == true) {
        console.log(response?.data?.image, response);
        setDocument(response?.data?.image);
        getVerification(verificationId);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      // enqueueSnackbar(error.message, {
      //   variant: "error",
      // });
    }
    setLoading(false);
  };

  return (
    <div className="d-flex flex-column align-items-start">
      <TakePhoto
        isOpen={showPhotoCaptureModal}
        onClose={() => setPhotoCaptureModal("none")}
        onPhotoSubmit={handleCapturedPhoto}
      />
      <div className="d-flex flex-column gap-4 p-2 ps-0 w-100">
        <h6 className="fw-semibold m-0 text-center">{title}</h6>
      </div>

      <div className="w-100 d-flex flex-column align-items-md-start align-items-center gap-2">
        <div className="bg-light rounded-2 p-3 w-100">
          <img
            src={!document || document == "" ? documentPreview : document}
            className="img-fluid"
            style={{
              minHeight: "165px",
              maxHeight: "170px",
              width: "100%",
            }}
            alt=""
          />
        </div>
        <div className="d-flex gap-4">
          <div className="d-flex flex-column align-items-center align-items-md-start gap-3">
            <label
              htmlFor={id}
              className="cursor-pointer ps-1"
              // onClick={() => {
              //   setDocument("");
              // }}
            >
              {loading ? (
                <div className="d-flex align-items-center">
                  <div
                    className="spinner-border"
                    role="status"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                  <span className="ms-2">Loading...</span>
                </div>
              ) : !document ? (
                <div className="d-flex justify-content-start align-items-center text_Primary_500">
                  <div>
                    <span className="border_primary border border-2 rounded-circle me-2">
                      <i className="fa fa-plus fa-sm p-1"></i>
                    </span>
                  </div>
                  <p className="text-decoration-underline link-offset-3 fs-6">
                    Upload Document
                  </p>
                </div>
              ) : (
                <div className="d-flex justify-content-start align-items-center text-success">
                  <div>
                    <i className="fa-solid fa-repeat me-2"></i>
                  </div>
                  <p className="text-decoration-underline link-offset-3 fs-6">
                    Re-Upload Document
                  </p>
                </div>
              )}
            </label>

            <label htmlFor={"capture"} className="cursor-pointer ms-1">
              {photoLoading ? (
                <div className="d-flex align-items-center">
                  <div
                    className="spinner-border "
                    role="status"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                  <span className="ms-2">Loading...</span>
                </div>
              ) : (
                <div
                  className="d-flex justify-content-start align-items-center text_Primary_500"
                  onClick={() => handlePhotoCaptureModal()}
                >
                  <div>
                    <i className="fa-solid fa-camera fa-lg me-2"></i>
                  </div>
                  <p className="text-decoration-underline link-offset-3 fs-6">
                    Take A Photo
                  </p>
                </div>
              )}
            </label>
          </div>
          <input
            type="file"
            accept="image/bmp,image/gif,image/heif,image/heic,image/jpeg,image/png,image/jpg"
            id={id}
            name={id}
            className="form-control d-none"
            onChange={handleDocumentUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default DocUploader;
