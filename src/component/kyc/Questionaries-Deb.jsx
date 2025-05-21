"use client";
import React, { useEffect, useState } from "react";
import { APITemplate } from "../API/Template";

const Questionaries = ({ data, setStep, verification, getVerification }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [currentKey, setCurrentKey] = useState("currency");
  const [selected, setSelected] = useState("");
  const [history, setHistory] = useState([]);

  const questionFlow = {
    currency: {
      type: "single",
      question: "Please select your preferred currency:",
      previous: null,
      options: [
        { label: "AED", value: "aed", next: "transactionType" },
        { label: "INR", value: "inr", next: "transactionType" },
        { label: "USD", value: "usd", next: "transactionType" },
      ],
    },
    transactionType: {
      type: "multi",
      question: "What type of transaction do you want to perform?",
      previous: "currency",
      options: [
        {
          label: "I want to Buy Crypto",
          value: "buy",
          next: "paymentMethod_buy",
        },
        {
          label: "I want to Sell Crypto",
          value: "sell",
          next: "paymentMethod_sell",
        },
        { label: "Something else", value: "other", next: "custom_transaction" },
      ],
    },
    custom_transaction: {
      type: "text",
      question: "Please describe your transaction.",
      previous: "transactionType",
      next: "tradingProfile",
    },
    paymentMethod_buy: {
      type: "multi",
      question: "Preferred Payment / Settlement Method (for Buying):",
      previous: "transactionType",
      options: [
        { label: "Cash Payment", value: "cash" },
        { label: "Other", value: "other", hasTextField: true },
      ],
      next: "tradingProfile",
    },
    paymentMethod_sell: {
      type: "multi",
      question: "Preferred Payment / Settlement Method (for Selling):",
      previous: "transactionType",
      options: [
        { label: "Bank Transfer to Personal Account", value: "bank_personal" },
        { label: "Bank Transfer to Business Account", value: "bank_business" },
        { label: "Cash in Person", value: "cash_person" },
        { label: "Cash Deposit", value: "cash_deposit" },
        { label: "Manager’s Cheque", value: "cheque" },
      ],
      next: "tradingProfile",
    },
    tradingProfile: {
      type: "end",
      question: "Thank you! Let's proceed to your Trading Profile.",
      previous: null,
      options: [],
    },
  };

  const currentQuestion = questionFlow[currentKey];

  useEffect(() => {
    if (verification?.applicant?.questionaries?.length > 0) {
      setHistory(verification?.applicant?.questionaries);
      const last = verification?.applicant?.questionaries.at(-1);

      const flowKey = Object.keys(questionFlow).find(
        (key) => questionFlow[key].question === last.question
      );
      const selectedOption = questionFlow[flowKey]?.options?.find(
        (opt) => opt.label === last.answer
      );
      const nextKey = selectedOption?.next || "tradingProfile";
      setCurrentKey(nextKey);
    }
  }, [verification]);

  const handleOptionChange = (value) => {
    setSelected(value);
  };

  const handleContinue = async () => {
    if (!selected) return;

    const selectedOption = currentQuestion.options.find(
      (opt) => opt.value === selected
    );

    const label = selectedOption?.label || "";
    const currentType = questionFlow[currentKey]?.type || "radio";

    const updatedHistory = [
      ...history,
      {
        question: currentQuestion.question,
        type: currentType,
        answer: label,
        selected: selected,
      },
    ];
    setHistory(updatedHistory);
    setSelected("");

    const next = selectedOption?.next;

    if (!next || next === "tradingProfile") {
      await handleQuestionaries(updatedHistory);
    } else {
      setCurrentKey(next);
    }
  };

  const handlePrevious = () => {
    const last = history.at(-1);
    if (!last) return;

    const currentFlowKey = Object.keys(questionFlow).find(
      (key) => questionFlow[key].question === last.question
    );
    const previousKey = questionFlow[currentFlowKey]?.previous || "currency";

    setCurrentKey(previousKey);
    setSelected(last.selected || "");
    setHistory(history.slice(0, -1));
  };

  const handleQuestionaries = async (questionData) => {
    setErrors([]);
    setLoading(true);
    const formData = new FormData();

    questionData.forEach((item) => {
      formData.append("questionaries[]", JSON.stringify(item));
    });
    formData.append("verificationId", verification?._id);

    try {
      const response = await APITemplate(
        "user/updateQuestionaries",
        "POST",
        formData
      );
      if (response.success) {
        await getVerification(verification?._id);
        setStep("declaration");
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error uploading questionaries:", error);
    }
    setLoading(false);
  };

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
                    width: `${((history.length + 1) / 5) * 100}%`,
                  }}
                  aria-valuenow={history.length + 1}
                  aria-valuemin="0"
                  aria-valuemax="5"
                ></div>
              </div>
            </div>
          </div>

          <div className="Gray_200 rounded-2 border border-1 border-secondary-subtle p-3 my-2">
            <p className="d-flex align-items-center gap-2 fw-semibold text-secondary">
              <span
                className="d-flex justify-content-center align-items-center fw-normal bg-warning text-dark rounded-circle p-2"
                style={{ width: "32px", height: "32px" }}
              >
                {history.length + 1}
              </span>
              {currentQuestion?.question}
            </p>

            <div className="fs-5 text_Primary_700 py-3 ps-5">
              <div className="row justify-content-start align-items-center gy-3">
                {currentQuestion.options.map((opt) => (
                  <div className="col-md-6" key={opt.value}>
                    <div
                      className={`btn d-flex align-items-center justify-content-start border_primary gap-3 ${
                        selected === opt.value ? "bg-primary text-white" : ""
                      }`}
                      style={{
                        backgroundColor:
                          selected === opt.value
                            ? "#7F56D9"
                            : "rgba(127, 86, 217, 0.1)",
                      }}
                      onClick={() => handleOptionChange(opt.value)}
                    >
                      <input
                        type="radio"
                        checked={selected === opt.value}
                        readOnly
                        className="form-check-input my-2 Primary _500"
                      />
                      <small className="text-nowrap">{opt.label}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {currentKey !== "tradingProfile" && (
            <div className="d-flex justify-content-between align-items-center px-2 pt-4">
              <div
                className={`text-muted text-decoration-underline link-offset-3 fw-medium cursor-pointer ${
                  history.length === 0 ? "invisible" : ""
                }`}
                onClick={handlePrevious}
              >
                Previous
              </div>
              <div
                className="text-muted text-end text-decoration-underline link-offset-3 fw-medium cursor-pointer"
                onClick={handleContinue}
              >
                Continue
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionaries;
