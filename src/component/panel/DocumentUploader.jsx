"use client";
import { APITemplate } from "@/component/API/Template";
import { getGeoDetails } from "@/component/global";
import { useLoader } from "@/context/LoaderProvider";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";

export default function Verification() {
  const router = useRouter();
  const { setLoader } = useLoader();
  const { user } = useUser();
  useEffect(() => {
    if (user && user?._id) {
      setLoader(false);
    } else {
      setLoader(true);
    }
  }, [user]);
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
    setLoader(true);
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

      setLoader(false);
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
      <div
        className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-90 `}
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
          <div className="d-flex flex-column align-items-start  p-3">
            <div className="d-flex gap-4 p-3 w-100">
              <div className="d-flex flex-column gap-2 text-center w-100">
                <h3 className="fw-semibold">Pan Card</h3>
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
                          <span className="visually-hidden">Loading...</span>
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
                      formData.append("verificationId", verification?._id);

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
                        enqueueSnackbar(error.message, { variant: "error" });
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
    </>
  );
}
