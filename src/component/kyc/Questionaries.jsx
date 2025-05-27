"use client";
import React, { useEffect, useState } from "react";
import { APITemplate } from "../API/Template";
import FileUploadBase64 from "./FileUploadBase64";

const paymentOptions = ["IMPS", "NEFT", "RTGS", "UPI", "Cash"];
const frequencyOptions = ["One-time", "Occasional", "Regular"];
const volumnOptions = ["INR50K-5L", "INR5L-25L", "INR25L+"];
const purposeOptions = ["Investment", "Remittance", "Business", "Other"];
const sourceFundOptions = ["Salary", "Business", "Savings", "Other"];
const productDiscoveryOptions = [
  "Binance",
  "OKX",
  "Bybit",
  "Bitget",
  "KuCoin",
  "HTX",
  "Paxful",
  "Other",
];
const priorExperienceOptions = ["Yes", "No"];

const Questionaries = ({ setStep, verification }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [stepQ, setStepQ] = useState("start");
  const [count, setCount] = useState(0);
  const [section, setSection] = useState("productInterest");

  const [productInterest, setProductInterest] = useState({
    question: "Choose your product interest:",
    answer: "",
    answerLabel: "",
    type: "productInterest",
  });
  const [paymentMethodBuy, setPaymentMethodBuy] = useState({
    question: "Preferred Payment / Settlement Method",
    answer: "",
    answerLabel: "",
    type: "paymentMethod",
  });
  const [paymentMethodSell, setPaymentMethodSell] = useState({
    question: "Preferred Payment / Settlement Method",
    answer: [],
    answerLabel: "",
    type: "paymentMethod",
  });
  const [frequency, setFrequency] = useState({
    question: "Frequency:",
    answer: "",
    answerLabel: "",
    type: "frequency",
  });
  const [volume, setVolume] = useState({
    question: "What is your expected transaction volume?",
    answer: "",
    answerLabel: "",
    type: "volume",
  });
  const [purpose, setPurpose] = useState({
    question: "What is the purpose of your transaction?",
    answer: "",
    answerLabel: "",
    type: "purpose",
  });
  const [sourceFund, setSourceFund] = useState({
    question: "What is the source of the funds used for this transaction?",
    answer: "",
    answerLabel: "",
    type: "sourceFund",
  });
  const [priorExperience, setPriorExperience] = useState({
    question: "Do you have any prior experience?",
    answer: "",
    answerLabel: "",
    type: "priorExperience",
  });
  const [platformDiscovery, setPlatformDiscovery] = useState({
    question: "Which platform do you want to discover specifically?",
    answer: "",
    answerLabel: "",
    type: "platformDiscovery",
  });

  useEffect(() => {
    if (verification?.applicant?.questionaries?.length > 0) {
      const productInterestData = verification.applicant.questionaries.find(
        (data) => data.type === "productInterest"
      );

      if (productInterestData) {
        setProductInterest(productInterestData);
        if (
          verification?.applicant?.questionaries.find(
            (data) => data.type === "productInterest"
          ).answer === "sell"
        ) {
          setStepQ("paymentMethodSell");
        } else if (
          verification?.applicant?.questionaries.find(
            (data) => data.type === "productInterest"
          ).answer === "buy"
        ) {
          setStepQ("paymentMethodBuy");
        } else {
          // setStepQ("priorExperience");
        }
        setCount(1);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "paymentMethod"
        )
      ) {
        if (productInterestData.answer == "buy") {
          setPaymentMethodBuy(
            verification?.applicant?.questionaries.find(
              (data) => data.type === "paymentMethod"
            )
          );
        } else if (productInterestData.answer == "sell") {
          setPaymentMethodSell(
            verification?.applicant?.questionaries.find(
              (data) => data.type === "paymentMethod"
            )
          );
        }
        setStepQ("frequency");
        setCount(2);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "frequency"
        )
      ) {
        setFrequency(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "frequency"
          )
        );
        if (productInterestData.answer === "buy") {
          setStepQ("volume");
        } else {
          setStepQ("priorExperience");
        }
        setCount(3);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "volume"
        )
      ) {
        setVolume(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "volume"
          )
        );
        setStepQ("purpose");
        setCount(4);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "purpose"
        )
      ) {
        setPurpose(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "purpose"
          )
        );
        setStepQ("sourceFund");
        setCount(5);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "sourceFund"
        )
      ) {
        setSourceFund(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "sourceFund"
          )
        );
        setStepQ("priorExperience");
        setCount(6);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "priorExperience"
        )
      ) {
        setPriorExperience(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "priorExperience"
          )
        );
        setSection("platformDiscovery");
        setCount(productInterestData.answer === "buy" ? 7 : 4);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "platformDiscovery"
        )
      ) {
        setPlatformDiscovery(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "platformDiscovery"
          )
        );
        setStep("declaration");
        // setCount(productInterestData.answer === "buy" ? 7 : 4);
      }
    }
  }, []);

  const handleQuestionaries = async (data, nextStep) => {
    setErrors([]);
    setLoading(true);
    if (!data?.answer || data?.answer == "") {
      setErrors(["Please fill required fields"]);
      setLoading(false);
      return;
    }
    // return;
    const formData = new FormData();
    formData.append("verificationId", verification?._id);
    formData.append("question", JSON.stringify(data));

    try {
      const response = await APITemplate(
        "user/updateQuestionaries",
        "POST",
        formData
      );
      if (response.success) {
        // await getVerification(verification?._id);
        if (nextStep == "platformDiscovery") {
          setSection(nextStep);
          return;
        }
        if (nextStep == "end") {
          setStep("declaration");
          return;
        }
        setStepQ(nextStep);
      } else {
        console.error(response.message);
        setErrors([response.message]);
      }
    } catch (error) {
      console.error("Error uploading questionaries:", error);
      setErrors(["Error uploading questionaries"]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (stepQ == "start") {
      setCount(1);
    } else if (stepQ == "paymentMethodBuy") {
      setCount(2);
    } else if (stepQ == "paymentMethodSell") {
      setCount(2);
    } else if (stepQ == "frequency") {
      setCount(3);
    } else if (stepQ == "volume") {
      setCount(4);
    } else if (stepQ == "purpose") {
      setCount(5);
    } else if (stepQ == "sourceFund") {
      setCount(6);
    } else if (stepQ == "priorExperience") {
      setCount(productInterest.answer == "buy" ? 7 : 4);
      // setCount(7);
    }
  }, [stepQ]);

  return (
    <div className="row align-items-start justify-content-center w-100">
      <div className="col-md-6 rounded-5 bg-white shadow-lg p-4 my-md-5">
        <div className="container">
          <div className="d-flex flex-column gap-3 py-3">
            <div className="d-flex justify-content-start align-items-center gap-3">
              <button
                className="btn border_primary text_Primary_500 p-3"
                style={{ backgroundColor: "rgba(127, 86, 217, 0.1)" }}
                onClick={() => setStep("uploadDocument")}
              >
                <i className="fa-solid fa-chevron-left fa-lg"></i>
              </button>
              <h4 className="fw-bold mb-0">Questionaries</h4>
            </div>
            <div className="arrow-line mt-2" />
            <div className="my-3">
              <div className="progress rounded-2" style={{ height: "14px" }}>
                <div
                  className="progress-bar Primary_500"
                  role="progressbar"
                  style={{
                    // width: `${((history.length + 1) / 5) * 100}%`,
                    width: `${
                      (count / (productInterest.answer === "buy" ? 7 : 4)) * 100
                    }%`,
                  }}
                  aria-valuenow={count + 1}
                  // aria-valuenow={history.length + 1}
                  aria-valuemin="0"
                  aria-valuemax="7"
                ></div>
              </div>
            </div>
          </div>

          {errors.length > 0 &&
            errors.map((e) => (
              <p key={e} className="text-danger">
                {e}
              </p>
            ))}
          <h4 className="fw-light text-secondary p-1 badge bg-primary px-3 py-2 w-fit text-white mx-auto fw-bold">
            {section === "productInterest"
              ? "Product Interest"
              : section === "platformDiscovery"
              ? "Platform Discovery"
              : ""}
          </h4>
          <div className={section === "platformDiscovery" && "d-none"}>
            {stepQ == "start" ? (
              <>
                <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                  <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                    <span
                      className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                      style={{ width: "32px", height: "32px" }}
                    >
                      1
                    </span>
                    {productInterest.question}
                  </p>

                  <div className="fs-5 text_Primary_700 py-3 ps-5">
                    <div className="row justify-content-start align-items-center gy-3">
                      <div className="col-md-6">
                        <div
                          className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                            productInterest.answer === "buy"
                              ? "bg-primary text-white"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              productInterest.answer === "buy"
                                ? "#7F56D9"
                                : "rgba(127, 86, 217, 0.1)",
                          }}
                          onClick={() =>
                            setProductInterest((prev) => ({
                              ...prev,
                              answer: "buy",
                              answerLabel: "Buying Crypto",
                            }))
                          }
                        >
                          <input
                            type="radio"
                            checked={productInterest.answer === "buy"}
                            readOnly
                            className="form-check-input my-2 Primary _500"
                          />
                          <small className="text-nowrap">Buying Crypto</small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div
                          className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                            productInterest.answer === "sell"
                              ? "bg-primary text-white"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              productInterest.answer === "sell"
                                ? "#7F56D9"
                                : "rgba(127, 86, 217, 0.1)",
                          }}
                          onClick={() =>
                            setProductInterest((prev) => ({
                              ...prev,
                              answer: "sell",
                              answerLabel: "Selling Crypto",
                            }))
                          }
                        >
                          <input
                            type="radio"
                            checked={productInterest.answer === "sell"}
                            readOnly
                            className="form-check-input my-2 Primary _500"
                          />
                          <small className="text-nowrap">Selling Crypto</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end align-items-center px-2 pt-4">
                  {/* <div
                  className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                  onClick={() => setStepQ("start")}
                >
                  Previous
                </div> */}
                  <div
                    className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                    onClick={() =>
                      handleQuestionaries(
                        productInterest,
                        productInterest?.answer === "buy"
                          ? "paymentMethodBuy"
                          : "paymentMethodSell"
                      )
                    }
                  >
                    Continue
                  </div>
                </div>
              </>
            ) : stepQ == "paymentMethodBuy" ? (
              <>
                <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                  <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                    <span
                      className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                      style={{ width: "32px", height: "32px" }}
                    >
                      2
                    </span>
                    {paymentMethodBuy.question}
                  </p>

                  <div className="fs-5 text_Primary_700 py-3 ps-5">
                    <div className="row justify-content-start align-items-center gy-3">
                      {paymentOptions.map((option) => {
                        const isSelected =
                          paymentMethodBuy.answer.includes(option);

                        return (
                          <div key={option} className="col-md-6">
                            <div
                              className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                                isSelected ? "bg-primary text-white" : ""
                              }`}
                              style={{
                                backgroundColor: isSelected
                                  ? "#7F56D9"
                                  : "rgba(127, 86, 217, 0.1)",
                              }}
                              onClick={() => {
                                setPaymentMethodBuy((prev) => {
                                  const updatedAnswers = isSelected
                                    ? prev.answer.filter(
                                        (item) => item !== option
                                      ) // remove
                                    : [...prev.answer, option]; // add

                                  return {
                                    ...prev,
                                    answer: updatedAnswers,
                                    answerLabel: option,
                                  };
                                });
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="form-check-input my-2 Primary _500"
                              />
                              <small className="text-nowrap">{option}</small>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                  <div
                    className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                    onClick={() => {
                      // setPaymentMethodBuy((prev) => ({
                      //   ...prev,
                      //   answer: "",
                      //   answerLabel: "",
                      // }));
                      setStepQ("start");
                    }}
                  >
                    Previous
                  </div>
                  <div
                    className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                    onClick={() =>
                      handleQuestionaries(paymentMethodBuy, "frequency")
                    }
                  >
                    Continue
                  </div>
                </div>
              </>
            ) : stepQ == "paymentMethodSell" ? (
              <>
                <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                  <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                    <span
                      className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                      style={{ width: "32px", height: "32px" }}
                    >
                      2
                    </span>
                    {paymentMethodSell.question}
                  </p>

                  <div className="fs-5 text_Primary_700 py-3 ps-5">
                    <div className="row justify-content-start align-items-center gy-3">
                      {paymentOptions.map((option) => {
                        const isSelected =
                          paymentMethodSell.answer.includes(option);

                        return (
                          <div key={option} className="col-md-6">
                            <div
                              className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                                isSelected ? "bg-primary text-white" : ""
                              }`}
                              style={{
                                backgroundColor: isSelected
                                  ? "#7F56D9"
                                  : "rgba(127, 86, 217, 0.1)",
                              }}
                              onClick={() => {
                                setPaymentMethodSell((prev) => {
                                  const updatedAnswers = isSelected
                                    ? prev.answer.filter(
                                        (item) => item !== option
                                      ) // remove
                                    : [...prev.answer, option]; // add

                                  return {
                                    ...prev,
                                    answer: updatedAnswers,
                                    answerLabel: option,
                                  };
                                });
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="form-check-input my-2 Primary _500"
                              />
                              <small className="text-nowrap">{option}</small>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                  <div
                    className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                    onClick={() => {
                      // setPaymentMethodSell((prev) => ({
                      //   ...prev,
                      //   answer: "",
                      //   answerLabel: "",
                      // }));
                      setStepQ("start");
                    }}
                  >
                    Previous
                  </div>
                  <div
                    className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                    onClick={() =>
                      handleQuestionaries(paymentMethodSell, "frequency")
                    }
                  >
                    Continue
                  </div>
                </div>
              </>
            ) : stepQ == "frequency" ? (
              <>
                <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                  <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                    <span
                      className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                      style={{ width: "32px", height: "32px" }}
                    >
                      3
                    </span>
                    {frequency.question}
                  </p>

                  <div className="fs-5 text_Primary_700 py-3 ps-5">
                    <div className="row justify-content-start align-items-center gy-3">
                      {frequencyOptions.map((option) => {
                        const isSelected = frequency.answer === option;

                        return (
                          <div key={option} className="col-md-6">
                            <div
                              className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                                isSelected ? "bg-primary text-white" : ""
                              }`}
                              style={{
                                backgroundColor: isSelected
                                  ? "#7F56D9"
                                  : "rgba(127, 86, 217, 0.1)",
                              }}
                              onClick={() =>
                                setFrequency((prev) => ({
                                  ...prev,
                                  answer: option,
                                  answerLabel: option,
                                }))
                              }
                            >
                              <input
                                type="radio"
                                checked={isSelected}
                                readOnly
                                className="form-check-input my-2 Primary _500"
                              />
                              <small className="text-nowrap">{option}</small>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                  <div
                    className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                    onClick={() =>
                      setStepQ(
                        productInterest.answer == "buy"
                          ? "paymentMethodBuy"
                          : productInterest.answer == "sell"
                          ? "paymentMethodSell"
                          : "other"
                      )
                    }
                  >
                    Previous
                  </div>
                  <div
                    className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                    onClick={() =>
                      handleQuestionaries(
                        frequency,
                        productInterest.answer == "buy"
                          ? "volume"
                          : productInterest.answer == "sell"
                          ? "priorExperience"
                          : "other"
                      )
                    }
                  >
                    Continue
                  </div>
                </div>
              </>
            ) : stepQ == "volume" ? (
              <>
                <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                  <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                    <span
                      className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                      style={{ width: "32px", height: "32px" }}
                    >
                      4
                    </span>
                    {volume.question}
                  </p>

                  <div className="fs-5 text_Primary_700 py-3 ps-5">
                    <div className="row justify-content-start align-items-center gy-3">
                      <div className="col-md-12">
                        <select
                          onChange={(e) =>
                            setVolume((prev) => ({
                              ...prev,
                              answer: e.target.value,
                              answerLabel: e.target.value,
                            }))
                          }
                          value={volume.answer}
                          className="form-select form-select-lg w-100"
                        >
                          <option>Select</option>
                          <option value="$1,000 - $5,000">
                            $1,000 - $5,000
                          </option>
                          <option value="$5,001 - $25,000">
                            $5,001 - $25,000
                          </option>
                          <option value="$25,001 - $100,000">
                            $25,001 - $100,000
                          </option>
                          <option value="$100,001 - $500,000">
                            $100,001 - $500,000
                          </option>
                          <option value="Above $500,000">Above $500,000</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                  <div
                    className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                    onClick={() => {
                      setStepQ("frequency");
                    }}
                  >
                    Previous
                  </div>
                  <div
                    className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                    onClick={() => handleQuestionaries(volume, "purpose")}
                  >
                    Continue
                  </div>
                </div>
              </>
            ) : stepQ == "purpose" ? (
              <>
                <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                  <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                    <span
                      className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                      style={{ width: "32px", height: "32px" }}
                    >
                      5
                    </span>
                    {purpose.question}
                  </p>

                  <div className="fs-5 text_Primary_700 py-3 ps-5">
                    <div className="row justify-content-start align-items-center gy-3">
                      {purposeOptions.map((option) => {
                        const isSelected = purpose.answer === option;

                        return (
                          <div key={option} className="col-md-6">
                            <div
                              className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                                isSelected ? "bg-primary text-white" : ""
                              }`}
                              style={{
                                backgroundColor: isSelected
                                  ? "#7F56D9"
                                  : "rgba(127, 86, 217, 0.1)",
                              }}
                              onClick={() =>
                                setPurpose((prev) => ({
                                  ...prev,
                                  answer: option,
                                  answerLabel: option,
                                }))
                              }
                            >
                              <input
                                type="radio"
                                checked={isSelected}
                                readOnly
                                className="form-check-input my-2 Primary _500"
                              />
                              <small className="text-nowrap">{option}</small>
                            </div>
                          </div>
                        );
                      })}
                      <div className="col-md-12">
                        {purpose.answer === "Other" && (
                          <input
                            type="text"
                            className="form-control mt-2"
                            placeholder="Please Specify"
                            value={purpose.answerLabel}
                            onChange={(e) =>
                              setPurpose((prev) => ({
                                ...prev,
                                answerLabel: e.target.value,
                              }))
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                  <div
                    className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                    onClick={() => {
                      setStepQ("volume");
                    }}
                  >
                    Previous
                  </div>
                  <div
                    className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                    onClick={() => handleQuestionaries(purpose, "sourceFund")}
                  >
                    Continue
                  </div>
                </div>
              </>
            ) : stepQ == "sourceFund" ? (
              <>
                <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                  <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                    <span
                      className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                      style={{ width: "32px", height: "32px" }}
                    >
                      6
                    </span>
                    {sourceFund.question}
                  </p>

                  <div className="fs-5 text_Primary_700 py-3 ps-5">
                    <div className="row justify-content-start align-items-center gy-3">
                      {sourceFundOptions.map((option) => {
                        const isSelected = sourceFund.answer === option;
                        return (
                          <div key={option} className="col-md-6">
                            <div
                              className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                                isSelected ? "bg-primary text-white" : ""
                              }`}
                              style={{
                                backgroundColor: isSelected
                                  ? "#7F56D9"
                                  : "rgba(127, 86, 217, 0.1)",
                              }}
                              onClick={() =>
                                setSourceFund((prev) => ({
                                  ...prev,
                                  answer: option,
                                  answerLabel: option,
                                }))
                              }
                            >
                              <input
                                type="radio"
                                checked={isSelected}
                                readOnly
                                className="form-check-input my-2 Primary _500"
                              />
                              <small className="text-nowrap">{option}</small>
                            </div>
                          </div>
                        );
                      })}
                      <div className="col-md-12">
                        {sourceFund.answer === "Other" && (
                          <input
                            type="text"
                            className="form-control mt-2"
                            placeholder="Please Specify"
                            value={sourceFund.answerLabel}
                            onChange={(e) =>
                              setSourceFund((prev) => ({
                                ...prev,
                                answerLabel: e.target.value,
                              }))
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                  <div
                    className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                    onClick={() => {
                      setStepQ("purpose");
                    }}
                  >
                    Previous
                  </div>
                  <div
                    className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                    onClick={() =>
                      handleQuestionaries(sourceFund, "priorExperience")
                    }
                  >
                    Continue
                  </div>
                </div>
              </>
            ) : stepQ == "priorExperience" ? (
              <>
                <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                  <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                    <span
                      className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                      style={{ width: "32px", height: "32px" }}
                    >
                      {productInterest === "buy" ? 7 : 4}
                    </span>
                    {priorExperience.question}
                  </p>

                  <div className="fs-5 text_Primary_700 py-3 ps-5">
                    <div className="row justify-content-start align-items-center gy-3">
                      {priorExperienceOptions.map((option) => {
                        const isSelected = priorExperience.answer === option;

                        return (
                          <div key={option} className="col-md-6">
                            <div
                              className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                                isSelected ? "bg-primary text-white" : ""
                              }`}
                              style={{
                                backgroundColor: isSelected
                                  ? "#7F56D9"
                                  : "rgba(127, 86, 217, 0.1)",
                              }}
                              onClick={() =>
                                setPriorExperience((prev) => ({
                                  ...prev,
                                  answer: option,
                                  answerLabel: option,
                                }))
                              }
                            >
                              <input
                                type="radio"
                                checked={isSelected}
                                readOnly
                                className="form-check-input my-2 Primary _500"
                              />
                              <small className="text-nowrap">{option}</small>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                  <div
                    className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                    onClick={() => {
                      setStepQ(
                        productInterest.answer == "buy"
                          ? "sourceFund"
                          : productInterest.answer == "sell"
                          ? "frequency"
                          : "start"
                      );
                    }}
                  >
                    Previous
                  </div>
                  <div
                    className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                    onClick={() =>
                      handleQuestionaries(priorExperience, "platformDiscovery")
                    }
                  >
                    Continue
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                  <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                    <span
                      className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <i className="spinner-border spinner"></i>
                    </span>
                    Loading
                  </p>
                </div>
                <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                  <div
                    className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                    onClick={() => setStepQ("purpose")}
                  >
                    Previous
                  </div>
                </div>
              </>
            )}
          </div>

          {section === "platformDiscovery" && (
            <>
              <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                  <span
                    className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    1
                  </span>
                  {platformDiscovery.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    {productDiscoveryOptions.map((option) => {
                      const isSelected =
                        platformDiscovery.answer.includes(option);

                      return (
                        <div key={option} className="col-md-6">
                          <div
                            className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                              isSelected ? "bg-primary text-white" : ""
                            }`}
                            style={{
                              backgroundColor: isSelected
                                ? "#7F56D9"
                                : "rgba(127, 86, 217, 0.1)",
                            }}
                            onClick={() => {
                              setPlatformDiscovery((prev) => {
                                const updatedAnswers = isSelected
                                  ? prev.answer.filter(
                                      (item) => item !== option
                                    ) // remove
                                  : [...prev.answer, option]; // add

                                return {
                                  ...prev,
                                  answer: updatedAnswers,
                                  answerLabel: option,
                                };
                              });
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="form-check-input my-2 Primary _500"
                            />
                            <small className="text-nowrap">{option}</small>
                          </div>
                        </div>
                      );
                    })}
                    <div className="col-md-12">
                      {platformDiscovery.answer.includes("Other") && (
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Please Specify"
                          value={purpose.answerLabel}
                          onChange={(e) =>
                            setPurpose((prev) => ({
                              ...prev,
                              answerLabel: e.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                <div
                  className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                  onClick={() => {
                    setSection("productInterest");
                    setStepQ("priorExperience");
                  }}
                >
                  Previous
                </div>
                <div
                  className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                  onClick={() => handleQuestionaries(platformDiscovery, "end")}
                >
                  Continue
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionaries;
