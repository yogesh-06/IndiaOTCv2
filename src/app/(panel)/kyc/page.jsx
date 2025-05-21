"use client";
import { APITemplate } from "@/component/API/Template";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

export default function KYC() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState();

  const ApplyReVerification = async () => {
    setLoading(true);
    if (
      user?.documentStatus == "rejected" ||
      user?.facialStatus == "rejected" ||
      user?.kycStatus == "rejected"
    ) {
      try {
        const response = await APITemplate(
          `user/setReVerification?id=${user?.latestVerificationId}`,
          "GET"
        );
        if (response.success == true) {
          window.location.href = "/kyc/verification";
        } else {
          enqueueSnackbar(
            response.message,
            { variant: "error" },
            { autoHideDuration: 500 }
          );
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar(
          error.response?.data?.message || error.message,
          { variant: "error" },
          { autoHideDuration: 500 }
        );
      }
    }
    setLoading(false);
  };
  return (
    <div className=" ">
      <div className="container-fluid">
        <div className="d-flex flex-column gap-4 p-3 ">
          <h2 className="">Identification</h2>
          <span className="border border-1 border-top border-secondary w-100"></span>
          <div className="row align-items-start justify-content-between gap-4">
            <div className="col-md-7">
              <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-column gap-3 p-4 rounded-2 Gray_100">
                  {user?.riskLevel == "high" || user?.riskLevel == "medium" ? (
                    <>
                      <div className="d-flex gap-3 align-items-center">
                        <h5 className="my-0">Account Suspended</h5>
                        <div className="badge bg-danger ">Rejected</div>
                      </div>
                      <div className=" fw-light">
                        <p className="">
                          Account has been Declined due to below reasons :
                        </p>
                        <ul className="pt-1">
                          <li>
                            Your KYC is not acceptable as per our policy
                            requirements
                          </li>
                          <li>
                            According to the provided information, you may have
                            been included in an illegal or suspicious activity
                          </li>
                        </ul>
                      </div>
                    </>
                  ) : user?.documentStatus == "rejected" ||
                    user?.kycStatus == "rejected" ||
                    user?.facialStatus == "rejected" ? (
                    <div>
                      <h5>Re-Verification Required</h5>
                      <div className=" fw-light">
                        <p className="">
                          Your verification has been rejected due to below
                          reasons :
                        </p>
                        <ul className="pt-1">
                          {user?.rejectedComments?.map((reason, index) => (
                            <li key={index}>
                              <b>{reason.type} : </b>
                              {reason.comment}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        className="btn btn-danger"
                        disabled={loading}
                        onClick={ApplyReVerification}
                      >
                        {loading && (
                          <div
                            className="spinner-border spinner-border-sm ms-2 "
                            role="status"
                            aria-hidden="true"
                          ></div>
                        )}
                        Apply for Re-Verification
                      </button>
                    </div>
                  ) : user?.documentStatus == "pending" ||
                    user?.kycStatus == "pending" ||
                    user?.facialStatus == "pending" ? (
                    <>
                      <h5>Complete KYC Verification </h5>
                      <div className="text-secondary fw-normal">
                        <p className="">Required:</p>
                        <ul className="pt-1">
                          <li>Personal information</li>
                          <li>Government-issued ID</li>
                          <li>Address proof</li>
                        </ul>
                      </div>
                      <div>
                        <button
                          className="btn btn-warning"
                          onClick={() => {
                            window.location.href = "/kyc/verification";
                          }}
                        >
                          Continue Verification
                        </button>
                      </div>
                    </>
                  ) : user?.documentStatus == "approved" &&
                    user?.kycStatus == "approved" &&
                    user?.facialStatus == "approved" ? (
                    <div className="d-flex gap-3 align-items-center">
                      <h5 className="my-0">KYC Completed</h5>
                      <div className="badge bg-success ">Verified</div>
                    </div>
                  ) : user?.documentStatus == "processing" ||
                    user?.kycStatus == "processing" ||
                    user?.facialStatus == "processing" ? (
                    <div className="d-flex gap-3 align-items-center">
                      <h5>Verification Under Review</h5>
                      <div className="badge bg-primary">Processing</div>
                    </div>
                  ) : (
                    <div className="d-flex gap-3 align-items-center">
                      <h5>Waiting...</h5>
                      <div className="badge bg-warning ">Pending</div>
                    </div>
                  )}
                </div>
                {(user?.enhanceVerification == "processing" ||
                  user?.enhanceVerification == "rejected") && (
                  <div className="">
                    <div
                      className={`d-flex flex-column gap-3  p-4 rounded-2 bg-light border-warning border`}
                    >
                      <h5>Enhance Verification Required</h5>

                      <div className="d-flex ">
                        <span className="border border-1 border-top border-warning w-100"></span>
                      </div>

                      <div className="fs-6 fw-bold">
                        You have reached your transaction limits, for smooth
                        transactions above limits, we require you to verify your
                        further documents
                      </div>

                      <div className="fw-light">
                        <p className="">Required:</p>
                        <ul className="pt-2">
                          <li>Tax ID</li>
                          <li>Source of funds</li>
                        </ul>
                      </div>

                      <button
                        className="btn btn-warning"
                        onClick={() => {
                          window.location.href = "/kyc/enhanceVerification";
                        }}
                      >
                        Continue Verification
                      </button>
                      {/* <p className="text-warning fw-medium pt-2">
                    How to verify my identity ? </p> */}
                    </div>
                  </div>
                )}
                <div className="d-flex py-3">
                  <span className="border border-1 border-top border-secondary w-100"></span>
                </div>

                <div className="d-flex flex-column gap-1">
                  <p className="h5 mb-4">Account Limits</p>
                  <div className="d-flex align-items-center gap-3 text-secondary mb-3">
                    <i className="fa-solid fa-lock fs-6"></i>
                    <p className="mb-0">Fiat Deposite and Withdrawal limits</p>
                  </div>
                  <div className="d-flex align-items-center gap-3 text-secondary mb-3">
                    <i className="fa-solid fa-lock fs-6"></i>
                    <p className="mb-0">Crypto Deposite limits</p>
                  </div>
                  <div className="d-flex align-items-center gap-3 text-secondary mb-3">
                    <i className="fa-solid fa-lock fs-6"></i>
                    <p className="mb-0">Crypto Withdrawal limits</p>
                  </div>
                  <div className="d-flex align-items-center gap-3 text-secondary mb-3">
                    <i className="fa-solid fa-lock fs-6"></i>
                    <p className="mb-0">P2P Transaction limits</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex flex-column gap-1">
                <div className="container">
                  <h4 className="mb-4">Verification Levels</h4>
                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <div className="d-flex position-relative mb-4">
                          <div className="position-absolute start-0 top-0">
                            <div
                              className="rounded-circle border border-3 border-secondary"
                              style={{
                                width: "30px",
                                height: "30px",
                                position: "relative",
                              }}
                            >
                              <i className="fa-solid fa-circle-check fs-4"></i>
                            </div>
                            {/* Line */}
                            <div
                              className="d-none d-md-block bg-secondary"
                              style={{
                                width: "2px",
                                height: "80px",
                                marginLeft: "14px",
                                marginTop: "0px",
                              }}
                            ></div>
                          </div>

                          {/* Text */}
                          <div className="ms-5 d-flex flex-column gap-1">
                            <h6 className="text-secondary mb-0 fw-semibold">
                              Daily
                            </h6>
                            <h6 className=" fw-medium">
                              Fiat Limit of €15,000 Daily
                            </h6>
                            <p className="text-secondary">
                              Without enhanced verification
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="col-12">
                        <div className="d-flex position-relative mb-4">
                          {/* Circle */}
                          <div className="position-absolute start-0 top-0">
                            <div
                              className="rounded-circle border border-3 border-secondary"
                              style={{
                                width: "30px",
                                height: "30px",
                                position: "relative",
                              }}
                            >
                              <i className="fa-solid fa-circle-check fs-4"></i>
                            </div>
                            {/* Line */}
                            <div
                              className="d-none d-md-block bg-secondary"
                              style={{
                                width: "2px",
                                height: "80px",
                                marginLeft: "14px",
                                marginTop: "0px",
                              }}
                            ></div>
                          </div>

                          {/* Text */}
                          <div className="ms-5 d-flex flex-column gap-1">
                            <h6 className="text-secondary mb-0 fw-semibold">
                              Monthly
                            </h6>
                            <h6 className=" fw-medium">Limit €15,000</h6>
                            <p className="text-secondary">
                              Without enhanced verification
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="col-12">
                        <div className="d-flex position-relative mb-4">
                          {/* Circle */}
                          <div className="position-absolute start-0 top-0">
                            <div
                              className="rounded-circle border border-3 border-secondary"
                              style={{
                                width: "30px",
                                height: "30px",
                                position: "relative",
                              }}
                            >
                              <i className="fa-solid fa-circle-check fs-4"></i>
                            </div>
                            <div
                              className="d-none d-md-block bg-secondary"
                              style={{
                                width: "2px",
                                height: "60px",
                                marginLeft: "14px",
                                marginTop: "0px",
                              }}
                            ></div>
                          </div>

                          {/* Text */}
                          <div className="ms-5 d-flex flex-column gap-1 mb-4">
                            <h6 className="text-secondary mb-0 fw-semibold">
                              Yearly
                            </h6>
                            <h6 className=" fw-medium">Limit €15,000</h6>
                            <p className="text-secondary">
                              Without enhanced verification
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex py-3">
                    <span className="border border-1 border-top border-secondary w-100"></span>
                  </div>
                  <div className="px-2">
                    <h3>FAQ</h3>
                    <Link
                      href="/contact"
                      target="_blank"
                      className="text-secondary text-decoration-underline mt-1"
                    >
                      Identity Verification
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
