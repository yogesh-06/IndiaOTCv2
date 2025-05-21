"use client";
import { APITemplate } from "@/component/API/Template";
import { useLoader } from "@/context/LoaderProvider";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

export default function Dashboard() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [qrCode, setQrCode] = useState();
  const [loading2fa, setLoading2fa] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = async () => {
    setLoading2fa(true);
    const response2 = await APITemplate("user/Enable2FA", "POST");
    setQrCode(response2?.data?.qrCodeUrl);
    setShow("open");
    setLoading2fa(false);
  };
  const handleDisable2fa = async () => {
    setLoading2fa(true);
    const response2 = await APITemplate("user/Disable2FA", "POST");
    setLoading2fa(false);
    if (response2.success == true) {
      window.location.reload();
    } else {
      enqueueSnackbar(
        response2.message,
        { variant: "error" },
        { autoHideDuration: 500 }
      );
    }
  };

  const [MFA, setMFA] = useState("");

  const handleClose = () => {
    setShow("none");
    window.location.reload();
  };
  const [loading, setLoading] = useState();
  // const { loader, setLoader } = useLoader();
  // useEffect(() => {
  //   setLoader(true);
  //   if (user && user?._id) {
  //     setLoader(false);
  //   }
  // }, [user]);

  const handle2fa = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", user?._id);
      formData.append("token", MFA);
      const response = await APITemplate("user/Verify2fa", "POST", formData);
      // console.log(response);
      if (response.success == true) {
        setLoading(false);
        enqueueSnackbar(
          "Login Successful",
          { variant: "success" },
          { autoHideDuration: 500 }
        );
        setTimeout(() => {
          handleClose();
        }, 500);
      } else {
        setLoading(false);
        enqueueSnackbar(
          response.message,
          { variant: "error" },
          { autoHideDuration: 500 }
        );
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      enqueueSnackbar(
        error.response?.data?.message || error.message,
        { variant: "error" },
        { autoHideDuration: 500 }
      );
    }
  };

  const MediumRiskReVerification = async () => {
    setLoading(true);
    if (user?.riskLevel === "medium") {
      try {
        const response = await APITemplate(
          `user/mediumRiskReVerification`,
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
    } else if (user?.documentStatus == "rejected") {
      try {
        const response = await APITemplate(
          `user/documentReVerification`,
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
    <div className="">
      <div className="container-fluid">
        <div className="d-flex flex-column gap-4 ">
          <h2 className="">Dashboard</h2>
          <div className="d-flex align-items-center p-3 gap-96">
            <div className="d-flex align-items-center gap-3">
              <img
                src="/images/userPlaceholder.png"
                alt="User"
                className="rounded-2 object-fit-cover border"
                width="80"
                height="80"
              />

              <div className="d-flex flex-column gap-1">
                <h4 className="fw-bold ">
                  {user?.firstName
                    ? user?.firstName + " " + user?.lastName
                    : "--"}
                </h4>
                <div className="fs-5">
                  {user?.status === "active" ? (
                    <span className="badge bg-success">Verified</span>
                  ) : user?.status === "pending" &&
                    user?.riskLevel != "medium" &&
                    user?.status != "high" ? (
                    <span className="badge bg-warning">In-Progress</span>
                  ) : user?.status === "inactive" ? (
                    <span className="badge bg-danger">Rejected</span>
                  ) : (
                    <span className="badge bg-seondary">N/A</span>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex flex-column gap-1">
              <span className="text-secondary">UID</span>
              <p className="me-4 mb-0 text-muted">
                <strong>{user?.applicantId}</strong>
              </p>
            </div>

            <div className="d-flex flex-column gap-1">
              <span className="text-secondary">Risk Level</span>
              <div className="fs-5">
                {user?.riskLevel === "low" ? (
                  <span className="badge bg-success">Low</span>
                ) : user?.riskLevel === "medium" ? (
                  <span className="badge bg-warning">Medium</span>
                ) : user?.riskLevel === "high" ? (
                  <span className="badge bg-danger">High</span>
                ) : (
                  <span className="badge bg-secondary">N/A</span>
                )}
              </div>
            </div>
            <div className="d-flex flex-column gap-1">
              <span className="text-secondary">Trade Volume</span>
              <p className="mb-0 fs-5 text-muted">
                <strong>&euro; 234.68 </strong>
              </p>
            </div>
          </div>
          <span className="border border-1 border-top border-dark opacity-25 w-100"></span>
          <div className="">
            <div className="row justify-content-start g-4">
              {(user?.riskLevel === "high" || user?.riskLevel === "medium") && (
                <div className="col-md-6">
                  <div
                    className={`d-flex flex-column gap-3  p-4 rounded-2 bg-light border-danger border`}
                  >
                    <h5>High Risk Client</h5>

                    <div className="d-flex ">
                      <span className="border border-1 border-top border-danger w-100"></span>
                    </div>

                    <h4>Your Account has been Declined</h4>
                    <p className="text-secondary">
                      Your account has been suspended as of our policies, please
                      contact our support team
                    </p>
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
                  </div>
                </div>
              )}

              {(user?.enhanceVerification == "processing" ||
                user?.enhanceVerification == "rejected") && (
                <div className="col-md-5">
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

              {user?.riskLevel != "high" && (
                <>
                  <div className="col-md-3">
                    <div className="card border h-100">
                      <div
                        className="card-body d-flex flex-column justify-content-between"
                        style={{ height: "200px" }}
                      >
                        <div className="d-flex flex-column gap-2">
                          <h6 className="fw-bold">Trading Rewards</h6>
                          <p className="text-muted small">
                            Earn additional rewards for your trades.
                          </p>
                        </div>
                        <button className="btn btn-warning btn-sm mt-auto">
                          Trade
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    {user?.enable2fa ? (
                      <button
                        className="btn btn-danger"
                        disabled={loading2fa}
                        onClick={handleDisable2fa}
                      >
                        {loading2fa && (
                          <div
                            className="spinner-border spinner-border-sm ms-2 "
                            role="status"
                            aria-hidden="true"
                          ></div>
                        )}
                        <div>Disable 2FA</div>
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        disabled={loading2fa}
                        onClick={handleShow}
                      >
                        {loading2fa && (
                          <div
                            className="spinner-border spinner-border-sm ms-2 "
                            role="status"
                            aria-hidden="true"
                          ></div>
                        )}
                        <div>Enable 2FA</div>
                      </button>
                    )}
                    <Modal
                      id="statusSuccessModal"
                      show={show == "open"}
                      onHide={handleClose}
                    >
                      <Modal.Body className="modal-body">
                        <div className="p-4">
                          <h3 className="text-primary text-center mt-3">
                            Configure 2FA
                          </h3>
                          <div className="mt-4 fs-6 text-center gap-2">
                            <div>
                              Scan the QR code from your authenticator app, such
                              as Google Authenticator, Microsoft Authenticator,
                              or 1Password
                            </div>
                            <img
                              src={qrCode}
                              className="img-fluid mt-4"
                              width={200}
                              alt=""
                            />
                          </div>
                          <div className="mt-5 fs-5 text-center gap-2">
                            <div>
                              Enter verification code from your authenticator
                              app
                            </div>
                            <input
                              onChange={(e) => setMFA(e.target.value)}
                              value={MFA}
                              type="text"
                              className="form-control text-center mt-2"
                              placeholder="XXX XXX"
                            />
                          </div>
                          <div className="text-center mt-4">
                            <button
                              className="btn btn-warning w-100"
                              disabled={loading}
                              onClick={handle2fa}
                            >
                              <div>
                                <div>Verify</div>
                                {loading && (
                                  <div
                                    className="spinner-border spinner-border-sm ms-2 "
                                    role="status"
                                    aria-hidden="true"
                                  ></div>
                                )}
                              </div>
                            </button>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
