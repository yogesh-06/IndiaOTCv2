"use client";
import { APITemplate } from "@/component/API/Template";
import CustomSelect from "@/component/CustomSelect";
import { getGeoDetails } from "@/component/global";
import { BoxIcon } from "@/component/svgs/icons";
import { useLoader } from "@/context/LoaderProvider";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Link from "next/link";

export default function Verification({ params }) {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [tokenStep, setTokenStep] = useState("loading");
  useEffect(() => {
    const fetchData = async () => {
      const response = await APITemplate(
        "user/getUserByToken/" + params.token,
        "GET"
      );
      if (!response.success) {
        setTokenStep("expiredToken");
        return;
      }
      setTokenStep("healthy");
      setUser(response.data);
    };
    fetchData();
  }, []);

  const [step, setStep] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [country, setCountry] = useState({});
  const [countries, setCountries] = useState([]);
  const [documentType, setDocumentType] = useState("");
  const [document, setDocument] = useState("");
  const [verification, setVerification] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [DOB, setDOB] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [telegramUsername, setTelegramUsername] = useState("");

  useEffect(() => {
    async function getCountries() {
      const geoDetails = await getGeoDetails();
      let countrySet = {
        label: geoDetails?.country,
        value: geoDetails?.countryCode,
      };
      // let countrySet = {
      //   label: "India",
      //   value: "IN",
      // };
      setCountry(countrySet);
      let response = await APITemplate("user/getAllCountries", "GET");
      setCountries(response.data);
    }
    getCountries();
  }, []);

  async function getVerification(id) {
    const response = await APITemplate(
      `user/getLatestVerificationByUser/${id}`,
      "GET"
    );

    if (response.success) {
      setVerification(response.data);
    }
    return response.data;
  }

  useEffect(() => {
    async function initStep() {
      if (user?._id) {
        let verificationResult = {};
        if (user?.lastVerificationId) {
          verificationResult = await getVerification(user?.lastVerificationId);
        }
        if (
          user?.riskLevel == "high" ||
          user?.riskLevel == "medium" ||
          user?.status != "pending" ||
          (user?.documentStatus != "pending" &&
            user?.kycStatus != "pending" &&
            user?.facialStatus != "pending")
        ) {
          router.push("/kyc");
        } else if (
          user?.documentStatus != "pending" ||
          user?.kycStatus != "pending" ||
          user?.facialStatus != "pending"
        ) {
          router.push("/kyc");
        } else if (
          user?.documentStatus == "pending" ||
          user?.kycStatus == "pending" ||
          user?.facialStatus == "pending"
        ) {
          if (user?.nationalityCountry) {
            if (verificationResult?.applicant?.documents?.length > 0) {
              setDocumentType(
                verificationResult?.applicant?.documents[0]?.type
              );
              setDocument(
                verificationResult?.applicant?.documents[0]?.portrait
              );
              if (
                verificationResult?.applicant?.first_name ||
                verificationResult?.applicant?.residence_country
              ) {
                setFirstName(verificationResult?.applicant?.first_name);
                setLastName(verificationResult?.applicant?.last_name);
                setNationality(user?.nationalityCountry);
                setCountry({ value: user?.nationalityCountry });
                setDOB(verificationResult?.applicant?.dob);
                setDocumentNumber(
                  verificationResult?.applicant?.documents[0]?.document_number
                );
                setIssueDate(
                  verificationResult?.applicant?.documents[0]?.issue_date
                );
                setExpiryDate(
                  verificationResult?.applicant?.documents[0]?.expiry_date
                );
                setFullAddress(
                  verificationResult?.applicant?.addresses[0]?.full_address
                );
                if (user?.phone) {
                  setPhoneNumber(user?.phone);
                  setTelegramUsername(user?.telegramUsername);

                  if (
                    verificationResult?.applicant?.documents.find(
                      (item) => item.type == "SELFIE_IMAGE"
                    )
                  ) {
                    setImageSelfieData(
                      verificationResult?.applicant?.documents.find(
                        (item) => item.type == "SELFIE_IMAGE"
                      ).front_side
                    );
                    setStep("completed");
                  } else {
                    setStep("selfie");
                  }
                } else {
                  setStep("identityVerification");
                }
              } else {
                setStep("uploadDocument");
              }
            } else {
              setStep("residenceDocument");
            }
          } else {
            setStep("initVerification");
          }
        } else {
          router.push("/kyc");
        }
      }
    }
    initStep();
  }, [user]);

  const handleNationality = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];
    if (
      !country ||
      country == "" ||
      country == "none" ||
      !country.value ||
      country.value == "" ||
      country.value == "none"
    ) {
      setLoading(false);
      newErrors.push("country");
      setErrors(newErrors);
    }
    if (newErrors.length > 0) return;

    const formData = new FormData();
    formData.append("nationalityCountry", country.value);
    if (verification?._id) {
      formData.append("verificationId", verification?._id);
    }
    try {
      const response = await APITemplate(
        "user/updateNationality",
        "POST",
        formData
      );
      if (response.success == true) {
        // enqueueSnackbar(response.message, { variant: "success" });
        await getVerification(response?.data?.lastVerificationId);
        setTimeout(() => {
          setStep("residenceDocument");
        }, 500);
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  };

  const handleIdentityVerification = async () => {
    setErrors([]);

    setLoading(true);
    const newErrors = [];
    if (!phoneNumber) {
      setLoading(false);
      newErrors.push("phone");
      setErrors(newErrors);
    }
    const regex = /^\+91\d{10}$/;

    if (phoneNumber && !regex.test(phoneNumber)) {
      newErrors.push("phone");
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    if (newErrors.length > 0) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("phone", phoneNumber);
    formData.append("telegramUsername", telegramUsername);
    formData.append("verificationId", verification?._id);

    try {
      const response = await APITemplate(
        "user/updateIdentityVerification",
        "POST",
        formData
      );
      if (response.success == true) {
        // enqueueSnackbar(response.message, { variant: "success" });
        await getVerification(response?.data?.lastVerificationId);
        setTimeout(() => {
          setStep("selfie");
        }, 500);
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  };

  // Selfie Setup
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageSelfieData, setImageSelfieData] = useState(null);
  const [binaryData, setBinaryData] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [stream, setStream] = useState(null);

  const startWebcam = async () => {
    try {
      setCameraOn(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();
    } catch (err) {
      handleSelfieError(err);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop()); // Stop each track
      setStream(null); // Clear the stored stream
    }

    setCameraOn(false); // Update the camera state to indicate it's off
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL("image/png");
    const binaryImageSelfieData = base64ToBinary(base64Image);

    setCameraOn(false);
    setImageSelfieData(base64Image);
    setBinaryData(binaryImageSelfieData);
    stopWebcam(); // Stop the webcam and release the camera system
    setStep("confirmSelfie");
  };

  const base64ToBinary = (base64) => {
    const binaryString = atob(base64.split(",")[1]);
    const binaryLength = binaryString.length;
    const binaryArray = new Uint8Array(binaryLength);

    for (let i = 0; i < binaryLength; i++) {
      binaryArray[i] = binaryString.charCodeAt(i);
    }

    return binaryArray.buffer;
  };

  const handleUploadSelfie = async () => {
    setLoading(true);
    const blob = new Blob([binaryData], { type: "image/png" });

    const formData = new FormData();
    formData.append("image", blob);
    formData.append("verificationId", verification?._id);

    try {
      const response = await APITemplate(
        "user/updateSelfieVerification",
        "POST",
        formData
      );
      if (response.success == true) {
        // enqueueSnackbar(response.message, { variant: "success" });
        await getVerification(user?.lastVerificationId);
        setTimeout(() => {
          setStep("completed");
        }, 500);
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
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

    enqueueSnackbar("Error accessing webcam.", {
      variant: "error",
      autoHideDuration: 5000,
    });
  };
  const handleSelfieMobile = (err) => {
    setImageSelfieData("");
    const localUrl = window.location.href;
    setQrCodeUrl(localUrl);
  };

  const handleDocumentData = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];
    if (!firstName) {
      newErrors.push("firstName");
      setErrors(newErrors);
    }
    if (!lastName) {
      newErrors.push("lastName");
      setErrors(newErrors);
    }
    const regex = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!DOB || regex.test(DOB) == false) {
      newErrors.push("DOB");
      setErrors(newErrors);
    }
    if (!documentNumber) {
      newErrors.push("documentNumber");
      setErrors(newErrors);
    }
    if (!issueDate) {
      newErrors.push("issueDate");
      setErrors(newErrors);
    }
    if (!expiryDate) {
      newErrors.push("expiryDate");
      setErrors(newErrors);
    }
    if (!fullAddress) {
      newErrors.push("fullAddress");
      setErrors(newErrors);
    }

    if (newErrors.length > 0) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("dob", DOB);
    formData.append("document_number", documentNumber);
    formData.append("issue_date", issueDate);
    formData.append("expiry_date", expiryDate);
    formData.append("full_address", fullAddress);
    formData.append("verificationId", verification?._id);
    try {
      const response = await APITemplate(
        "user/updateDocumentData",
        "POST",
        formData
      );
      if (response.success == true) {
        await getVerification(user?.lastVerificationId);
        setStep("identityVerification");
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  return (
    <>
      {tokenStep == "loading" ? (
        <div className="vh-100 d-flex align-items-center justify-content-center vw-100 bg-white">
          <h2>
            <span className="spinner-border text_Primary_500 me-3"></span>
            Loading ...
          </h2>
        </div>
      ) : tokenStep == "healthy" ? (
        <div className="">
          {step == "initVerification" ? (
            <div
              className={`d-flex align-items-center  justify-content-center  min-vh-100 `}
            >
              <div
                className="rounded-4 shadow-lg py-3 px-4 my-5 "
                style={{ border: "1px solid #373737" }}
              >
                <div className="d-flex flex-column align-items-start gap-4  p-3">
                  <div className="d-flex flex-column gap-2">
                    <h1 className="fw-semibold">Let's get you verified</h1>
                    <h5 className="fw-light text-secondary p-1">
                      Select your nationality and follow the steps.
                    </h5>
                  </div>

                  <div className="w-100 d-flex flex-column gap-4">
                    <div className="form-group">
                      <label className="fs-6 text-nowrap">
                        {errors.includes("country") ? (
                          <span className="text-danger">
                            Please select a country
                          </span>
                        ) : (
                          "Nationality"
                        )}
                      </label>
                      <div
                        className={`d-flex align-items-center gap-2 mt-2 ${
                          step == "initVerification" ? "" : "d-none"
                        }`}
                      >
                        <CustomSelect
                          onChange={(e) =>
                            setCountry({
                              label:
                                e.target.options[e.target.selectedIndex].text,
                              value: e.target.value,
                            })
                          }
                          value={country.value}
                          label="Country"
                          data={countries.map((country) => {
                            return {
                              label: country.label,
                              value: country.countryCode,
                            };
                          })}
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-3 p-1 text-secondary">
                      <h5 className="fw-medium ">
                        Complete the following steps to verify your account in{" "}
                      </h5>
                      <div className="d-flex align-items-center gap-3">
                        <i className="fa-regular fa-id-card"></i>
                        <p>Government-issued ID</p>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <i className="fa-regular fa-id-card"></i>
                        <p>Personal Information</p>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <i className="fa-regular fa-user"></i>
                        <p>Liveness check</p>
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={!country}
                    className="btn btn-lg btn-warning my-2 w-50"
                    onClick={handleNationality}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center">
                        <div
                          className="spinner-border "
                          role="status"
                          style={{ width: "1.5rem", height: "1.5rem" }}
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-2">Loading...</span>
                      </div>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : step == "residenceDocument" ? (
            <div
              className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-100 `}
            >
              <div
                className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
                style={{ border: "1px solid #373737" }}
              >
                <div>
                  <button
                    onClick={() => setStep("initVerification")}
                    className="btn btn-outline-dark"
                  >
                    <i className="fa fa-arrow-left"></i>
                  </button>
                </div>
                <div className="d-flex flex-column align-items-start gap-3 p-3">
                  <div className="d-flex w-100 gap-4 p-3">
                    <div className="d-flex flex-column gap-2 text-center w-100">
                      <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                        Step 1 / 5
                      </h5>
                      <h3 className="fw-semibold">Select Document</h3>
                    </div>
                  </div>

                  <div className="w-100 d-flex flex-column gap-4 pb-4">
                    <div className="row gy-4">
                      <div className="col-md-6">
                        <div
                          className={`dept-box ${
                            documentType == "PASSPORT" && "selected"
                          }`}
                          onClick={() => setDocumentType("PASSPORT")}
                        >
                          <div>
                            <BoxIcon
                              style={{
                                width: "30px",
                                height: "30px",
                              }}
                              className={"box-icon"}
                            />
                          </div>
                          <div className="fs-5">Passport</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div
                          className={`dept-box ${
                            documentType == "GOVERNMENT_ID" && "selected"
                          }`}
                          onClick={() => setDocumentType("GOVERNMENT_ID")}
                        >
                          <div>
                            <BoxIcon
                              style={{
                                width: "30px",
                                height: "30px",
                              }}
                              className={"box-icon"}
                            />
                          </div>
                          <div className="fs-5">Aadhar Card</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div
                          className={`dept-box ${
                            documentType == "DRIVERS_LICENSE" && "selected"
                          }`}
                          onClick={() => setDocumentType("DRIVERS_LICENSE")}
                        >
                          <div>
                            <BoxIcon
                              style={{
                                width: "30px",
                                height: "30px",
                              }}
                              className={"box-icon"}
                            />
                          </div>
                          <div className="fs-5">Driving License</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap justify-content-center align-items-center w-100 gap-4">
                    <div className="flex-fill">
                      <button
                        disabled={!country}
                        className="btn btn-lg btn-warning my-2 w-100"
                        onClick={() => setStep("uploadDocumentinfo")}
                      >
                        {loading ? (
                          <div className="d-flex align-items-center">
                            <div
                              className="spinner-border "
                              role="status"
                              style={{ width: "1.5rem", height: "1.5rem" }}
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <span className="ms-2">Loading...</span>
                          </div>
                        ) : (
                          "Continue"
                        )}
                      </button>
                    </div>
                    {document && (
                      <div className="flex-fill">
                        <button
                          disabled={!country}
                          className="btn btn-lg btn-warning my-2 w-100"
                          onClick={() => {
                            setStep("documentUploaded");
                            setDocumentType(
                              verification?.applicant?.documents[0]?.type
                            );
                          }}
                        >
                          {loading ? (
                            <div className="d-flex align-items-center">
                              <div
                                className="spinner-border "
                                role="status"
                                style={{ width: "1.5rem", height: "1.5rem" }}
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                              <span className="ms-2">Loading...</span>
                            </div>
                          ) : (
                            "Continue with existing data"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : step == "uploadDocumentinfo" ? (
            <div
              className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-100 `}
            >
              <div
                className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
                style={{ border: "1px solid #373737" }}
              >
                <div>
                  <button
                    onClick={() => setStep("residenceDocument")}
                    className="btn btn-outline-dark"
                  >
                    <i className="fa fa-arrow-left"></i>
                  </button>
                </div>
                <div className="d-flex flex-column align-items-start gap-4 p-3">
                  <div className="d-flex gap-4 p-3 w-100">
                    <div className="d-flex flex-column gap-2 text-center w-100">
                      <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                        Step 1 / 5
                      </h5>
                      <h3 className="fw-semibold">
                        How to make a document photo?
                      </h3>
                    </div>
                  </div>

                  <div className="w-100 d-flex align-items-center w-100 flex-column gap-4 ">
                    <div className="bg-light rounded-5 w-100 p-4 text-center">
                      <img
                        src="/images/document-info.png"
                        className="img-fluid "
                        width={400}
                        alt=""
                      />
                    </div>
                  </div>
                  <button
                    disabled={!country}
                    className="btn btn-lg btn-warning my-2 w-100"
                    onClick={() => setStep("uploadDocument")}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center">
                        <div
                          className="spinner-border "
                          role="status"
                          style={{ width: "1.5rem", height: "1.5rem" }}
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-2">Loading...</span>
                      </div>
                    ) : (
                      "Understand"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : step == "uploadDocument" ? (
            <div
              className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-100 `}
            >
              <div
                className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
                style={{ border: "1px solid #373737" }}
              >
                <div>
                  <button
                    onClick={() => setStep("residenceDocument")}
                    className="btn btn-outline-dark"
                  >
                    <i className="fa fa-arrow-left"></i>
                  </button>
                </div>
                <div className="d-flex flex-column align-items-start gap-4 p-3">
                  <div className="d-flex gap-4 p-3 w-100">
                    <div className="d-flex flex-column gap-2 text-center w-100">
                      <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                        Step 2 / 5
                      </h5>
                      <h3 className="fw-semibold">
                        {documentType == "passport"
                          ? "Passport : Front Side"
                          : documentType == "aadhar"
                          ? "Aadhar Card : Front Side"
                          : "Driving License : Front Side"}
                      </h3>
                    </div>
                  </div>

                  <div className="w-100 d-flex align-items-center w-100 flex-column gap-4 ">
                    <div className="bg-light rounded-5 w-100 p-4 text-center">
                      <img
                        src="/images/documentdummy.svg"
                        className="img-fluid "
                        width={250}
                        alt=""
                      />
                    </div>
                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
                      <div>
                        <label
                          htmlFor={"image"}
                          className="btn btn-outline-dark btn-lg"
                        >
                          {loading ? (
                            <div className="d-flex align-items-center">
                              <div
                                className="spinner-border "
                                role="status"
                                style={{ width: "1.5rem", height: "1.5rem" }}
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
                        <input
                          type="file"
                          accept="image/bmp,image/gif,image/heif,image/heic,image/jpeg,image/png,image/jpg"
                          id={"image"}
                          name={"image"}
                          className="form-control d-none"
                          onChange={async (e) => {
                            setLoading(true);
                            console.log(user);

                            const formData = new FormData();
                            formData.append("document", e.target.files[0]);
                            formData.append("type", documentType);
                            formData.append(
                              "verificationId",
                              verification?._id
                            );

                            try {
                              // Send the image file to the server via an API endpoint
                              const response = await APITemplate(
                                "user/updateResidenceDocument",
                                "POST",
                                formData
                              );
                              if (response.success == true) {
                                setStep("documentUploaded");
                                setDocument(response?.data?.image);
                              }
                            } catch (error) {
                              enqueueSnackbar(error.message, {
                                variant: "error",
                              });
                            }
                            setLoading(false);
                          }}
                        />
                      </div>
                      <button className="btn btn-primary btn-lg">
                        <i className="fa fa-camera"></i>
                        Take a photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : step == "documentUploaded" ? (
            <div
              className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-100 `}
            >
              <div
                className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
                style={{ border: "1px solid #373737" }}
              >
                <div>
                  <button
                    onClick={() => setStep("residenceDocument")}
                    className="btn btn-outline-dark"
                  >
                    <i className="fa fa-arrow-left"></i>
                  </button>
                </div>
                <div className="d-flex flex-column align-items-start gap-3 p-3">
                  <div className="d-flex w-100 gap-4 p-3">
                    <div className="d-flex flex-column gap-2 text-center w-100">
                      <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                        Step 2 / 5
                      </h5>
                      <h3 className="fw-semibold">
                        {documentType == "passport"
                          ? "Passport : Front Side"
                          : documentType == "aadhar"
                          ? "Aadhar Card : Front Side"
                          : "Driving License : Front Side"}
                      </h3>
                    </div>
                  </div>

                  <div className="w-100 d-flex align-items-center w-100 flex-column gap-4 ">
                    <div className="bg-light rounded-5 w-100 p-4 text-center">
                      <img
                        src={document}
                        className="img-fluid "
                        width={250}
                        alt=""
                      />
                    </div>
                    <div>Check if the data in the document is clear</div>
                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
                      <div>
                        <label
                          htmlFor={"document"}
                          className="btn btn-outline-dark btn-lg"
                          onClick={() => {
                            setStep("uploadDocument");
                            setDocument("");
                          }}
                        >
                          <i className="fa fa-recycle"></i>
                          Retake Document
                        </label>
                      </div>
                      <button
                        onClick={() => setStep("documentData")}
                        className="btn btn-primary btn-lg"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : step == "documentData" ? (
            <div
              className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-100 `}
            >
              <div
                className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
                style={{ border: "1px solid #373737" }}
              >
                <div>
                  <button
                    onClick={() => setStep("residenceDocument")}
                    className="btn btn-outline-dark"
                  >
                    <i className="fa fa-arrow-left"></i>
                  </button>
                </div>
                <div className="d-flex flex-column align-items-start gap-3 p-3 pt-0">
                  <div className="d-flex gap-4 w-100 p-3 pb-0">
                    <div className="d-flex flex-column gap-2 text-center w-100">
                      <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                        Step 3 / 5
                      </h5>
                      <h3 className="fw-semibold">
                        Check and confirm your data
                      </h3>
                    </div>
                  </div>

                  <div className="w-100 d-flex align-items-center w-100 flex-column gap-3">
                    <div className="w-100">
                      <label htmlFor="firtname">
                        {errors.includes("firtname") ? (
                          <span className="text-danger">
                            First Name is required
                          </span>
                        ) : (
                          "First Name"
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg w-100"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="w-100">
                      <label htmlFor="lastName">
                        {errors.includes("lastName") ? (
                          <span className="text-danger">
                            Last Name is required
                          </span>
                        ) : (
                          "Last Name"
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg w-100"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="w-100">
                      <label htmlFor="nationality">
                        {errors.includes("nationality") ? (
                          <span className="text-danger">
                            Nationality is required
                          </span>
                        ) : (
                          "Nationality"
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg w-100"
                        placeholder="Nationality"
                        value={country?.label}
                        disabled
                      />
                    </div>
                    <div className="w-100">
                      <label htmlFor="DOB">
                        {errors.includes("DOB") ? (
                          <span className="text-danger">
                            Date of Birth is should be in YYYY-MM-DD format
                          </span>
                        ) : (
                          "Date of Birth"
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg w-100"
                        placeholder="YYYY-MM-DD"
                        value={DOB}
                        onChange={(e) => setDOB(e.target.value)}
                      />
                    </div>
                    <div className="w-100">
                      <label htmlFor="documentNumber">
                        {errors.includes("documentNumber") ? (
                          <span className="text-danger">
                            Document number is required
                          </span>
                        ) : (
                          "Document number"
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg w-100"
                        placeholder="Document number"
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                      />
                    </div>
                    <div className="w-100">
                      <label htmlFor="issueDate">
                        {errors.includes("issueDate") ? (
                          <span className="text-danger">
                            Issue date is required
                          </span>
                        ) : (
                          "Issue date"
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg w-100"
                        placeholder="Issue date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                      />
                    </div>
                    <div className="w-100">
                      <label htmlFor="expiryDate">
                        {errors.includes("expiryDate") ? (
                          <span className="text-danger">
                            Expiry date is required
                          </span>
                        ) : (
                          "Expiry date"
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg w-100"
                        placeholder="Expiry date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <div className="w-100">
                      <label htmlFor="fullAddress">
                        {errors.includes("fullAddress") ? (
                          <span className="text-danger">
                            Full address is required
                          </span>
                        ) : (
                          "Full address"
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg w-100"
                        placeholder="Full address"
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                      />
                    </div>
                    <div className="d-flex flex-wrap w-100 align-items-center gap-4">
                      <div className="flex-fill">
                        <label
                          htmlFor={"document"}
                          className="btn btn-outline-dark btn-lg w-100"
                          onClick={() => {
                            setStep("uploadDocumentinfo");
                            setDocument("");
                          }}
                        >
                          Retry
                        </label>
                      </div>
                      <button
                        disabled={loading}
                        onClick={handleDocumentData}
                        className="btn btn-primary btn-lg flex-fill"
                      >
                        {loading && (
                          <span className="spinner-border spinner-border-sm"></span>
                        )}
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : step == "identityVerification" ? (
            <div
              className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-100 `}
            >
              <div
                className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
                style={{ border: "1px solid #373737" }}
              >
                <div>
                  <button
                    onClick={() => setStep("documentData")}
                    className="btn btn-outline-dark"
                  >
                    <i className="fa fa-arrow-left"></i>
                  </button>
                </div>
                <div className="d-flex flex-column align-items-start gap-3 p-3 pt-0">
                  <div className="d-flex gap-4 w-100 p-3 pb-0">
                    <div className="d-flex flex-column gap-2 text-center w-100">
                      <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                        Step 4 / 5
                      </h5>
                      <h3 className="fw-semibold">Identity Verification</h3>
                    </div>
                  </div>

                  <div className="w-100 d-flex align-items-center w-100 flex-column gap-3">
                    <div className="w-100">
                      <label htmlFor="phone">
                        {errors.includes("phone") ? (
                          <span className="text-danger">
                            Please enter a valid phone number starting with +91
                            followed by 10 digits
                          </span>
                        ) : (
                          "Phone *"
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg w-100"
                        placeholder="+91 - "
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div className="w-100">
                      <label htmlFor="telegramUsername">
                        Telegram Username
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg w-100"
                        placeholder="Telegram Username"
                        value={telegramUsername}
                        onChange={(e) => setTelegramUsername(e.target.value)}
                      />
                    </div>
                    <div className="d-flex flex-wrap w-100 align-items-center gap-4 mt-3">
                      <button
                        disabled={loading}
                        onClick={handleIdentityVerification}
                        className="btn btn-primary btn-lg flex-fill"
                      >
                        {loading ? (
                          <div className="d-flex align-items-center">
                            <div
                              className="spinner-border "
                              role="status"
                              style={{ width: "1.5rem", height: "1.5rem" }}
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <span className="ms-2">Loading...</span>
                          </div>
                        ) : (
                          "Continue"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : step == "selfie" ? (
            <div
              className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-100 `}
            >
              <div
                className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
                style={{ border: "1px solid #373737" }}
              >
                <div>
                  <button
                    onClick={() => setStep("identityVerification")}
                    className="btn btn-outline-dark"
                  >
                    <i className="fa fa-arrow-left"></i>
                  </button>
                </div>
                <div className="d-flex flex-column align-items-start gap-4 p-3">
                  <div className="d-flex gap-4 p-3 w-100">
                    <div className="d-flex flex-column gap-2 text-center w-100">
                      <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                        Step 5 / 5
                      </h5>
                      <h3 className="fw-semibold">Liveness Verification</h3>
                    </div>
                  </div>

                  <div className="w-100 d-flex align-items-center w-100 flex-column gap-4 ">
                    <div className="bg-light rounded-5 w-100 p-4 text-center">
                      {!cameraOn && qrCodeUrl && !imageSelfieData && (
                        <div>
                          <h5 className="">
                            Scan the QR Code Below and continue with phone
                          </h5>
                          <QRCodeCanvas value={qrCodeUrl} size={128} />
                        </div>
                      )}
                      {(cameraOn || imageSelfieData) && (
                        <div className="d-flex flex-column align-items-center gap-2">
                          <video
                            ref={videoRef}
                            className="img-fluid object-fit-cover rounded-3 h-100 w-100"
                          ></video>
                          <button
                            className="btn btn-success"
                            onClick={
                              !cameraOn && imageSelfieData
                                ? startWebcam
                                : capturePhoto
                            }
                          >
                            {!cameraOn && imageSelfieData
                              ? "Retake"
                              : " Take a snapshot"}
                          </button>
                          <canvas
                            ref={canvasRef}
                            style={{ display: "none" }}
                          ></canvas>
                        </div>
                      )}
                      {!cameraOn && !qrCodeUrl && !imageSelfieData && (
                        <img
                          src="/images/selfie.png"
                          className="img-fluid "
                          width={250}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
                      <div>
                        {imageSelfieData ? (
                          <button
                            className="btn btn-primary btn-lg"
                            onClick={() => setStep("confirmSelfie")}
                          >
                            Continue
                          </button>
                        ) : (
                          <button
                            disabled={cameraOn}
                            onClick={startWebcam}
                            className="btn btn-primary btn-lg"
                          >
                            {loading ? (
                              <div className="d-flex align-items-center">
                                <div
                                  className="spinner-border "
                                  role="status"
                                  style={{ width: "1.5rem", height: "1.5rem" }}
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
                                Take a Selfie
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <button
                        onClick={handleSelfieMobile}
                        className="btn btn-outline-dark btn-lg"
                      >
                        <i className="fa fa-camera"></i>
                        Continue with phone
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : step == "confirmSelfie" ? (
            <div
              className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-100 `}
            >
              <div
                className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
                style={{ border: "1px solid #373737" }}
              >
                <div>
                  <button
                    onClick={() => setStep("selfie")}
                    className="btn btn-outline-dark"
                  >
                    <i className="fa fa-arrow-left"></i>
                  </button>
                </div>
                <div className="d-flex flex-column align-items-start gap-2 p-3">
                  <div className="d-flex gap-4 p-3 pb-0 w-100">
                    <div className="d-flex flex-column gap-2 text-center w-100">
                      <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                        Step 5 / 5
                      </h5>
                      <h3 className="fw-semibold">Confirm your selfie</h3>
                    </div>
                  </div>

                  <div className="w-100 d-flex align-items-center w-100 flex-column gap-4 ">
                    <div className="bg-light rounded-5 w-100 p-4 text-center">
                      {imageSelfieData && (
                        <div>
                          <div className="d-flex flex-column align-items-center gap-2">
                            <img
                              src={imageSelfieData}
                              alt="Captured"
                              className="img-fluid object-fit-cover rounded-3 h-75 w-75"
                            />
                            <p className="">
                              Please ensure that your face is clearly visible in
                              the image.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
                      <div>
                        <button
                          onClick={() => setStep("selfie")}
                          className="btn btn-primary btn-lg"
                        >
                          <i className="fa fa-plus"></i>
                          Retake Selfie
                        </button>
                      </div>
                      <button
                        disabled={loading}
                        onClick={handleUploadSelfie}
                        className="btn btn-outline-dark btn-lg"
                      >
                        {loading ? (
                          <div className="d-flex align-items-center">
                            <div
                              className="spinner-border "
                              role="status"
                              style={{ width: "1.5rem", height: "1.5rem" }}
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <span className="ms-2">Loading...</span>
                          </div>
                        ) : (
                          "Sumbit"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : step == "completed" ? (
            <div
              className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-100 `}
            >
              <div
                className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
                style={{ border: "1px solid #373737" }}
              >
                <div>
                  <button
                    onClick={() => setStep("confirmSelfie")}
                    className="btn btn-outline-dark"
                  >
                    <i className="fa fa-arrow-left"></i>
                  </button>
                </div>
                <div className="d-flex flex-column align-items-start gap-4 p-3 ">
                  <div className="d-flex gap-4 p-3 pb-0 w-100 py-0">
                    <div className="d-flex flex-column gap-2 text-center w-100">
                      <h3 className="fw-semibold">Verification Under Reveiw</h3>
                    </div>
                  </div>

                  <div className="w-100 d-flex align-items-start w-100 flex-column gap-4 ">
                    <div>
                      Profile :{" "}
                      <span className="badge bg-warning">Pending</span>
                    </div>
                    <div>
                      Document :{" "}
                      <span className="badge bg-warning">Pending</span>
                    </div>
                    <div>
                      Liveness :{" "}
                      <span className="badge bg-warning">Pending</span>
                    </div>
                    <div>
                      Address :{" "}
                      <span className="badge bg-warning">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="vh-100 d-flex align-items-center justify-content-center vw-100 bg-white">
              <h2>
                <span className="spinner-border text_Primary_500 me-3"></span>
                Loading ...
              </h2>
            </div>
          )}
        </div>
      ) : tokenStep == "expiredToken" ? (
        <>
          <div className="d-flex flex-column gap-2 text-center">
            <div
              style={{
                height: "70px",
                width: "70px",
                margin: "0 auto",
              }}
            >
              <div className="circle-border">
                <div className="circle">
                  <div className="error"></div>
                </div>
              </div>
            </div>
            <h3>Request Expired</h3>
          </div>
          <div id="login-base" className="d-flex flex-column gap-2">
            <Link
              className="btn btn-primary rounded-pill my-3"
              href="/kyc/verification"
            >
              Go Back
            </Link>
          </div>
        </>
      ) : (
        router.push("/404")
      )}
    </>
  );
}
