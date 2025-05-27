"use client";
import { APITemplate } from "@/component/API/Template";
import Footer from "@/component/Footer";
// import { getGeoDetails } from "@/component/global";
import Header from "@/component/Header";
import Completed from "@/component/kyc/Completed";
import Declaration from "@/component/kyc/Declaration";
import InitVefirication from "@/component/kyc/InitVefirication";
import LivenessVerification from "@/component/kyc/LivenessVerification";
import Questionaries from "@/component/kyc/Questionaries";
import UploadDocument from "@/component/kyc/UploadDocument";
import Stepper from "@/component/Stepper";
import { useLoader } from "@/context/LoaderProvider";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import OnboardingType from "./OnboardingType";
import BusinessInformation from "@/component/kyb/businessInformation";
import ApplicantType from "@/component/kyb/ApplicantType";
import UploadBusinessDocs from "@/component/kyb/UploadBusinessDocs";
import Personalnformation from "@/component/kyb/Personalnformation";
import UploadPersonalDocs from "@/component/kyb/UploadPersonalDocs";

export default function Verification() {
  const router = useRouter();
  const { user } = useUser();
  const { setLoader } = useLoader();
  const [data, setData] = useState({});
  const [step, setStep] = useState("");
  const [stepsCompleted, setStepsCompleted] = useState({});
  const [verification, setVerification] = useState({});
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState({});

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
    if (user && user?._id) {
      setStepsCompleted({
        ...stepsCompleted,
        email: user?.email,
        phone: verification?.applicant?.phone,
        identification:
          verification?.applicant?.documents?.length > 0 &&
          verification?.applicant?.documents?.[0]?.front_side &&
          verification?.applicant?.documents?.[0]?.back_side
            ? true
            : false,
        questionaries:
          verification?.applicant?.questionaries?.length > 0 ? true : false,
        declaration: verification?.applicant?.declaration ? true : false,
      });
      setLoader(false);
    } else {
      setLoader(true);
    }
  }, [user, verification, step]);

  useEffect(() => {
    async function getCountries() {
      // const geoDetails = await getGeoDetails();
      let countrySet = {
        label: "UAE",
        value: "AE",
      };

      setCountry(countrySet);
      let response = await APITemplate("user/getAllCountries", "GET");
      setCountries(response.data);
    }
    getCountries();
  }, []);

  useEffect(() => {
    async function initStep() {
      if (!user?._id) return;
      let verificationResult = {};
      if (user.lastVerificationId) {
        verificationResult = await getVerification(user.lastVerificationId);
      }
      if (
        ["high", "medium"].includes(user.riskLevel) ||
        user.status !== "pending"
      ) {
        router.push("/kyc");
        return;
      }

      if (user?.type) {
        const updatedData = {
          onboardingType: user?.type,
        };
        if (user?.type == "individual") {
          if (user.phone) {
            updatedData.phone = user.phone;
            updatedData.telegramUsername = user.telegramUsername;

            if (
              user.nationalityCountry &&
              verificationResult?.applicant?.documents?.length > 0
            ) {
              const doc = verificationResult.applicant.documents[0];

              updatedData.documentType = doc.type;
              updatedData.documentFrontSide = doc.front_side;
              updatedData.documentBackSide = doc.back_side;
              updatedData.panCard =
                verification?.applicant?.documents?.length > 1 &&
                verification?.applicant?.documents.find(
                  (item) => item.type == "PANCARD"
                )?.portrait;
              updatedData.bankStatement =
                verification?.applicant?.documents.find(
                  (item) => item.type == "BANK_STATEMENT"
                )?.files;
              updatedData.nationalityCountry = user.nationalityCountry;

              if (doc.front_side && doc.back_side) {
                if (verificationResult.applicant.questionaries) {
                  updatedData.questionaries =
                    verificationResult.applicant.questionaries;

                  if (verificationResult.applicant.declaration) {
                    updatedData.declaration =
                      verificationResult.applicant.declaration;
                    setStep("completed");
                  } else {
                    setStep("questionaries");
                  }
                } else {
                  setStep("questionaries");
                }
              } else {
                setStep("uploadDocument");
              }
            } else {
              setStep("uploadDocument");
            }

            // setData((prev) => ({ ...prev, ...updatedData }));
          } else {
            setStep("initVerification");
          }
        }

        if (user?.type == "company") {
          if (verificationResult.applicant.applicantType) {
            updatedData.applicantType =
              verificationResult.applicant.applicantType;
            if (verificationResult.applicant.businessInfo) {
              updatedData.businessInfo =
                verificationResult.applicant.businessInfo;
              if (verificationResult.applicant.businessDocuments) {
                updatedData.businessDocuments =
                  verificationResult.applicant.businessDocuments;
              } else {
                setStep("uploadBusinessDocs");
              }
            } else {
              setStep("businessInfo");
            }
          } else {
            setStep("applicantType");
          }
        }
        setData((prev) => ({ ...prev, ...updatedData }));
      } else {
        setStep("onboardingType");
      }
    }
    initStep();
  }, [user]);

  useEffect(() => {
    if (!verification?.applicant) return;
    const updatedData = {};

    if (user?.type) {
      updatedData.onboardingType = user.type;
      updatedData.telegramUsername = user.telegramUsername;
      updatedData.nationalityCountry = user?.nationalityCountry;
    }

    if (user?.phone) {
      updatedData.phone = user.phone;
      updatedData.telegramUsername = user.telegramUsername;
      updatedData.nationalityCountry = user?.nationalityCountry;
    }

    if (verification.applicant.documents?.length > 0) {
      const doc = verification.applicant.documents[0];
      updatedData.documentType = doc.type;
      updatedData.documentFrontSide = doc.front_side;
      updatedData.documentBackSide = doc.back_side;
      updatedData.panCard =
        verification?.applicant?.documents?.length > 1 &&
        verification?.applicant?.documents.find(
          (item) => item.type == "PANCARD"
        )?.portrait;
      updatedData.bankStatement = verification?.applicant?.documents.find(
        (item) => item.type == "BANK_STATEMENT"
      )?.files;
    }

    if (verification.applicant.questionaries?.length > 0) {
      updatedData.questionaries = verification.applicant.questionaries;
    }

    if (verification.applicant.declaration) {
      updatedData.declaration = verification.applicant.declaration;
    }

    setData((prev) => ({ ...prev, ...updatedData }));
  }, [verification]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setStep("uploadPersonalDocs"); //
  //   }, 2000);
  // });

  return (
    <div className="">
      <Header />

      <div
        className="d-flex flex-column align-items-center justify-content-center gap-4 min-vh-90"
        style={{
          position: "relative",
          padding: "20px",
          color: "#000",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg,rgb(3, 101, 193) -10%, #BB34CF 80%, #C70FC4 10%)",
            filter: "blur(600px)",
            zIndex: -1, // Place the blurred background behind the content
          }}
        />
        <SnackbarProvider />
        <Stepper currentStep={step} data={stepsCompleted} />

        {step == "onboardingType" ? (
          <OnboardingType
            data={data}
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : // KYC Steps
        step == "initVerification" ? (
          <InitVefirication
            data={data}
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "uploadDocument" ? (
          <UploadDocument
            data={data}
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : // KYB Steps
        step == "applicantType" ? (
          <ApplicantType
            data={data}
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "businessInfo" ? (
          <BusinessInformation
            data={data}
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "uploadBusinessDocs" ? (
          <UploadBusinessDocs
            data={data}
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "personalInfo" ? (
          <Personalnformation
            data={data}
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "uploadPersonalDocs" ? (
          <UploadPersonalDocs
            data={data}
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "questionaries" ? (
          <Questionaries
            data={data}
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "declaration" ? (
          <Declaration
            data={data}
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "completed" ? (
          <Completed
            // data={data}
            setStep={setStep}
            verification={verification}
            // getVerification={getVerification}
          />
        ) : (
          <div className="vh-100 d-flex align-items-center justify-content-center vw-100 bg-white">
            <h2>
              <span className="spinner-border text_Primary_500 me-3"></span>
              Loading ...
            </h2>
          </div>
        )}
        <div className="text-center d-md-none mb-4">
          <img
            src="/images/logo-watermark-png.png"
            className="img-fluid"
            width={230}
            alt=""
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
