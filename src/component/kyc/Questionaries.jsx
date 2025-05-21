"use client";
import React, { useEffect, useState } from "react";
import { APITemplate } from "../API/Template";
import FileUploadBase64 from "./FileUploadBase64";

const Questionaries = ({ data, setStep, verification, getVerification }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [stepQ, setStepQ] = useState("start");
  const [count, setCount] = useState(0);
  const [startQ, setStartQ] = useState({
    question: "Please select your preferred currency:",
    answer: "",
    answerLabel: "",
    type: "start",
  });
  const [transactionTypeQ, setTransactionTypeQ] = useState({
    question: "What type of transaction do you want to perform?",
    answer: "",
    answerLabel: "",
    type: "transactionType",
  });
  const [paymentMethodBuy, setPaymentMethodBuy] = useState({
    question: "Preferred Payment / Settlement Method",
    answer: "",
    answerLabel: "",
    type: "paymentMethod",
  });
  const [paymentMethodSell, setPaymentMethodSell] = useState({
    question: "Preferred Payment / Settlement Method",
    answer: "",
    answerLabel: "",
    type: "paymentMethod",
  });
  const [cryptoExperience, setCryptoExperience] = useState({
    question: "Do you have prior experience with crypto transactions?",
    answer: "",
    answerLabel: "",
    type: "cryptoExperience",
  });
  const [cryptoExchange, setCryptoExchange] = useState({
    question: "Which cryptocurrency do you want to Exchange?",
    answer: "",
    answerLabel: "",
    type: "cryptoExchange",
  });
  const [walletAddress, setWalletAddress] = useState({
    question: "Enter your wallet address for this transaction",
    answer: "",
    answerLabel: "",
    type: "walletAddress",
  });
  const [walletOwnership, setWalletOwnership] = useState({
    question: "Upload a screenshot or ownership proof of this wallet",
    answer: "",
    answerLabel: "",
    type: "walletOwnership",
  });
  const [planTrade, setPlanTrade] = useState({
    question: "How often do you plan to trade with us?",
    answer: "",
    answerLabel: "",
    type: "planTrade",
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

  useEffect(() => {
    if (verification?.applicant?.questionaries?.length > 0) {
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "start"
        )
      ) {
        setStartQ(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "start"
          )
        );
        setStepQ("transactionType");
        setCount(1);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "transactionType"
        )
      ) {
        setTransactionTypeQ(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "transactionType"
          )
        );
        if (
          verification?.applicant?.questionaries.find(
            (data) => data.type === "transactionType"
          ).answer === "sell"
        ) {
          setStepQ("paymentMethodSell");
        } else if (
          verification?.applicant?.questionaries.find(
            (data) => data.type === "transactionType"
          ).answer === "buy"
        ) {
          setStepQ("paymentMethodBuy");
        } else {
          setStepQ("planTrade");
        }
        setCount(2);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "paymentMethod"
        )
      ) {
        setPaymentMethodBuy(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "paymentMethod"
          )
        );
        setStepQ("cryptoExperience");
        setCount(3);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "paymentMethod"
        )
      ) {
        setPaymentMethodSell(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "paymentMethod"
          )
        );
        setStepQ("cryptoExperience");
        setCount(4);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "cryptoExperience"
        )
      ) {
        setCryptoExperience(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "cryptoExperience"
          )
        );
        setStepQ("cryptoExchange");
        setCount(5);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "cryptoExchange"
        )
      ) {
        setCryptoExchange(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "cryptoExchange"
          )
        );
        setStepQ("walletAddress");
        setCount(6);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "walletAddress"
        )
      ) {
        setWalletAddress(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "walletAddress"
          )
        );
        setStepQ("walletOwnership");
        setCount(7);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "walletOwnership"
        )
      ) {
        setWalletOwnership(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "walletOwnership"
          )
        );
        setStepQ("planTrade");
        setCount(8);
      }
      if (
        verification?.applicant?.questionaries.find(
          (data) => data.type === "planTrade"
        )
      ) {
        setPlanTrade(
          verification?.applicant?.questionaries.find(
            (data) => data.type === "planTrade"
          )
        );
        setStepQ("volume");
        setCount(9);
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
        setCount(10);
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
        setCount(11);
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
        setStepQ("sourceFund");
        setCount(12);
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
    } else if (stepQ == "transactionType") {
      setCount(2);
    } else if (stepQ == "paymentMethodBuy") {
      setCount(3);
    } else if (stepQ == "paymentMethodSell") {
      setCount(3);
    } else if (stepQ == "cryptoExperience") {
      setCount(4);
    } else if (stepQ == "cryptoExchange") {
      setCount(5);
    } else if (stepQ == "walletAddress") {
      setCount(6);
    } else if (stepQ == "walletOwnership") {
      setCount(7);
    } else if (stepQ == "planTrade") {
      setCount(8);
    } else if (stepQ == "volume") {
      setCount(9);
    } else if (stepQ == "purpose") {
      setCount(10);
    } else if (stepQ == "sourceFund") {
      setCount(12);
    }
  }, [stepQ]);

  return (
    <div className="row align-items-start justify-content-center w-100">
      <div className="col-md-6 rounded-5 bg-white shadow-lg p-4 my-md-5">
        <div className="container">
          <div className="d-flex flex-column gap-3 py-3">
            <h4 className="fw-bold">Questionaries</h4>
            <div className="arrow-line" />
            <div className="my-3">
              <div className="progress rounded-2" style={{ height: "14px" }}>
                <div
                  className="progress-bar Primary_500"
                  role="progressbar"
                  style={{
                    // width: `${((history.length + 1) / 5) * 100}%`,
                    width: `${((count + 1) / 14) * 100}%`,
                  }}
                  aria-valuenow={count + 1}
                  // aria-valuenow={history.length + 1}
                  aria-valuemin="0"
                  aria-valuemax="5"
                ></div>
              </div>
            </div>
          </div>

          {errors.length > 0 &&
            errors.map((e) => <p className="text-danger">{e}</p>)}

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
                  {startQ.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          startQ.answer === "AED" ? "bg-primary text-white" : ""
                        }`}
                        style={{
                          backgroundColor:
                            startQ.answer === "AED"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setStartQ((prev) => ({
                            ...prev,
                            answer: "AED",
                            answerLabel: "AED",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={startQ.answer === "AED"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">AED</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          startQ.answer === "INR" ? "bg-primary text-white" : ""
                        }`}
                        style={{
                          backgroundColor:
                            startQ.answer === "INR"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setStartQ((prev) => ({
                            ...prev,
                            answer: "INR",
                            answerLabel: "INR",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={startQ.answer === "INR"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">INR</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          startQ.answer === "USD" ? "bg-primary text-white" : ""
                        }`}
                        style={{
                          backgroundColor:
                            startQ.answer === "USD"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setStartQ((prev) => ({
                            ...prev,
                            answer: "USD",
                            answerLabel: "USD",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={startQ.answer === "USD"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">USD</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center px-2 pt-4">
                <div
                  className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                  onClick={() => handleQuestionaries(startQ, "transactionType")}
                >
                  Continue
                </div>
              </div>
            </>
          ) : stepQ == "transactionType" ? (
            <>
              <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                  <span
                    className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    2
                  </span>
                  {transactionTypeQ.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          transactionTypeQ.answer === "buy"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            transactionTypeQ.answer === "buy"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setTransactionTypeQ((prev) => ({
                            ...prev,
                            answer: "buy",
                            answerLabel: "I want to Buy Crypto",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={transactionTypeQ.answer === "buy"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">
                          I want to Buy Crypto
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          transactionTypeQ.answer === "sell"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            transactionTypeQ.answer === "sell"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setTransactionTypeQ((prev) => ({
                            ...prev,
                            answer: "sell",
                            answerLabel: "I want to Sell Crypto",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={transactionTypeQ.answer === "sell"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">
                          I want to Sell Crypto
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          transactionTypeQ.answer === "other"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            transactionTypeQ.answer === "other"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setTransactionTypeQ((prev) => ({
                            ...prev,
                            answer: "other",
                            answerLabel: "Something else",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={transactionTypeQ.answer === "other"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Something else</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                <div
                  className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                  onClick={() => setStepQ("start")}
                >
                  Previous
                </div>
                <div
                  className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                  onClick={() =>
                    handleQuestionaries(
                      transactionTypeQ,
                      transactionTypeQ?.answer === "buy"
                        ? "paymentMethodBuy"
                        : transactionTypeQ?.answer === "sell"
                        ? "paymentMethodSell"
                        : "planTrade"
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
                    3
                  </span>
                  {paymentMethodBuy.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          paymentMethodBuy.answer === "cash"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            paymentMethodBuy.answer === "cash"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPaymentMethodBuy((prev) => ({
                            ...prev,
                            answer: "cash",
                            answerLabel: "Cash Payment",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={paymentMethodBuy.answer === "cash"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Cash Payment</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          paymentMethodBuy.answer === "other"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            paymentMethodBuy.answer === "other"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPaymentMethodBuy((prev) => ({
                            ...prev,
                            answer: "other",
                            answerLabel: "",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={paymentMethodBuy.answer === "other"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Other</small>
                      </div>
                    </div>
                    <div className="col-md-12">
                      {paymentMethodBuy.answer === "other" && (
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Enter Details for other payment method"
                          value={paymentMethodBuy.answerLabel}
                          onChange={(e) =>
                            setPaymentMethodBuy((prev) => ({
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
                    setPaymentMethodBuy((prev) => ({
                      ...prev,
                      answer: "",
                      answerLabel: "",
                    }));
                    setStepQ("transactionType");
                  }}
                >
                  Previous
                </div>
                <div
                  className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                  onClick={() =>
                    handleQuestionaries(paymentMethodBuy, "cryptoExperience")
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
                    3
                  </span>
                  {paymentMethodSell.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          paymentMethodSell.answer === "bankPersonal"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            paymentMethodSell.answer === "bankPersonal"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPaymentMethodSell((prev) => ({
                            ...prev,
                            answer: "bankPersonal",
                            answerLabel: "Bank Transfer to Personal Account",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={paymentMethodSell.answer === "bankPersonal"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">
                          Bank Transfer to Personal Account
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          paymentMethodSell.answer === "bankBusiness"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            paymentMethodSell.answer === "bankBusiness"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPaymentMethodSell((prev) => ({
                            ...prev,
                            answer: "bankBusiness",
                            answerLabel: "Bank Transfer to Business Account",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={paymentMethodSell.answer === "bankBusiness"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">
                          Bank Transfer to Business Account
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          paymentMethodSell.answer === "cashPerson"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            paymentMethodSell.answer === "cashPerson"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPaymentMethodSell((prev) => ({
                            ...prev,
                            answer: "cashPerson",
                            answerLabel: "Cash in Person",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={paymentMethodSell.answer === "cashPerson"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Cash in Person</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          paymentMethodSell.answer === "cashDeposit"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            paymentMethodSell.answer === "cashDeposit"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPaymentMethodSell((prev) => ({
                            ...prev,
                            answer: "cashDeposit",
                            answerLabel: "Cash Deposit",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={paymentMethodSell.answer === "cashDeposit"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Cash Deposit</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          paymentMethodSell.answer === "cheque"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            paymentMethodSell.answer === "cheque"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPaymentMethodSell((prev) => ({
                            ...prev,
                            answer: "cheque",
                            answerLabel: "Manager’s Cheque",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={paymentMethodSell.answer === "cheque"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Manager’s Cheque</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          paymentMethodSell.answer === "other"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            paymentMethodSell.answer === "other"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPaymentMethodSell((prev) => ({
                            ...prev,
                            answer: "other",
                            answerLabel: "",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={paymentMethodSell.answer === "other"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Other</small>
                      </div>
                    </div>
                    <div className="col-md-12">
                      {paymentMethodSell.answer === "other" && (
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Please Specify"
                          value={paymentMethodSell.answerLabel}
                          onChange={(e) =>
                            setPaymentMethodSell((prev) => ({
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
                    setPaymentMethodSell((prev) => ({
                      ...prev,
                      answer: "",
                      answerLabel: "",
                    }));
                    setStepQ("transactionType");
                  }}
                >
                  Previous
                </div>
                <div
                  className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                  onClick={() =>
                    handleQuestionaries(paymentMethodSell, "cryptoExperience")
                  }
                >
                  Continue
                </div>
              </div>
            </>
          ) : stepQ == "cryptoExperience" ? (
            <>
              <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                  <span
                    className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    4
                  </span>
                  {cryptoExperience.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          cryptoExperience.answer === "yes"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            cryptoExperience.answer === "yes"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setCryptoExperience((prev) => ({
                            ...prev,
                            answer: "yes",
                            answerLabel: "Yes",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={cryptoExperience.answer === "yes"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Yes</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          cryptoExperience.answer === "no"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            cryptoExperience.answer === "no"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setCryptoExperience((prev) => ({
                            ...prev,
                            answer: "no",
                            answerLabel: "No",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={cryptoExperience.answer === "no"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">No</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                <div
                  className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                  onClick={() =>
                    setStepQ(
                      transactionTypeQ.answer == "buy"
                        ? "paymentMethodBuy"
                        : transactionTypeQ.answer == "sell"
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
                    handleQuestionaries(cryptoExperience, "cryptoExchange")
                  }
                >
                  Continue
                </div>
              </div>
            </>
          ) : stepQ == "cryptoExchange" ? (
            <>
              <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                  <span
                    className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    5
                  </span>
                  {cryptoExchange.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          cryptoExchange.answer === "USDT"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            cryptoExchange.answer === "USDT"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setCryptoExchange((prev) => ({
                            ...prev,
                            answer: "USDT",
                            answerLabel: "Tether (USDT)",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={cryptoExchange.answer === "USDT"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Tether (USDT)</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          cryptoExchange.answer === "BTC"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            cryptoExchange.answer === "BTC"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setCryptoExchange((prev) => ({
                            ...prev,
                            answer: "BTC",
                            answerLabel: "Bitcoin (BTC)",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={cryptoExchange.answer === "BTC"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Bitcoin (BTC)</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          cryptoExchange.answer === "ETH"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            cryptoExchange.answer === "ETH"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setCryptoExchange((prev) => ({
                            ...prev,
                            answer: "ETH",
                            answerLabel: "Ethereum (ETH)",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={cryptoExchange.answer === "ETH"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Ethereum (ETH)</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          cryptoExchange.answer === "other"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            cryptoExchange.answer === "other"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setCryptoExchange((prev) => ({
                            ...prev,
                            answer: "other",
                            answerLabel: "",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={cryptoExchange.answer === "other"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Other</small>
                      </div>
                    </div>
                    <div className="col-md-12">
                      {cryptoExchange.answer === "other" && (
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Enter Details for other payment method"
                          value={cryptoExchange.answerLabel}
                          onChange={(e) =>
                            setCryptoExchange((prev) => ({
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
                    setStepQ("cryptoExperience");
                  }}
                >
                  Previous
                </div>
                <div
                  className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                  onClick={() =>
                    handleQuestionaries(cryptoExchange, "walletAddress")
                  }
                >
                  Continue
                </div>
              </div>
            </>
          ) : stepQ == "walletAddress" ? (
            <>
              <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                  <span
                    className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    6
                  </span>
                  {walletAddress.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    <div className="col-md-12">
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Enter wallet address here"
                        value={walletAddress.answerLabel}
                        onChange={(e) =>
                          setWalletAddress((prev) => ({
                            ...prev,
                            answerLabel: e.target.value,
                            answer: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                <div
                  className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                  onClick={() => {
                    setStepQ("cryptoExchange");
                  }}
                >
                  Previous
                </div>
                <div
                  className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                  onClick={() =>
                    handleQuestionaries(walletAddress, "walletOwnership")
                  }
                >
                  Continue
                </div>
              </div>
            </>
          ) : stepQ == "walletOwnership" ? (
            <>
              <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                  <span
                    className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    7
                  </span>
                  {walletOwnership.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    <FileUploadBase64
                      walletOwnership={walletOwnership}
                      setWalletOwnership={setWalletOwnership}
                    />
                    <div className="col-md-12">
                      <p className="text-muted fs-6">
                        Please upload an image or file as proof of wallet
                        ownership
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                <div
                  className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                  onClick={() => {
                    setStepQ("walletAddress");
                  }}
                >
                  Previous
                </div>
                <div
                  className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                  onClick={() =>
                    handleQuestionaries(walletOwnership, "planTrade")
                  }
                >
                  Continue
                </div>
              </div>
            </>
          ) : stepQ == "planTrade" ? (
            <>
              <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
                <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                  <span
                    className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    8
                  </span>
                  {planTrade.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          planTrade.answer === "oneTime"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            planTrade.answer === "oneTime"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPlanTrade((prev) => ({
                            ...prev,
                            answer: "oneTime",
                            answerLabel: "One-Time",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={planTrade.answer === "oneTime"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">One-Time</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          planTrade.answer === "occasional"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            planTrade.answer === "occasional"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPlanTrade((prev) => ({
                            ...prev,
                            answer: "occasional",
                            answerLabel: "Occasional",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={planTrade.answer === "occasional"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Occasional</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          planTrade.answer === "regular"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            planTrade.answer === "regular"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPlanTrade((prev) => ({
                            ...prev,
                            answer: "regular",
                            answerLabel: " Regular / Frequent",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={planTrade.answer === "regular"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">
                          {" "}
                          Regular / Frequent
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center px-2 pt-4">
                <div
                  className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer $`}
                  onClick={() => {
                    setStepQ(
                      transactionTypeQ.answer == "buy"
                        ? "walletOwnership"
                        : transactionTypeQ.answer == "sell"
                        ? "walletOwnership"
                        : "transactionType"
                    );
                  }}
                >
                  Previous
                </div>
                <div
                  className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                  onClick={() => handleQuestionaries(planTrade, "volume")}
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
                    9
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
                        <option value="$1,000 - $5,000">$1,000 - $5,000</option>
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
                  onClick={() => setStepQ("planTrade")}
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
                    10
                  </span>
                  {purpose.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          purpose.answer === "personalInvestment"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            purpose.answer === "personalInvestment"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPurpose((prev) => ({
                            ...prev,
                            answer: "personalInvestment",
                            answerLabel: "Personal Investment",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={purpose.answer === "personalInvestment"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">
                          Personal Investment
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          purpose.answer === "businessOperations"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            purpose.answer === "businessOperations"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPurpose((prev) => ({
                            ...prev,
                            answer: "businessOperations",
                            answerLabel: "Business Operations",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={purpose.answer === "businessOperations"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">
                          Business Operations
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          purpose.answer === "realEstate"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            purpose.answer === "realEstate"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPurpose((prev) => ({
                            ...prev,
                            answer: "realEstate",
                            answerLabel: " Real Estate Purchase",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={purpose.answer === "realEstate"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">
                          {" "}
                          Real Estate Purchase
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          purpose.answer === "remittance"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            purpose.answer === "remittance"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPurpose((prev) => ({
                            ...prev,
                            answer: "remittance",
                            answerLabel: "Remittance",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={purpose.answer === "remittance"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Remittance</small>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          purpose.answer === "other"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            purpose.answer === "other"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setPurpose((prev) => ({
                            ...prev,
                            answer: "other",
                            answerLabel: "",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={purpose.answer === "other"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Other</small>
                      </div>
                    </div>
                    <div className="col-md-12">
                      {purpose.answer === "other" && (
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
                    11
                  </span>
                  {sourceFund.question}
                </p>

                <div className="fs-5 text_Primary_700 py-3 ps-5">
                  <div className="row justify-content-start align-items-center gy-3">
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          sourceFund.answer === "salary"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            sourceFund.answer === "salary"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setSourceFund((prev) => ({
                            ...prev,
                            answer: "salary",
                            answerLabel: "Salary",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={sourceFund.answer === "salary"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Salary</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          sourceFund.answer === "businessRevenue"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            sourceFund.answer === "businessRevenue"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setSourceFund((prev) => ({
                            ...prev,
                            answer: "businessRevenue",
                            answerLabel: "Business Revenue",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={sourceFund.answer === "businessRevenue"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Business Revenue</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          sourceFund.answer === "savings"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            sourceFund.answer === "savings"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setSourceFund((prev) => ({
                            ...prev,
                            answer: "savings",
                            answerLabel: "Savings",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={sourceFund.answer === "savings"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap"> Savings</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          sourceFund.answer === "investmentReturns"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            sourceFund.answer === "investmentReturns"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setSourceFund((prev) => ({
                            ...prev,
                            answer: "investmentReturns",
                            answerLabel: "Investment Returns",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={sourceFund.answer === "investmentReturns"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">
                          Investment Returns
                        </small>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div
                        className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                          sourceFund.answer === "other"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            sourceFund.answer === "other"
                              ? "#7F56D9"
                              : "rgba(127, 86, 217, 0.1)",
                        }}
                        onClick={() =>
                          setSourceFund((prev) => ({
                            ...prev,
                            answer: "other",
                            answerLabel: "",
                          }))
                        }
                      >
                        <input
                          type="radio"
                          checked={sourceFund.answer === "other"}
                          readOnly
                          className="form-check-input my-2 Primary _500"
                        />
                        <small className="text-nowrap">Other</small>
                      </div>
                    </div>
                    <div className="col-md-12">
                      {sourceFund.answer === "other" && (
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
                  onClick={() => handleQuestionaries(sourceFund, "end")}
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
      </div>
    </div>
  );
};

export default Questionaries;
