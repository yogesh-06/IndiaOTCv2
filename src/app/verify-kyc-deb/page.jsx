"use client";
import Footer from "@/component/Footer";
import { checkUserCountry, checkUserVPNValid } from "@/component/global";
import Header from "@/component/Header";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

const KYC = () => {
  const [verId, setVerId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    async function getUserCheck() {
      // let isValidUser = await checkUserVPNValid();
      // let isValidCountry = await checkUserCountry();
      // if (!isValidCountry) {
      //   enqueueSnackbar("We are not available in your country", {
      //     variant: "error",
      //   });
      //   setLoading(false);
      //   setTimeout(() => {
      //     router.push("/");
      //   }, 1500);
      //   return;
      // }
      // if (!isValidUser) {
      //   router.push("/403");
      //   return;
      // }
    }
    // getUserCheck();
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const searchParams = params.get("v");

    const search = searchParams;
    const v = search;
    if (!v) {
      const apiUrl =
        "https://kyc-api.amlbot.com/forms/12a066f701da814d311bb086a8604f09c82a/urls";
      const usrId = new Date().getTime();
      const postData = { external_applicant_id: usrId };

      fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: "Token 495f4b2c1e80f249df19ee031776cdfeeb3a",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .then((data) => {
          const formToken = data.form_token;
          window.location.href = `verify-kyc?v=${formToken}`;
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError(err.message);
        });
    } else {
      setVerId(v);
      setLoading(false);
    }
  }, []);
  return (
    <>
      <Header currentLang={"en"} />

      <section className="bg-light ">
        {loading == true ? (
          <h1 className="text-center heading02 py-5">Loading PLease Wait...</h1>
        ) : (
          <iframe
            className="w-100 "
            allow="microphone *;camera *;midi *;encrypted-media *;clipboard-read;clipboard-write;"
            style={{ height: "1000px" }}
            src={`https://kyc-forms-new.amlbot.com/${verId}`}
          ></iframe>
        )}
      </section>

      <Footer language={"en"} />
    </>
  );
};

export default KYC;
