"use client";
import { APITemplate } from "@/component/API/Template";
import CustomSelect from "@/component/CustomSelect";
import { getGeoDetails } from "@/component/global";
import { useLoader } from "@/context/LoaderProvider";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

export default function Verification() {
  const router = useRouter();
  const { loader, setLoader, isMobile } = useLoader();
  const { user } = useUser();
  useEffect(() => {
    if (user && user?._id) {
      setLoader(false);
    } else {
      setLoader(true);
    }
  }, [user]);

  useEffect(() => {
    if (user?.enhanceVerification) {
      if (
        user?.riskLevel == "high" ||
        user?.riskLevel == "medium" ||
        user?.status == "pending" ||
        (user?.documentStatus == "pending" &&
          user?.kycStatus == "pending" &&
          user?.facialStatus == "pending")
      ) {
        router.push("/kyc");
      } else if (
        user?.riskLevel == "low" &&
        (user?.enhanceVerification == "processing" ||
          user?.enhanceVerification == "rejected")
      ) {
        // Code if needed
      } else {
        router.push("/kyc");
      }
    }
  }, [user]);

  return (
    <>
      <iframe
        src={`https://kyc-forms-new.amlbot.com/${user?.formTokenEnhanceVerification}`}
        style={{ width: "100%", height: "110vh", border: "none" }}
        className="shadow rounded-4"
      ></iframe>
    </>
  );
}
