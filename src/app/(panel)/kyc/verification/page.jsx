"use client";
import { APITemplate } from "@/component/API/Template";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import ApplicantType from "@/component/kyb/ApplicantType";
import BusinessInformation from "@/component/kyb/businessInformation";
import Personalnformation from "@/component/kyb/Personalnformation";
import UploadBusinessDocs from "@/component/kyb/UploadBusinessDocs";
import UploadPersonalDocs from "@/component/kyb/UploadPersonalDocs";
import Completed from "@/component/kyc/Completed";
import Declaration from "@/component/kyc/Declaration";
import InitVefirication from "@/component/kyc/InitVefirication";
import Questionaries from "@/component/kyc/Questionaries";
import UploadDocument from "@/component/kyc/UploadDocument";
import Stepper from "@/component/Stepper";
import { useLoader } from "@/context/LoaderProvider";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import OnboardingType from "./OnboardingType";

export default function Verification() {
  const router = useRouter();
  const { user } = useUser();
  const { setLoader } = useLoader();
  const [step, setStep] = useState("");
  const [userData, setUserData] = useState({});
  const [stepsCompleted, setStepsCompleted] = useState({});
  const [verification, setVerification] = useState({});

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
      setUserData(user);

      setStepsCompleted({
        ...stepsCompleted,
        email: user?.email,
        type: user?.type,
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
      const doc =
        verificationResult?.applicant?.documents?.length > 0 &&
        verificationResult?.applicant?.documents.find(
          (item) => item.type == "GOVERNMENT_ID"
        );
      const PANDoc =
        verificationResult?.applicant?.documents?.length > 0 &&
        verificationResult?.applicant?.documents.find(
          (item) => item.type == "PANCARD"
        );
      const businessDocs =
        verificationResult?.applicant?.documents?.length > 0 &&
        verificationResult?.applicant?.documents.filter(
          (item) => item.type.includes("BUSINESS_") && item
        );

      if (user?.type) {
        if (user?.type == "individual") {
          if (user.phone) {
            if (doc?.front_side && doc?.back_side) {
              if (verificationResult.applicant.questionaries) {
                if (verificationResult.applicant.declaration) {
                  setStep("completed");
                } else {
                  setStep("declaration");
                }
              } else {
                setStep("questionaries");
              }
            } else {
              setStep("uploadDocument");
            }
          } else {
            setStep("initVerification");
          }
        }

        if (user?.type == "company") {
          if (verificationResult.applicant.applicantType) {
            if (verificationResult.applicant.businessInfo) {
              if (businessDocs && businessDocs.length > 0) {
                if (user?.fullName && user?.gender && user?.address) {
                  if (doc?.front_side && doc?.back_side && PANDoc?.portrait) {
                    if (verificationResult.applicant.questionaries) {
                      if (verificationResult.applicant.declaration) {
                        setStep("completed");
                      } else {
                        setStep("declaration");
                      }
                    } else {
                      setStep("questionaries");
                    }
                  } else {
                    setStep("uploadPersonalDocs");
                  }
                } else {
                  setStep("personalInfo");
                }
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
      } else {
        setStep("onboardingType");
      }
    }
    initStep();
  }, [user]);

  // useEffect(() => {
  // setTimeout(() => {
  // setStep("uploadPersonalDocs"); //
  // }, 2000);
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
            user={userData}
            setStep={setStep}
            getVerification={getVerification}
          />
        ) : // KYC Steps
        step == "initVerification" ? (
          <InitVefirication
            user={userData}
            setStep={setStep}
            verification={verification}
          />
        ) : step == "uploadDocument" ? (
          <UploadDocument
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : // KYB Steps
        step == "applicantType" ? (
          <ApplicantType
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "businessInfo" ? (
          <BusinessInformation
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "uploadBusinessDocs" ? (
          <UploadBusinessDocs
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "personalInfo" ? (
          <Personalnformation
            user={user}
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "uploadPersonalDocs" ? (
          <UploadPersonalDocs
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "questionaries" ? (
          <Questionaries
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "declaration" ? (
          <Declaration
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
          />
        ) : step == "completed" ? (
          <Completed
            setStep={setStep}
            verification={verification}
            getVerification={getVerification}
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
