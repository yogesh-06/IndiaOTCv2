"use client";
import { APITemplate } from "../API/Template";

const KycReview = ({ title, status, reason, step, setStep }) => {
  const handleReverification = async () => {
    try {
      const response = await APITemplate(`user/SetReVerification`, "GET", {});
      if (response.success) {
        status === "rejected" && setStep(step);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error uploading questionaries:", error);
    }
  };

  return (
    <div
      className={`${
        status == "rejected" ? "bg-danger border-danger py-2" : "bg-light py-3"
      }  rounded-3 border px-md-4 px-2  d-flex justify-content-between align-items-center w-100`}
    >
      <div className={`${status == "rejected" ? "text-white" : "text-dark"} `}>
        <h6 className="fw-bold m-0">{title}</h6>
        {status == "rejected" && reason !== "" && (
          <p className="fw-semibold small mt-1">
            <i className="fa-solid fa-circle-exclamation me-1"></i>
            {reason}
          </p>
        )}
      </div>
      <div
        className={`fw-medium px-3 py-2 gap-1 d-flex align-items-center text-capitalize ${
          status == "rejected"
            ? "btn btn-sm bg-white text-danger fw-semibold small"
            : status == "pending"
            ? "badge bg-warning text-dark py-1"
            : "badge bg-success py-1"
        }`}
        // onClick={() => status === "rejected" && setStep(step)}
        onClick={handleReverification}
      >
        {status == "pending" ? (
          <i className="fa-regular fa-clock me-1"></i>
        ) : status == "approved" ? (
          <i className="fa-regular fa-circle-check me-1"></i>
        ) : (
          ""
        )}
        {status === "rejected" ? "Re-verify" : status}
      </div>
    </div>
  );
};

export default KycReview;
