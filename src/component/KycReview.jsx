"use client";

const KycReview = ({
  title = "ABC",
  status = "pending",
  reason = "Dont know",
}) => {
  return (
    <div className="Secondary_color px-4 py-3 d-flex justify-content-between align-items-center">
      <div>
        <h6>{title}</h6>
        <p>
          <i class="fa-solid fa-circle-info me-2"></i>
          {reason}
        </p>
      </div>
      <div
        className={`${
          status == "reject"
            ? "btn bg-white text-danger"
            : status == "pending"
            ? "badge badge-warning"
            : "badge badge-success"
        }`}
      >
        {status}
      </div>
    </div>
  );
};

export default KycReview;
