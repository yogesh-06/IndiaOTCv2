"use client";

import { APITemplate } from "@/component/API/Template";
import Footer from "@/component/Footer";
import { checkUserCountry, checkUserVPNValid } from "@/component/global";
import Header from "@/component/Header";
import axios from "axios";
import CryptoJS from "crypto-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { createRef, useEffect, useRef, useState } from "react";

const Page = ({ params }) => {
  const router = useRouter();
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpHash, setOTPHash] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [timeLeft, setTimeLeft] = useState(30);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  useEffect(() => {
    inputRefs.current = Array(6)
      .fill(null)
      .map(() => createRef());
  }, []);

  const handleInputChange = (index, e) => {
    const newOtp = [...verificationCode];
    newOtp[index] = e.target.value;
    setVerificationCode(newOtp);

    // Check if all elements in newOtp are filled
    const allDigitsFilled = newOtp.every((digit) => digit !== "");

    if (e.target.value && index < 5) {
      inputRefs.current[index + 1].current.focus();
    }

    if (allDigitsFilled) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handlePaste = (index, e) => {
    // Prevent the default paste action (this way we can control the behavior)
    e.preventDefault();

    // Get the pasted value and split it into an array of characters
    const pastedValue = e.clipboardData
      .getData("Text")
      .slice(0, verificationCode.length); // Make sure we don't exceed the length of the OTP
    const newOtp = [...verificationCode];

    pastedValue.split("").forEach((char, i) => {
      if (newOtp[i] !== undefined) {
        newOtp[i] = char; // Fill the respective input with the pasted digit
      }
    });

    setVerificationCode(newOtp);

    // Focus on the next input field after the last pasted digit
    if (pastedValue.length > 0) {
      const nextIndex = Math.min(
        index + pastedValue.length,
        verificationCode.length - 1
      );
      inputRefs.current[nextIndex].current.focus();
    }

    // Check if all elements in newOtp are filled
    const allDigitsFilled = newOtp.every((digit) => digit !== "");
    if (allDigitsFilled) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  useEffect(() => {
    async function getUserCheck() {
      let isValidCountry = await checkUserCountry();
      if (!isValidCountry) {
        enqueueSnackbar("We are not available in your country", {
          variant: "error",
        });
        setTimeout(() => {
          router.push("/");
        }, 2000);
        return;
      }
    }
    // getUserCheck();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      setIsDisabled(false);
    }
  }, [timeLeft]);

  const handleRegister = async () => {
    // setLoading(true);

    // let isValidUser = await checkUserVPNValid();

    // if (!isValidUser) {
    //   router.push("/403");
    //   return;
    // }
    // setLoading(false);

    const newErrors = [];

    if (!email) newErrors.push("email");
    if (!isChecked) newErrors.push("isChecked");
    if (!emailRegex.test(email)) newErrors.push("invalid");
    setErrors(newErrors);
    if (newErrors.length > 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      const response = await APITemplate("user/Register", "POST", formData);
      if (response.success == true) {
        setLoading(false);
        enqueueSnackbar(
          "OTP has been sent to your email",
          { variant: "success" },
          { autoHideDuration: 500 }
        );
        setOTPHash(response.data.otpHash);
        setIsSent(true);
        setTimeLeft(30);
        setIsDisabled(true);
        setStep("verifyEmail");
      } else {
        setLoading(false);
        console.log(response);
        if (response.message == "Email Already Registered") {
          enqueueSnackbar(
            response.message,
            { variant: "info" },
            { autoHideDuration: 500 }
          );
        } else {
          enqueueSnackbar(
            response.message,
            { variant: "error" },
            { autoHideDuration: 500 }
          );
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      enqueueSnackbar(
        "Something went wrong",
        { variant: "error" },
        { autoHideDuration: 500 }
      );
    }
  };

  const handleOTPResend = async () => {
    const formData = new FormData();
    formData.append("email", email);
    const response = await APITemplate("user/Register", "POST", formData);
    if (response.success == true) {
      setLoading(false);
      enqueueSnackbar(
        "OTP has been sent to your email",
        { variant: "success" },
        { autoHideDuration: 500 }
      );
      setOTPHash(response.data.otpHash);
      setIsSent(true);
      setTimeLeft(30);
      setIsDisabled(true);
    } else {
      setStep("register");
      setLoading(false);
      console.log(response);
      if (response.message == "Email Already Registered") {
        enqueueSnackbar(
          response.message,
          { variant: "info" },
          { autoHideDuration: 500 }
        );
      } else {
        enqueueSnackbar(
          response.message,
          { variant: "error" },
          { autoHideDuration: 500 }
        );
      }
    }
  };

  const handleVerifyOTP = (enteredOtp) => {
    setLoading(true);
    setErrors([]);
    const newErrors = [];
    if (!verificationCode) newErrors.push("verificationCode");
    setErrors(newErrors);
    if (newErrors.length > 0) {
      setLoading(false);
      return;
    }

    if (otpHash == CryptoJS.MD5(parseInt(enteredOtp).toString()).toString()) {
      // enqueueSnackbar(
      //   "OTP is correct",
      //   { variant: "success" },
      //   { autoHideDuration: 500 }
      // );
      setStep("setPassword");
    } else {
      newErrors.push("verificationCode");
      if (newErrors.length > 0) {
        setLoading(false);
        return;
      }
      enqueueSnackbar(
        "OTP is incorrect",
        { variant: "error" },
        { autoHideDuration: 500 }
      );
    }
    setLoading(false);
  };
  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordPattern.test(password);
  };

  // Calculate password strength based on validation rules
  const calculateStrength = (password) => {
    let strength = 0;

    // Criteria checks based on validatePassword function
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++; // Uppercase letter
    if (/[a-z]/.test(password)) strength++; // Lowercase letter
    if (/\d/.test(password)) strength++; // Number
    if (/[!@#$%^&*]/.test(password)) strength++; // Special character

    return strength; // Return strength based on criteria met
  };

  const [strength, setStrength] = useState(0);
  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  const handleSetPassword = async () => {
    setLoading(true);
    setErrors([]);
    const newErrors = [];
    if (!password) newErrors.push("password");
    if (!confirmPassword) newErrors.push("confirmPassword");
    if (!validatePassword(password)) {
      newErrors.push("passwordStrong");
    }
    setErrors(newErrors);
    if (newErrors.length > 0) {
      setLoading(false);
      return;
    }
    try {
      if (password !== confirmPassword) {
        enqueueSnackbar("Passwords do not match", {
          variant: "warning",
        });
        return;
      } else {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("type", "individual");
        const responseLink = await APITemplate(
          "user/onboardUser",
          "POST",
          formData
        );
        if (responseLink.success == true) {
          enqueueSnackbar(responseLink.message, { variant: "success" });
          // setStep("getResidency");
          window.location.href = "/kyc/verification";
        } else {
          enqueueSnackbar(responseLink.message, { variant: "error" });
        }
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        "Something went wrong",
        { variant: "error" },
        { autoHideDuration: 500 }
      );
    } finally {
      setLoading(false);
    }
  };

  const [timer, setTimer] = useState(5);
  // useEffect(() => {
  //   if (isSent)
  //     setTimeout(() => {
  //       setIsSent(false);
  //     }, 5000);
  // }, [isSent]);
  useEffect(() => {
    if (timer === 0 || !isSent) {
      setIsSent(false); // Enable the button when the timer reaches 0
      return;
    }

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1); // Decrement the timer every second
    }, 1000);

    return () => clearInterval(intervalId); // Clean up the interval when the component unmounts or the timer ends
  }, [timer, isSent]);
  return (
    <>
      <Header currentLang={"en"} />

      <div
        style={{
          backgroundImage: `url(/images/bg-register.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <div
            className={`row align-items-center justify-content-center  min-vh-90 ${
              step > 5 && "d-none"
            }`}
          >
            <div
              className=" col-md-8 col-11 col-lg-7 col-xl-6 rounded-4 bg-white shadow-lg py-3 px-4 my-5 "
              style={{ border: "1px solid rgb(201, 201, 201)" }}
            >
              {step == "register" ? (
                <div className="d-flex flex-column align-items-start gap-4 p-3">
                  <h1 className="fw-medium">Create your account</h1>
                  <div className="w-100 d-flex flex-column gap-2 mt-2">
                    <div className="form-group">
                      <label className="text-muted">
                        Enter your email address to recieve a verification code
                      </label>
                      <input
                        type="text"
                        name="email"
                        className={`form-control form-control-lg bg-transparent  mt-2  ${
                          errors.includes("email") && "border-2 border-danger"
                        }`}
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {errors.includes("email") && (
                      <p
                        className="text-danger  fw-medium m-0 p-0 pb-2"
                        style={{ fontSize: "13px" }}
                      >
                        Please enter a valid email. For emails, only the '@'
                        symbol is allowed—spaces and special characters are not
                        permitted.
                      </p>
                    )}

                    <div>
                      <div className="d-flex align-items-start gap-2 p-2">
                        <input
                          type="checkbox"
                          className="form-check-input m-1"
                          id="useragreement"
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
                        />
                        <label htmlFor="useragreement">
                          You must accept the{" "}
                          <Link
                            target="_blank"
                            className="text-primary"
                            href="/en/terms-of-use"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            target="_blank"
                            className="text-primary"
                            href="/en/privacy-policies"
                          >
                            Privacy Policy
                          </Link>{" "}
                          to create an account.
                        </label>
                      </div>
                      <p className="text-center mt-4">
                        Already have an account?{" "}
                        <Link
                          href="/login"
                          className="text-primary text-decoration-none fs-6"
                        >
                          Login
                        </Link>
                      </p>
                    </div>

                    {errors.includes("isChecked") && (
                      <p
                        className="text-danger text-center fw-medium m-0 p-0 mt-2"
                        style={{ fontSize: "13px" }}
                      >
                        You must accept the Terms of Service and Privacy Policy
                        to create an account.
                      </p>
                    )}

                    <button
                      className="btn btn-lg btn-warning mt-3 text-uppercase"
                      disabled={loading}
                      onClick={handleRegister}
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
                        "Send verification code"
                      )}
                    </button>
                  </div>
                </div>
              ) : step == "verifyEmail" ? (
                <div className="d-flex flex-column align-items-center gap-3 p-3">
                  <h1 className="fw-medium">Email Verification</h1>
                  <p className="text-muted p-1">
                    Enter the verification code sent to{" "}
                    <a className="text-primary"> {email}</a>
                  </p>
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex justify-content-center gap-2 mb-3">
                      {verificationCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={inputRefs.current[index]}
                          type="text"
                          maxLength="1"
                          className={`form-control mx-1 text-center ${
                            errors.includes("verificationCode") &&
                            "border-danger"
                          }`}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            border: "2px solid #ced4da",
                            fontSize: "1.2rem",
                          }}
                          value={digit}
                          onChange={(e) => handleInputChange(index, e)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={(e) => handlePaste(index, e)}
                        />
                      ))}
                    </div>
                    {errors.includes("verificationCode") && (
                      <p className="text-danger"> Invalid OTP</p>
                    )}

                    <button
                      className="btn btn-outline-info mt-2"
                      onClick={handleOTPResend}
                      disabled={isDisabled}
                    >
                      {isDisabled
                        ? `Resend code in ${timeLeft}s`
                        : "Resend code"}
                    </button>

                    <small className="text-muted text-center cursor-pointer p-1 mt-4">
                      Didn&apos;t receive a code? Check your span folder, or{" "}
                      <br />
                      <a
                        className="text-primary fs-6 text-decoration-underline"
                        onClick={() => setStep("register")}
                      >
                        try a different email address
                      </a>
                    </small>
                  </div>
                </div>
              ) : step == "setPassword" ? (
                <div className="d-flex flex-column align-items-center gap-4 p-3">
                  <h1 className="fw-semibold">Set Your Password</h1>
                  <div className="w-100 d-flex flex-column gap-4 my-2">
                    <div className="form-group">
                      <label
                        className={`${
                          errors.includes("password") && "text-danger"
                        }`}
                      >
                        {password &&
                        confirmPassword &&
                        password != confirmPassword ? (
                          <span className="text-danger">
                            Password not matched.
                          </span>
                        ) : (
                          "Password"
                        )}
                      </label>
                      <div className="d-flex justify-content-center position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className={`form-control form-control-lg bg-transparent ${
                            errors.includes("password") && "border-danger"
                          }`}
                          placeholder=""
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <div
                          className="position-absolute cursor-pointer end-0 px-3 mt-2 pt-1 me-1 translate-end-x"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={!password}
                        >
                          {showPassword ? (
                            <i class="fa-solid fa-eye-slash"></i>
                          ) : (
                            <i class="fa-solid fa-eye"></i>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label
                        className={`${
                          errors.includes("confirmPassword") && "text-danger"
                        }`}
                      >
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        className={`form-control form-control-lg bg-transparent  mt-2 ${
                          errors.includes("confirmPassword") && "border-danger"
                        }`}
                        placeholder=""
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    {errors.includes("passwordStrong") && (
                      <ul className="text-danger">
                        <li>Password must contain at least 8 characters.</li>
                        <li>
                          Including uppercase, lowercase, a number, and a
                          special character.
                        </li>
                      </ul>
                    )}
                    <div className="password-strength mt-2 px-1">
                      <div className="d-flex justify-content-between ">
                        <small
                          className={
                            strength >= 1 ? "text-danger" : "text-muted"
                          }
                        >
                          Weak
                        </small>
                        <small
                          className={
                            strength >= 3 ? "text-warning" : "text-muted"
                          }
                        >
                          Medium
                        </small>
                        <small
                          className={
                            strength >= 5 ? "text-success" : "text-muted"
                          }
                        >
                          Strong
                        </small>
                      </div>

                      {/* Password Strength Meter (Progress Bar) */}
                      <div className="progress mt-2" style={{ height: "8px" }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${(strength / 5) * 100}%`,
                            backgroundColor:
                              strength >= 5
                                ? "green"
                                : strength >= 3
                                ? "orange"
                                : "red",
                          }}
                          aria-valuenow={strength}
                          aria-valuemin="0"
                          aria-valuemax="5"
                        />
                      </div>
                    </div>
                    <div class="mt-1">
                      <ul class="list-unstyled ps-3">
                        <li class="d-flex align-items-center mb-2">
                          <i class="fa-solid fa-info-circle text-primary me-3"></i>
                          <span class="text-muted">Minimum 8 characters</span>
                        </li>
                        <li class="d-flex align-items-center mb-2">
                          <i class="fa-solid fa-info-circle text-primary me-3"></i>
                          <span class="text-muted">
                            At least one uppercase letter
                          </span>
                        </li>
                        <li class="d-flex align-items-center mb-2">
                          <i class="fa-solid fa-info-circle text-primary me-3"></i>
                          <span class="text-muted">
                            At least one lowercase letter
                          </span>
                        </li>
                        <li class="d-flex align-items-center mb-2">
                          <i class="fa-solid fa-info-circle text-primary me-3"></i>
                          <span class="text-muted">At least one number</span>
                        </li>
                        <li class="d-flex align-items-center mb-2">
                          <i class="fa-solid fa-info-circle text-primary me-3"></i>
                          <span class="text-muted">At least one symbol</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      disabled={
                        !password ||
                        !confirmPassword ||
                        password != confirmPassword ||
                        loading
                      }
                      className="btn btn-lg btn-warning mt-2"
                      onClick={handleSetPassword}
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
                        "Next"
                      )}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="d-flex flex-column gap-1 px-4 py-2">
        <ul className="">
          <li>Device Type: {userDetails?.deviceType},</li>
          <li>IP Address: {userDetails?.ip},</li>
          <li>OS Type: {userDetails?.osType},</li>
          <li>Browser Type: {userDetails?.userAgent}</li>
        </ul>
      </div> */}
      <Footer language={"en"} />
    </>
  );
};

export default Page;
