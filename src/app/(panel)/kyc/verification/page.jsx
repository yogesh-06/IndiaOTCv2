"use client";
import { APITemplate } from "@/component/API/Template";
import { getGeoDetails, isFileProtected } from "@/component/global";
import PdfPassword from "@/component/pdfPassword";
import TakePhoto from "@/component/TakePhoto";
import { useLoader } from "@/context/LoaderProvider";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";

export default function Verification() {
  const router = useRouter();
  const { user } = useUser();
  const { setLoader } = useLoader();

  useEffect(() => {
    if (user && user?._id) {
      setLoader(false);
    } else {
      setLoader(true);
    }
  }, [user]);
  const [step, setStep] = useState("loading");
  const [loading, setLoading] = useState(false);
  const [backLoading, setBackLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [backPhotoLoading, setBackPhotoLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [country, setCountry] = useState({});
  const [countries, setCountries] = useState([]);

  const [documentType, setDocumentType] = useState("GOVERNMENT_ID");
  const [frontDocument, setFrontDocument] = useState("");
  const [backDocument, setBackDocument] = useState("");
  const [panDocument, setPanDocument] = useState("");
  const [bankDocument, setBankDocument] = useState([]);
  const [docType, setDocType] = useState("");

  const [verification, setVerification] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [DOB, setDOB] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [showPdfPasswordModal, setShowPdfPasswordModal] = useState("none");
  const [showPhotoCaptureModal, setPhotoCaptureModal] = useState("none");
  const [protectedFile, setProtectedFile] = useState();

  const ApplyReVerification = async () => {
    setLoading(true);
    if (
      user?.documentStatus == "rejected" ||
      user?.facialStatus == "rejected" ||
      user?.kycStatus == "rejected"
    ) {
      try {
        const response = await APITemplate(
          `user/setReVerification?id=${verification._id}`,
          "GET"
        );
        if (response.success == true) {
          window.location.reload();
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

  const [panData, setPanData] = useState({
    firstName: "",
    lastName: "",
    nationality: "",
    DOB: "",
    documentNumber: "",
    issueDate: "",
    expiryDate: "",
    fullAddress: "",
  });

  const [questionaries, setQuestionariesData] = useState({
    transactionPurpose: "",
    transactionAmount: "",
    isSufficientFunds: true,
    transactionType: "INR",
  });

  const onSubmitPassword = async (password) => {
    const formData = new FormData();
    formData.append("image", protectedFile);
    formData.append("password", password);
    formData.append("verificationId", verification?._id);

    try {
      // Send the image file to the server via an API endpoint
      const response = await APITemplate(
        "user/updateMultifilesBankStatement",
        "POST",
        formData
      );

      if (response.success == true) {
        setStep("uploadBankStatement");
        setBankDocument(
          response?.data?.length &&
            response?.data.find((item) => item.type == "BANK_STATEMENT").files
        );
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  };

  const handlePanData = (e) => {
    const { name, value } = e.target;
    setPanData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuestionariesData = (e) => {
    const { name, value } = e.target;
    setQuestionariesData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
        if (user?.riskLevel == "high" || user?.riskLevel == "medium") {
          router.push("/kyc");
        } else if (user?.status != "pending") {
          router.push("/kyc");
        } else {
          if (
            user?.documentStatus == "processing" &&
            user?.kycStatus == "processing"
          ) {
            setStep("completed");
          } else if (user?.phone) {
            setPhoneNumber(user?.phone);
            setTelegramUsername(user?.telegramUsername);
            if (user?.nationalityCountry) {
              if (
                verificationResult?.applicant?.documents?.length > 0 &&
                verificationResult?.applicant?.documents[0]?.front_side &&
                verificationResult?.applicant?.documents[0]?.back_side
              ) {
                setDocumentType(
                  verificationResult?.applicant?.documents[0]?.type
                );
                setFrontDocument(
                  verificationResult?.applicant?.documents[0]?.front_side
                );
                setBackDocument(
                  verificationResult?.applicant?.documents[0]?.back_side
                );
                if (
                  verificationResult?.applicant?.documents.find(
                    (item) => item.type == "PANCARD"
                  )?.portrait
                ) {
                  setPanData({
                    firstName: verificationResult?.applicant?.documents.find(
                      (item) => item.type == "PANCARD"
                    ).first_name,
                    lastName: verificationResult?.applicant?.documents.find(
                      (item) => item.type == "PANCARD"
                    ).last_name,
                    DOB: verificationResult?.applicant?.documents.find(
                      (item) => item.type == "PANCARD"
                    ).dob,
                    documentNumber:
                      verificationResult?.applicant?.documents.find(
                        (item) => item.type == "PANCARD"
                      ).document_number,
                    issueDate: verificationResult?.applicant?.documents.find(
                      (item) => item.type == "PANCARD"
                    ).issue_date,
                    expiryDate: verificationResult?.applicant?.documents.find(
                      (item) => item.type == "PANCARD"
                    ).expiry_date,
                    fullAddress: verificationResult?.applicant?.documents.find(
                      (item) => item.type == "PANCARD"
                    ).full_address,
                  });
                  setPanDocument(
                    verificationResult?.applicant?.documents.find(
                      (item) => item.type == "PANCARD"
                    ).portrait
                  );

                  if (
                    verificationResult?.applicant?.documents.find(
                      (item) => item.type == "BANK_STATEMENT"
                    )?.portrait
                  ) {
                    setQuestionariesData({
                      transactionPurpose:
                        verificationResult?.applicant?.documents.find(
                          (item) => item.type == "BANK_STATEMENT"
                        ).transaction_purpose,
                      transactionAmount:
                        verificationResult?.applicant?.documents.find(
                          (item) => item.type == "BANK_STATEMENT"
                        ).transaction_amount,
                      transactionType:
                        verificationResult?.applicant?.documents.find(
                          (item) => item.type == "BANK_STATEMENT"
                        ).transaction_type,
                    });
                    setBankDocument(
                      verificationResult?.applicant?.documents.find(
                        (item) => item.type == "BANK_STATEMENT"
                      ).files
                    );
                    if (
                      verificationResult?.applicant?.questionaries?.length > 0
                    ) {
                      setQuestionariesData({
                        transactionPurpose:
                          verificationResult?.applicant?.questionaries.find(
                            (item) => item.type == "transactionPurpose"
                          ).answer,
                        transactionAmount:
                          verificationResult?.applicant?.questionaries.find(
                            (item) => item.type == "transactionAmount"
                          ).answer,
                        transactionType:
                          verificationResult?.applicant?.questionaries.find(
                            (item) => item.type == "transactionType"
                          ).answer,
                      });
                      setStep("completed");
                    } else {
                      setStep("questionariesData");
                    }
                  } else {
                    setStep("uploadBankStatementinfo");
                  }
                } else {
                  setStep("uploadPanDocument");
                }
              } else {
                setStep("uploadDocumentinfo");
              }
            } else {
              setStep("uploadDocumentinfo");
            }
          } else {
            setStep("initVerification");
          }
          console.log(
            verificationResult?.applicant?.documents.find(
              (item) => item.type == "PANCARD"
            )?.portrait
          );
        }
      }
    }
    initStep();
  }, [user]);

  useEffect(() => {
    if (user?.phone) {
      setPhoneNumber(user?.phone);
      setTelegramUsername(user?.telegramUsername);
    }
    if (
      verification?.applicant?.documents?.length > 0 &&
      verification?.applicant?.documents[0]?.front_side &&
      verification?.applicant?.documents[0]?.back_side
    ) {
      setDocumentType(verification?.applicant?.documents[0]?.type);
      setFrontDocument(verification?.applicant?.documents[0]?.front_side);
      setBackDocument(verification?.applicant?.documents[0]?.back_side);
    }
    if (
      verification?.applicant?.documents.find((item) => item.type == "PANCARD")
        ?.portrait
    ) {
      setPanData({
        firstName: verification?.applicant?.documents.find(
          (item) => item.type == "PANCARD"
        ).first_name,
        lastName: verification?.applicant?.documents.find(
          (item) => item.type == "PANCARD"
        ).last_name,
        DOB: verification?.applicant?.documents.find(
          (item) => item.type == "PANCARD"
        ).dob,
        documentNumber: verification?.applicant?.documents.find(
          (item) => item.type == "PANCARD"
        ).document_number,
        issueDate: verification?.applicant?.documents.find(
          (item) => item.type == "PANCARD"
        ).issue_date,
        expiryDate: verification?.applicant?.documents.find(
          (item) => item.type == "PANCARD"
        ).expiry_date,
        fullAddress: verification?.applicant?.documents.find(
          (item) => item.type == "PANCARD"
        ).full_address,
      });
      setPanDocument(
        verification?.applicant?.documents.find(
          (item) => item.type == "PANCARD"
        ).portrait
      );
    }
    if (
      verification?.applicant?.documents.find(
        (item) => item.type == "BANK_STATEMENT"
      )?.portrait
    ) {
      setQuestionariesData({
        transactionPurpose: verification?.applicant?.documents.find(
          (item) => item.type == "BANK_STATEMENT"
        ).transaction_purpose,
        transactionAmount: verification?.applicant?.documents.find(
          (item) => item.type == "BANK_STATEMENT"
        ).transaction_amount,
        transactionType: verification?.applicant?.documents.find(
          (item) => item.type == "BANK_STATEMENT"
        ).transaction_type,
      });
      console.log(
        "verification?.applicant?.documents===",
        verification?.applicant?.documents
      );

      setBankDocument(
        verification?.applicant?.documents.find(
          (item) => item.type == "BANK_STATEMENT"
        ).files
      );
    }
    if (verification?.applicant?.questionaries?.length > 0) {
      setQuestionariesData({
        transactionPurpose: verification?.applicant?.questionaries.find(
          (item) => item.type == "transactionPurpose"
        ).answer,
        transactionAmount: verification?.applicant?.questionaries.find(
          (item) => item.type == "transactionAmount"
        ).answer,
        transactionType: verification?.applicant?.questionaries.find(
          (item) => item.type == "transactionType"
        ).answer,
      });
    }
  }, [verification]);

  const handleNationality = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];
    // if (
    //   !country ||
    //   country == "" ||
    //   country == "none" ||
    //   !country.value ||
    //   country.value == "" ||
    //   country.value == "none"
    // ) {
    //   setLoading(false);
    //   newErrors.push("country");
    //   setErrors(newErrors);
    // }
    // if (newErrors.length > 0) return;

    const formData = new FormData();
    // formData.append("nationalityCountry", country.value);
    formData.append("nationalityCountry", "IN");
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
        return response?.data?.lastVerificationId;
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
    const regex = /^\d{10}$/;

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
    let lastVerificationId = await handleNationality();

    const formData = new FormData();
    formData.append("phone", phoneNumber);
    formData.append("telegramUsername", telegramUsername);
    formData.append("verificationId", lastVerificationId);

    try {
      const response = await APITemplate(
        "user/updateIdentityVerification",
        "POST",
        formData
      );
      if (response.success == true) {
        // enqueueSnackbar(response.message, { variant: "success" });
        await getVerification(lastVerificationId);
        setStep("uploadDocumentinfo");
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
        await getVerification(verification?._id);
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
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d\d$/;
    if (!DOB || regex.test(DOB) == false) {
      newErrors.push("DOB");
      setErrors(newErrors);
    }
    if (!documentNumber) {
      newErrors.push("documentNumber");
      setErrors(newErrors);
    }
    if (!issueDate || regex.test(issueDate) == false) {
      newErrors.push("issueDate");
      setErrors(newErrors);
    }
    if (!expiryDate || regex.test(expiryDate) == false) {
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
        await getVerification(verification?._id);
        setStep("uploadPanDocumentinfo");
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  const handlePanDocumentData = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];
    if (!panData?.firstName) {
      newErrors.push("firstName");
      setErrors(newErrors);
    }
    if (!panData?.lastName) {
      newErrors.push("lastName");
      setErrors(newErrors);
    }
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d\d$/;
    if (!panData?.DOB || regex.test(panData?.DOB) == false) {
      newErrors.push("DOB");
      setErrors(newErrors);
    }
    if (!panData?.documentNumber) {
      newErrors.push("documentNumber");
      setErrors(newErrors);
    }
    // if (!panData?.issueDate) {
    //   newErrors.push("issueDate");
    //   setErrors(newErrors);
    // }
    // if (!panData?.expiryDate) {
    //   newErrors.push("expiryDate");
    //   setErrors(newErrors);
    // }
    // if (!panData?.fullAddress) {
    //   newErrors.push("fullAddress");
    //   setErrors(newErrors);
    // }

    if (newErrors.length > 0) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("firstName", panData?.firstName);
    formData.append("lastName", panData?.lastName);
    formData.append("dob", panData?.DOB);
    formData.append("document_number", panData?.documentNumber);
    formData.append("issue_date", panData?.issueDate);
    formData.append("expiry_date", panData?.expiryDate);
    formData.append("full_address", panData?.fullAddress);
    formData.append("verificationId", verification?._id);
    try {
      const response = await APITemplate(
        "user/updatePanDocumentData",
        "POST",
        formData
      );
      if (response.success == true) {
        await getVerification(verification?._id);
        setStep("uploadBankStatementinfo");
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  const handleQuestionaries = async () => {
    setErrors([]);
    setLoading(true);
    const newErrors = [];
    if (!questionaries?.transactionPurpose) {
      newErrors.push("transactionPurpose");
      setErrors(newErrors);
    }
    if (!questionaries?.transactionAmount) {
      newErrors.push("transactionAmount");
      setErrors(newErrors);
    }
    if (
      questionaries?.transactionAmount < 2000 &&
      questionaries?.transactionType == "USD"
    ) {
      newErrors.push("transactionAmount");
      setErrors(newErrors);
    } else if (
      questionaries?.transactionAmount < 200000 &&
      questionaries?.transactionType == "INR"
    ) {
      newErrors.push("transactionAmount");
      setErrors(newErrors);
    }
    if (newErrors.length > 0) {
      setLoading(false);
      return;
    }

    let requestData = [
      {
        question: "Transaction Purpose",
        type: "transactionPurpose",
        answer: questionaries?.transactionPurpose,
      },
      {
        question: "Transaction Amount",
        type: "transactionAmount",
        answer: questionaries?.transactionAmount,
      },
      {
        question: "Transaction Type",
        type: "transactionType",
        answer: questionaries?.transactionType,
      },
      {
        question: "Does your account have sufficient funds?",
        type: "isSufficientFunds",
        answer: questionaries?.isSufficientFunds ? "Yes" : "No",
      },
    ];
    const formData = new FormData();
    requestData.forEach((item) => {
      formData.append("questionaries[]", JSON.stringify(item));
    });
    formData.append("verificationId", verification?._id);
    try {
      const response = await APITemplate(
        "user/updateQuestionaries",
        "POST",
        formData
      );
      if (response.success == true) {
        await APITemplate("user/submitReview", "POST", {
          verificationId: verification?._id,
        });
        await getVerification(verification?._id);
        setStep("completed");
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  const handleCapturedPhoto = async (binaryData, image) => {
    const formData = new FormData();
    const blob = new Blob([binaryData], { type: "image/png" });
    formData.append("document", blob);
    formData.append("verificationId", verification?._id);

    if (docType === "aadharFront") {
      setPhotoLoading(true);
      // setFrontDocument(image);
      formData.append("documentExtractType", "Aadhaar Card");
      formData.append("type", documentType);

      try {
        const response = await APITemplate(
          "user/updateResidenceDocument",
          "POST",
          formData
        );
        if (response.success == true) {
          getVerification(verification?._id);
          setFrontDocument(response?.data?.image);
          console.log("==response?.data?.image", response?.data?.image);
        }
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
      setPhotoLoading(false);
    } else if (docType === "aadharBack") {
      setBackPhotoLoading(true);
      // setBackDocument(image);
      formData.append("documentExtractType", "Aadhaar Card");
      formData.append("type", documentType);

      try {
        const response = await APITemplate(
          "user/updateResidenceBackDocument",
          "POST",
          formData
        );
        if (response.success == true) {
          getVerification(verification?._id);
          setBackDocument(response?.data?.image);
          console.log("==Backresponse?.data?.image", response?.data?.image);
        }
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
      setBackPhotoLoading(false);
    } else if (docType === "panDoc") {
      setPhotoLoading(true);
      // setPanDocument(image);
      formData.append("documentExtractType", "Pan Card");

      try {
        const response = await APITemplate(
          "user/updatePancard",
          "POST",
          formData
        );
        if (response.success == true) {
          setPanDocument(response?.data?.image);
          getVerification(verification?._id);
        }
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
      setPhotoLoading(false);
    }
  };

  const handlePhotoCaptureModal = async (type) => {
    setPhotoCaptureModal("open");
    setDocType(type);
  };

  useEffect(() => {
    setTimeout(() => {
      setStep("initVerification");
    }, 2000);
  }, []);

  return (
    <div className="">
      <PdfPassword
        isOpen={showPdfPasswordModal}
        onClose={() => setShowPdfPasswordModal("none")}
        onPasswordSubmit={onSubmitPassword}
      />
      <TakePhoto
        isOpen={showPhotoCaptureModal}
        onClose={() => setPhotoCaptureModal("none")}
        onPhotoSubmit={handleCapturedPhoto}
      />
      {step == "initVerification" ? (
        <div
          className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-90 `}
        >
          <div
            className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
            style={{ border: "1px solid #373737" }}
          >
            <div className="d-flex flex-column align-items-start gap-3 p-3 pt-0 w-100">
              <div className="d-flex gap-4 w-100 p-3 pb-0">
                <div className="d-flex flex-column gap-2 text-center w-100">
                  <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                    Step 1 / 5
                  </h5>
                  <h3 className="fw-semibold">Identity Verification</h3>
                  <p className="text-center fw-medium m-0 py-1">
                    Your Telegram ID helps us connect you with our support desk
                    faster.
                  </p>
                </div>
              </div>

              <div className="w-100 d-flex align-items-center w-100 flex-column gap-3">
                <div className="w-100">
                  <label htmlFor="phone">
                    {errors.includes("phone") ? (
                      <span className="text-danger">
                        Please enter a valid phone number followed by 10 digits
                      </span>
                    ) : (
                      "Phone *"
                    )}
                  </label>
                  <div className="input-group input-group-lg">
                    <button className="input-group-text">+971</button>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="9XXXXXXX06"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-100">
                  <label htmlFor="telegramUsername">Telegram Username</label>
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
          </div>
        </div>
      ) : step == "uploadDocumentinfo" ? (
        <div
          className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-90 `}
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
            <div className="d-flex flex-column align-items-start gap-4 p-3">
              <div className="d-flex gap-4 p-3 w-100">
                <div className="d-flex flex-column gap-2 text-center w-100">
                  <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                    Step 2 / 5
                  </h5>
                  {/* <h3 className="fw-semibold">How to make a document photo?</h3> */}
                  <div className="w-100 d-flex justify-content-center mt-2">
                    <h4 className="text-center fw-medium m-0 p-0">
                      Please read the document submission guidelines carefully{" "}
                      before uploading your ID proof.
                    </h4>
                  </div>
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
          className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-90 `}
        >
          <div
            className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5"
            style={{ border: "1px solid #373737" }}
          >
            <div className="d-flex gap-4 justify-content-between">
              <button
                onClick={() => setStep("uploadDocumentinfo")}
                className="btn btn-outline-dark"
              >
                <i className="fa fa-arrow-left"></i>
              </button>
              {frontDocument && frontDocument != "" && (
                <button
                  onClick={() => setStep("uploadPanDocumentinfo")}
                  className="btn btn-outline-dark"
                >
                  <i className="fa fa-arrow-right"></i>
                </button>
              )}
            </div>
            <div className="d-flex gap-4 p-3 w-100">
              <div className="d-flex flex-column gap-2 text-center w-100">
                <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                  Step 2 / 5
                </h5>
                <h3 className="fw-semibold">
                  {documentType == "PASSPORT"
                    ? "Passport Document"
                    : documentType == "GOVERNMENT_ID"
                    ? "Upload Aadhaar Card"
                    : documentType == "DRIVERS_LICENSE"
                    ? "Driving License Document"
                    : "Upload Document"}
                </h3>
                <p className="my-2">
                  <span className="badge badge-sm bg-info-subtle text-info me-1">
                    <i className="fa-solid fa-address-card fa-xl py-2 px-1"></i>
                  </span>
                  <span className="text-muted">
                    File Types Allowed: JPG, JPEG, PNG, PDF
                  </span>
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 pb-3">
              <div className="d-flex flex-column align-items-start">
                <div className="d-flex gap-4 p-3 w-100">
                  <div className="d-flex flex-column gap-2 text-center w-100">
                    <h4 className="fw-semibold">Front Side</h4>
                  </div>
                </div>

                <div className="w-100 d-flex align-items-center w-100 flex-column gap-2">
                  <div className="bg-light rounded-5 w-100 p-3 text-center">
                    <img
                      src={
                        frontDocument == ""
                          ? "/images/documentdummy.svg"
                          : frontDocument
                      }
                      className="img-fluid"
                      style={{
                        height: "150px",
                        width: "250px",
                      }}
                      alt=""
                    />
                  </div>
                  <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
                    <div>
                      {!frontDocument ? (
                        <div className="d-flex flex-column gap-1">
                          <label
                            htmlFor={"document"}
                            className="btn btn-outline-dark"
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
                          <label
                            htmlFor={"capture"}
                            className="btn btn-outline-dark"
                          >
                            {photoLoading ? (
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
                              <div
                                onClick={() =>
                                  handlePhotoCaptureModal("aadharFront")
                                }
                              >
                                <i class="fa-solid fa-camera me-2 me-2"></i>
                                Take a Photo
                              </div>
                            )}
                          </label>
                        </div>
                      ) : (
                        <label
                          htmlFor={"document"}
                          className="btn btn-outline-dark"
                          onClick={() => {
                            // setStep("uploadDocument");
                            setFrontDocument("");
                          }}
                        >
                          <i className="fa fa-recycle"></i>
                          Re-upload Document
                        </label>
                      )}
                      <input
                        type="file"
                        accept="image/bmp,image/gif,image/heif,image/heic,image/jpeg,image/png,image/jpg"
                        id={"document"}
                        name={"document"}
                        className="form-control d-none"
                        onChange={async (e) => {
                          setLoading(true);

                          const formData = new FormData();
                          formData.append("document", e.target.files[0]);
                          formData.append("type", documentType);
                          formData.append(
                            "documentExtractType",
                            "Aadhaar Card"
                          );
                          formData.append("verificationId", verification?._id);

                          try {
                            // Send the image file to the server via an API endpoint
                            const response = await APITemplate(
                              "user/updateResidenceDocument",
                              "POST",
                              formData
                            );
                            if (response.success == true) {
                              getVerification(verification?._id);
                              setFrontDocument(response?.data?.image);
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
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column align-items-start">
                <div className="d-flex gap-4 p-3 w-100">
                  <div className="d-flex flex-column gap-2 text-center w-100">
                    <h4 className="fw-semibold">Back Side</h4>
                  </div>
                </div>

                <div className="w-100 d-flex align-items-center w-100 flex-column gap-2">
                  <div className="bg-light rounded-5 w-100 p-3 text-center">
                    <img
                      src={
                        backDocument == ""
                          ? "/images/documentdummy.svg"
                          : backDocument
                      }
                      className="img-fluid"
                      style={{
                        height: "150px",
                        width: "250px",
                      }}
                      alt=""
                    />
                  </div>
                  <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
                    <div>
                      {!backDocument ? (
                        <div className="d-flex flex-column gap-1">
                          <label
                            htmlFor={"backDocument"}
                            className="btn btn-outline-dark"
                          >
                            {backLoading ? (
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
                          <label
                            htmlFor={"capture"}
                            className="btn btn-outline-dark"
                          >
                            {backPhotoLoading ? (
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
                              <div
                                onClick={() =>
                                  handlePhotoCaptureModal("aadharBack")
                                }
                              >
                                <i class="fa-solid fa-camera me-2"></i>
                                Take a Photo
                              </div>
                            )}
                          </label>
                        </div>
                      ) : (
                        <label
                          htmlFor={"backDocument"}
                          className="btn btn-outline-dark"
                          onClick={() => {
                            // setStep("uploadDocument");
                            setBackDocument("");
                          }}
                        >
                          <i className="fa fa-recycle"></i>
                          Re-upload Document
                        </label>
                      )}
                      <input
                        type="file"
                        accept="image/bmp,image/gif,image/heif,image/heic,image/jpeg,image/png,image/jpg"
                        id={"backDocument"}
                        name={"backDocument"}
                        className="form-control d-none"
                        onChange={async (e) => {
                          setBackLoading(true);
                          console.log(user);
                          console.log("==backImage");
                          const formData = new FormData();
                          formData.append("document", e.target.files[0]);
                          formData.append("type", documentType);
                          formData.append(
                            "documentExtractType",
                            "Aadhaar Card"
                          );
                          formData.append("verificationId", verification?._id);

                          try {
                            // Send the image file to the server via an API endpoint
                            const response = await APITemplate(
                              "user/updateResidenceBackDocument",
                              "POST",
                              formData
                            );
                            if (response.success == true) {
                              // setStep("backdocumentUploaded");
                              getVerification(verification?._id);
                              setBackDocument(response?.data?.image);
                            }
                          } catch (error) {
                            enqueueSnackbar(error.message, {
                              variant: "error",
                            });
                          }
                          setBackLoading(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center pb-2 pt-4">
              <button
                className="btn btn-lg btn-primary w-50"
                onClick={() => {
                  if (frontDocument == "" || backDocument == "") {
                    return enqueueSnackbar(
                      "Please upload both front and back side of document",
                      { variant: "warning" }
                    );
                  }
                  setStep("uploadPanDocumentinfo");
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : step == "uploadPanDocumentinfo" ? (
        <div
          className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-90 `}
        >
          <div
            className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
            style={{ border: "1px solid #373737" }}
          >
            <div>
              <button
                onClick={() => setStep("uploadDocument")}
                className="btn btn-outline-dark"
              >
                <i className="fa fa-arrow-left"></i>
              </button>
            </div>
            <div className="d-flex flex-column align-items-start gap-4 p-3">
              <div className="d-flex gap-4 p-3 w-100">
                <div className="d-flex flex-column gap-2 text-center w-100">
                  <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                    Step 3 / 5
                  </h5>
                  <h3 className="fw-semibold">
                    How to upload a PAN card image?
                  </h3>
                  <p className="text-center fw-medium m-0 p-0">
                    Please read the document submission guidelines carefully
                    before uploading your ID proof.
                  </p>
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
                className="btn btn-lg btn-warning  w-100"
                onClick={() => setStep("uploadPanDocument")}
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
      ) : step == "uploadPanDocument" ? (
        <div
          className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-90 `}
        >
          <div
            className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
            style={{ border: "1px solid #373737" }}
          >
            <div className="d-flex gap-4 justify-content-between">
              <button
                onClick={() => setStep("uploadPanDocumentinfo")}
                className="btn btn-outline-dark"
              >
                <i className="fa fa-arrow-left"></i>
              </button>
              {panDocument && panDocument != "" && (
                <button
                  onClick={() => setStep("uploadBankStatementinfo")}
                  className="btn btn-outline-dark"
                >
                  <i className="fa fa-arrow-right"></i>
                </button>
              )}
            </div>
            <div className="d-flex flex-column align-items-start  p-3">
              <div className="d-flex gap-4 p-3 w-100">
                <div className="d-flex flex-column gap-2 text-center w-100">
                  <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                    Step 3 / 5
                  </h5>
                  <h3 className="fw-semibold">Upload PAN Card</h3>

                  <ul class="list-unstyled ps-2 pt-2">
                    <li class="d-flex align-items-center mb-2">
                      <span class="badge badge-sm bg-info-subtle text-info me-2">
                        <i class="fa-solid fa-id-card"></i>
                      </span>
                      <span class="text-muted">
                        PAN is mandatory as per Indian KYC norms.
                      </span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <span class="badge badge-sm bg-info-subtle text-info me-2">
                        <i class="fa-solid fa-bank"></i>
                      </span>
                      <span class="text-muted">
                        Ensure name matches your bank account.
                      </span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <span class="badge badge-sm bg-info-subtle text-info me-2">
                        <i class="fa-solid fa-circle-xmark"></i>
                      </span>
                      <span class="text-muted">
                        Pan card backside not required.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="w-100 d-flex align-items-center w-100 flex-column gap-4 ">
                <div className="bg-light rounded-5 w-100 p-4 text-center">
                  <img
                    src={
                      panDocument == ""
                        ? "/images/documentdummy.svg"
                        : panDocument
                    }
                    className="img-fluid "
                    width={250}
                    alt=""
                  />
                </div>
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
                  <div>
                    {!panDocument ? (
                      <div className="d-flex flex-column gap-1">
                        <label
                          htmlFor={"image"}
                          className="btn btn-outline-dark"
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
                        <label
                          htmlFor={"capture"}
                          className="btn btn-outline-dark"
                        >
                          {photoLoading ? (
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
                            <div
                              onClick={() => handlePhotoCaptureModal("panDoc")}
                            >
                              <i class="fa-solid fa-camera me-2"></i>
                              Take a Photo
                            </div>
                          )}
                        </label>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-center gap-2">
                        <label
                          htmlFor={"document"}
                          className="btn btn-lg btn-outline-dark"
                          onClick={() => {
                            setPanDocument("");
                          }}
                        >
                          <i className="fa fa-recycle"></i>
                          Re-upload Document
                        </label>
                        <button
                          className="btn btn-lg btn-primary"
                          onClick={() => setStep("uploadBankStatementinfo")}
                        >
                          Confirm
                        </button>
                      </div>
                    )}
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
                        formData.append("documentExtractType", "Pan Card");
                        formData.append("verificationId", verification?._id);

                        try {
                          // Send the image file to the server via an API endpoint
                          const response = await APITemplate(
                            "user/updatePancard",
                            "POST",
                            formData
                          );
                          if (response.success == true) {
                            // setStep("documentPanUploaded");
                            setPanDocument(response?.data?.image);
                            getVerification(verification?._id);
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
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : step == "uploadBankStatementinfo" ? (
        <div
          className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-90 `}
        >
          <div
            className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
            style={{ border: "1px solid #373737" }}
          >
            <div>
              <button
                onClick={() => setStep("uploadPanDocument")}
                className="btn btn-outline-dark"
              >
                <i className="fa fa-arrow-left"></i>
              </button>
            </div>
            <div className="d-flex flex-column align-items-start gap-4 p-3">
              <div className="d-flex gap-4 p-3 w-100">
                <div className="d-flex flex-column gap-2 text-center w-100">
                  <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                    Step 4 / 5
                  </h5>
                  <h3 className="fw-semibold">
                    How to upload Bank Statement document?
                  </h3>
                  <div>
                    <ul class="list-unstyled py-1">
                      <li class="d-flex align-items-start mb-2">
                        <span class="badge badge-sm bg-primary-subtle text-primary me-2 mt-1">
                          <i class="fa-solid fa-file-invoice-dollar"></i>
                        </span>
                        <span class="text-muted text-start">
                          <strong>Instructions:</strong> Please upload a recent
                          bank statement with visible transaction history. This
                          is required to verify your source of funds and may
                          impact your onboarding process.
                        </span>
                      </li>
                      <li class="d-flex align-items-center mb-2">
                        <span class="badge badge-sm bg-primary-subtle text-primary me-2">
                          <i class="fa-solid fa-file-arrow-up"></i>
                        </span>
                        <span class="text-muted">
                          Accepted File Types: PDF, XLSX, CSV
                        </span>
                      </li>
                      <hr class="my-3" />
                      <li class="d-flex align-items-start mb-2">
                        <span class="badge badge-sm bg-primary-subtle text-primary me-2 mt-1">
                          <i class="fa-solid fa-user-check"></i>
                        </span>
                        <span class="text-muted text-start">
                          <strong>Requirements:</strong> Must include account
                          holder's name and bank details
                        </span>
                      </li>
                      <li class="d-flex align-items-center mb-2">
                        <span class="badge badge-sm bg-primary-subtle text-primary me-2">
                          <i class="fa-solid fa-history"></i>
                        </span>
                        <span class="text-muted">
                          At least 1 month of transaction history
                        </span>
                      </li>
                      <li class="d-flex align-items-center">
                        <span class="badge badge-sm bg-danger-subtle text-danger me-2">
                          <i class="fa-solid fa-ban"></i>
                        </span>
                        <span class="text-muted">
                          Do not allow password-protected or cropped screenshot
                          uploads
                        </span>
                      </li>
                    </ul>
                  </div>
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
                onClick={() => setStep("uploadBankStatement")}
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
      ) : step == "uploadBankStatement" ? (
        <div
          className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-90 `}
        >
          <div
            className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
            style={{ border: "1px solid #373737" }}
          >
            <div className="d-flex justify-content-between">
              <button
                onClick={() => setStep("uploadBankStatementinfo")}
                className="btn btn-outline-dark"
              >
                <i className="fa fa-arrow-left"></i>
              </button>
              {bankDocument && bankDocument != "" && (
                <button
                  onClick={() => setStep("questionariesData")}
                  className="btn btn-outline-dark"
                >
                  <i className="fa fa-arrow-right"></i>
                </button>
              )}
            </div>
            <div className="d-flex flex-column align-items-start  p-3">
              <div className="d-flex gap-4 p-3 w-100">
                <div className="d-flex flex-column gap-2 text-center w-100">
                  <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                    Step 4 / 5
                  </h5>
                  <h3 className="fw-semibold">Upload Bank Statement</h3>
                </div>
              </div>

              <div className="w-100 d-flex align-items-center w-100 flex-column gap-4 ">
                <div className="bg-light rounded-5 w-100 p-4 text-center">
                  {bankDocument?.length > 0 ? (
                    bankDocument.map((doc, index) => {
                      console.log(bankDocument.length);
                      {
                        bankDocument.length;
                      }
                      return (
                        <img
                          src={"/images/file.png"}
                          className="img-fluid"
                          width={100}
                          alt={doc?.imageURL}
                        />
                      );
                    })
                  ) : (
                    <img
                      src={"/images/documentdummy.svg"}
                      className="img-fluid"
                      width={250}
                      alt=""
                    />
                  )}
                </div>
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
                  <div>
                    {!bankDocument ? (
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
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex justify-content-center gap-2">
                          <label
                            htmlFor={"image"}
                            className="btn btn-lg btn-outline-dark"
                            onClick={() => {
                              setBackDocument("");
                            }}
                          >
                            <i className="fa fa-recycle"></i>
                            Re-upload Document
                          </label>
                          <label
                            htmlFor={"image"}
                            className="btn btn-lg btn-primary"
                            // onClick={() => setStep("questionariesData")}
                          >
                            Add More
                          </label>
                        </div>
                        <button
                          className="btn btn-lg btn-primary"
                          onClick={() => setStep("questionariesData")}
                        >
                          Confirm
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                      id={"image"}
                      name={"image"}
                      className="form-control d-none"
                      onChange={async (e) => {
                        setLoading(true);
                        const file = e.target.files[0];

                        if (file.type === "application/pdf") {
                          const isProtected = await isFileProtected(file);

                          if (isProtected) {
                            setShowPdfPasswordModal("open");
                            setProtectedFile(file);
                            setLoading(false);
                            return;
                          }
                        }

                        const formData = new FormData();
                        formData.append("image", file);
                        formData.append("password", "");
                        formData.append("verificationId", verification?._id);

                        try {
                          // Send the image file to the server via an API endpoint
                          const response = await APITemplate(
                            // "user/updateBankStatement",
                            "user/updateMultifilesBankStatement",
                            "POST",
                            formData
                          );
                          if (response.success == true) {
                            setStep("uploadBankStatement");
                            setBankDocument(
                              response?.data?.length &&
                                response?.data.find(
                                  (item) => item.type == "BANK_STATEMENT"
                                ).files
                            );
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
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : step == "questionariesData" ? (
        <div
          className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-90 `}
        >
          <div
            className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
            style={{ border: "1px solid #373737" }}
          >
            <div>
              <button
                onClick={() => setStep("uploadBankStatement")}
                className="btn btn-outline-dark"
              >
                <i className="fa fa-arrow-left"></i>
              </button>
            </div>
            <div className="d-flex flex-column align-items-start gap-3 p-3 pt-0">
              <div className="d-flex gap-4 w-100 p-3 pb-0">
                <div className="d-flex flex-column gap-2 text-center w-100">
                  <h5 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
                    Step 5 / 5
                  </h5>
                  <h3 className="fw-semibold">Questionaries</h3>
                </div>
              </div>

              <div className="w-100 d-flex align-items-center w-100 flex-column gap-3">
                <div className="w-100">
                  <label htmlFor="transactionPurpose">
                    {errors.includes("transactionPurpose") ? (
                      <span className="text-danger">
                        Transaction Purpose is required
                      </span>
                    ) : (
                      "Transaction Purpose"
                    )}
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg w-100"
                    placeholder="Transaction Purpose"
                    name="transactionPurpose"
                    value={questionaries?.transactionPurpose}
                    onChange={(e) => handleQuestionariesData(e)}
                  />
                </div>
                <div className="w-100">
                  <label htmlFor="transactionAmount">
                    {errors.includes("transactionAmount") ? (
                      <span className="text-danger">
                        Transaction Amount is required above 2000 USD or 200000
                        INR
                      </span>
                    ) : (
                      "Transaction Amount"
                    )}
                  </label>
                  <div className="input-group flex-nowrap align-items-end">
                    <input
                      type="number"
                      className="form-control w-75 flex-fill "
                      placeholder="Transaction Amount"
                      name="transactionAmount"
                      value={questionaries?.transactionAmount}
                      onChange={(e) => handleQuestionariesData(e)}
                    />
                    {/* Select button here */}
                    <select
                      className="form-select w-auto mt-3"
                      aria-label=".form-select-lg example"
                      name="transactionType"
                      value={questionaries?.transactionType}
                      onChange={(e) => handleQuestionariesData(e)}
                    >
                      <option value="INR">₹</option>
                      <option value="USD">$</option>
                    </select>
                  </div>
                </div>
                <div className="w-100">
                  <label htmlFor="isSufficientFunds">
                    {errors.includes("isSufficientFunds") ? (
                      <span className="text-danger">
                        Does your account have sufficient funds? <b>Required</b>
                      </span>
                    ) : (
                      "Does your account have sufficient funds? "
                    )}
                  </label>
                  <div className="d-flex align-items-center gap-4 mt-2">
                    <button
                      className={`btn btn-lg px-5 ${
                        questionaries?.isSufficientFunds
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() =>
                        handleQuestionariesData({
                          target: { name: "isSufficientFunds", value: true },
                        })
                      }
                    >
                      Yes
                    </button>
                    <button
                      className={`btn btn-lg px-5 ${
                        !questionaries?.isSufficientFunds
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() =>
                        handleQuestionariesData({
                          target: { name: "isSufficientFunds", value: false },
                        })
                      }
                    >
                      No
                    </button>
                  </div>
                </div>
                <div className="mt-4 d-flex flex-wrap w-100 align-items-center gap-4">
                  <div className="flex-fill">
                    <label
                      htmlFor={"document"}
                      className="btn btn-outline-dark btn-lg w-100"
                      onClick={() => {
                        setStep("identityVerification");
                      }}
                    >
                      Retry
                    </label>
                  </div>
                  <button
                    disabled={loading}
                    onClick={handleQuestionaries}
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
      ) : step == "completed" ? (
        <div
          className={`row align-items-center bg-warning-subtle justify-content-center rounded-5 shadow min-vh-90 `}
        >
          <div
            className="col-md-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
            style={{ border: "1px solid #373737" }}
          >
            {/* <div>
              <button
                onClick={() => setStep("questionariesData")}
                className="btn btn-outline-dark"
              >
                <i className="fa fa-arrow-left"></i>
              </button>
            </div> */}
            <div className="d-flex flex-column align-items-start gap-4 p-3 ">
              <div className="d-flex gap-4 p-3 pb-0 w-100 py-0">
                <div className="d-flex flex-column gap-2 text-center w-100">
                  <h3 className="fw-semibold">Verification Under Reveiw</h3>
                  <p>
                    Your application has been submitted and is under review.
                    You'll be notified once the verification is complete
                  </p>
                </div>
              </div>
              <div className="w-100 d-flex align-items-start w-100 flex-column gap-5 ">
                <div>
                  Profile :{" "}
                  {verification?.verifications?.profile?.verified ===
                  "pending" ? (
                    <span className="badge bg-warning">Pending</span>
                  ) : verification?.verifications?.profile?.verified ===
                    "rejected" ? (
                    <span className="badge bg-danger">Rejected</span>
                  ) : verification?.verifications?.profile?.verified ===
                    "approved" ? (
                    <span className="badge bg-success">Approved</span>
                  ) : (
                    <span className="badge bg-secondary">Not Verified</span>
                  )}
                  {verification?.verifications?.profile?.verified ===
                    "rejected" &&
                    verification?.verifications?.profile?.decline_reasons && (
                      <>
                        <p className="text-danger my-2 flex-nowrap">
                          {
                            verification?.verifications?.profile
                              ?.decline_reasons
                          }
                        </p>
                        <button
                          disabled={loading}
                          onClick={ApplyReVerification}
                          className="btn btn-sm btn-danger"
                        >
                          Reverify
                        </button>
                      </>
                    )}
                </div>

                {verification?.applicant?.documents.map((doc) => {
                  return (
                    <div>
                      {doc?.type} :{" "}
                      {doc?.status === "pending" ? (
                        <span className="badge bg-warning">Pending</span>
                      ) : doc?.status === "rejected" ? (
                        <span className="badge bg-danger">Rejected</span>
                      ) : doc?.status === "approved" ? (
                        <span className="badge bg-success">Approved</span>
                      ) : (
                        <span className="badge bg-secondary">Not Verified</span>
                      )}
                      {doc?.status === "rejected" && (
                        <>
                          <p className="text-danger my-2 flex-nowrap">
                            {doc?.comment}
                          </p>
                          <button
                            disabled={loading}
                            onClick={ApplyReVerification}
                            className="btn btn-sm btn-danger"
                          >
                            Reverify
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
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
  );
}
