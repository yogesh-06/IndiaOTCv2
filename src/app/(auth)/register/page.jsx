"use client";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { createRef, useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js";
import { APITemplate } from "@/component/API/Template";
import Stepper from "@/component/Stepper";

const Page = () => {
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
        // enqueueSnackbar("We are not available in your country", {
        //   variant: "error",
        // });
        setErrors([]);
        const newErrors = [];
        newErrors.push("We are not available in your country", 100);
        setErrors(newErrors);
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

    if (!email) {
      newErrors.push("email");
    }
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
        // enqueueSnackbar(
        //   "OTP has been sent to your email",
        //   { variant: "success" },
        //   { autoHideDuration: 500 }
        // );
        setErrors([]);
        const newErrors = [];
        newErrors.push("OTP has been sent to your email", 200);
        setErrors(newErrors);
        setOTPHash(response?.data?.otpHash);
        setIsSent(true);
        setTimeLeft(30);
        setIsDisabled(true);
        setStep("verifyEmail");
      } else {
        setLoading(false);
        console.log(response);
        if (response.message == "Email Already Registered") {
          // enqueueSnackbar(
          //   response.message,
          //   { variant: "info" },
          //   { autoHideDuration: 500 }
          // );
          setErrors([]);
          const newErrors = [];
          newErrors.push(response.message, 100);
          setErrors(newErrors);
        } else {
          // enqueueSnackbar(
          //   response.message,
          //   { variant: "error" },
          //   { autoHideDuration: 500 }
          // );
          setErrors([]);
          const newErrors = [];
          newErrors.push(response.message, 100);
          setErrors(newErrors);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      // enqueueSnackbar(
      //   "Something went wrong",
      //   { variant: "error" },
      //   { autoHideDuration: 500 }
      // );
      setErrors([]);
      const newErrors = [];
      newErrors.push("Something went wrong", 100);
      setErrors(newErrors);
    }
  };

  const handleOTPResend = async () => {
    const formData = new FormData();
    formData.append("email", email);
    const response = await APITemplate("user/Register", "POST", formData);
    if (response.success == true) {
      setLoading(false);
      // enqueueSnackbar(
      //   "OTP has been sent to your email",
      //   { variant: "success" },
      //   { autoHideDuration: 500 }
      // );
      setErrors([]);
      const newErrors = [];
      newErrors.push("OTP has been sent to your email", 200);
      setErrors(newErrors);

      setOTPHash(response?.data?.otpHash);
      setIsSent(true);
      setTimeLeft(30);
      setIsDisabled(true);
    } else {
      setStep("register");
      setLoading(false);
      console.log(response);
      if (response.message == "Email Already Registered") {
        // enqueueSnackbar(
        //   response.message,
        //   { variant: "info" },
        //   { autoHideDuration: 500 }
        // );
        setErrors([]);
        const newErrors = [];
        newErrors.push(response.message, 100);
        setErrors(newErrors);
      } else {
        // enqueueSnackbar(
        //   response.message,
        //   { variant: "error" },
        //   { autoHideDuration: 500 }
        // );
        setErrors([]);
        const newErrors = [];
        newErrors.push(response.message, 100);
        setErrors(newErrors);
      }
    }
  };

  const handleVerifyOTP = (enteredOtp) => {
    setLoading(true);

    setErrors([]);
    const newErrors = [];
    if (!verificationCode) newErrors.push("verificationCode", 100);
    setErrors(newErrors);
    if (newErrors.length > 0) {
      setLoading(false);
      return;
    }

    if (otpHash == CryptoJS.MD5(parseInt(enteredOtp).toString()).toString()) {
      setTimeout(() => {
        setStep("verificationSuccess");
      }, 2000);
    } else {
      newErrors.push("OTP is incorrect", 100);
      setErrors(newErrors);
      if (newErrors.length > 0) {
        setLoading(false);
        return;
      }
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
        // enqueueSnackbar("Passwords do not match", {
        //   variant: "warning",
        // });
        setErrors([]);
        const newErrors = [];
        newErrors.push("Passwords do not match", 100);
        setErrors(newErrors);

        return;
      } else {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("type", "");
        const responseLink = await APITemplate(
          "user/onboardUser",
          "POST",
          formData
        );
        if (responseLink.success == true) {
          setErrors([]);
          const newErrors = [];
          newErrors.push(responseLink.message, 200);
          setErrors(newErrors);
          window.location.href = "/kyc/verification";
        } else {
          setErrors([]);
          const newErrors = [];
          newErrors.push(responseLink.message, 100);
          setErrors(newErrors);
        }
      }
    } catch (error) {
      console.log(error);
      setErrors([]);
      const newErrors = [];
      newErrors.push("Something went wrong", 100);
      setErrors(newErrors);
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
    <div className="">
      <div
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
        <Header />

        <div className="container p-0">
          <div className="d-flex flex-column align-items-center justify-content-center gap-4 min-vh-90">
            <Stepper currentStep={"register"} data={{}} />
            <div className="col-md-5 bg-white rounded-5 shadow py-4 px-3 mb-md-5 my-2">
              {step == "register" ? (
                <div className="d-flex flex-column align-items-start gap-3">
                  <div className="w-100 text-center">
                    <h4 className="fw-bold">Create Your Account</h4>
                    <div className="arrow-line w-100 my-3" />
                  </div>

                  <div className="w-100 d-flex flex-column gap-3 mt-md-3">
                    <div className="form-group">
                      <label className="fs-6">
                        Enter your email address to receive a code
                      </label>
                      <div className="d-flex justify-content-center align-items-center position-relative">
                        <input
                          type="text"
                          name="email"
                          className={`form-control form-control-lg bg-transparent  mt-3  ${
                            (errors.includes("email") ||
                              errors.includes("invalid")) &&
                            "border-1 border-danger bg-danger-subtle"
                          }`}
                          placeholder="Enter Your Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <div
                          className="position-absolute cursor-pointer end-0 px-3 mt-3 translate-end-x"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={!password}
                        >
                          <i className="fa-regular fa-envelope fa-2xl text-secondary"></i>
                        </div>
                      </div>
                    </div>

                    {(errors.includes("email") ||
                      errors.includes("invalid")) && (
                      <p
                        className="text-danger  fw-medium m-0 p-0 pb-2"
                        style={{ fontSize: "13px" }}
                      >
                        Please enter a valid email. For emails, only the '@'
                        symbol is <br /> allowed—spaces and special characters
                        are not permitted.
                      </p>
                    )}

                    <div className="d-flex align-items-start gap-2 px-md-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="useragreement"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                      />
                      <label htmlFor="useragreement" className="">
                        I agree to the{" "}
                        <Link
                          target="_blank"
                          className="text_Primary_500 fw-semibold text-decoration-underline link-offset-3"
                          href="/terms-of-use"
                        >
                          Terms of Service
                        </Link>{" "}
                        &{" "}
                        <Link
                          target="_blank"
                          className="text_Primary_500 fw-semibold text-decoration-underline link-offset-3"
                          href="/privacy-policies"
                        >
                          Privacy Policy
                        </Link>{" "}
                      </label>
                    </div>

                    {errors.includes("isChecked") && (
                      <p
                        className="text-danger text-center fw-medium m-0 p-0 pb-2"
                        style={{ fontSize: "13px" }}
                      >
                        You need to accept our terms and privacy policy to
                        create an account.
                      </p>
                    )}

                    {errors.includes(100) && (
                      <p
                        className="text-danger text-center fw-medium m-0 p-0 pt-2 "
                        style={{ fontSize: "13px" }}
                      >
                        {errors[0]}
                      </p>
                    )}

                    {errors.includes(200) && (
                      <p
                        className="text-success text-center fw-medium m-0 p-0 pt-2 "
                        style={{ fontSize: "13px" }}
                      >
                        {errors[0]}
                      </p>
                    )}

                    <div className="d-flex flex-column mt-md-4">
                      <button
                        className="btn btn-lg Primary_500 text-white fw-medium my-3 mt-5 mt-md-5 "
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
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <span className="ms-2">Loading...</span>
                          </div>
                        ) : (
                          "Send Verification Code"
                        )}
                      </button>
                      <p className="text-center">
                        Already have an account?{" "}
                        <Link
                          href="/login"
                          className="text_Primary_500 text-decoration-underline fs-6 fw-semibold link-offset-3"
                        >
                          Login
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              ) : step == "verifyEmail" ? (
                <div className="d-flex flex-column align-items-center gap-3 py-3 p-0">
                  <div className="w-100 text-center">
                    <h4 className="fw-bold">Email Verification</h4>
                    <div className="arrow-line w-100 my-3" />
                  </div>
                  <div className="w-100 text-center">
                    <p className="text-muted p-1">
                      Enter the verification code sent to{" "}
                      <a className="text-primary"> {email}</a>
                    </p>
                  </div>
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                      {verificationCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={inputRefs.current[index]}
                          type="text"
                          maxLength="1"
                          className={`form-control mx-md-1 mx-0 text-center Primary_50_light
                            ${digit ? "border_primary" : ""}
                            ${
                              errors.includes(100) &&
                              "border border-1 border-danger bg-danger-subtle"
                            }`}
                          style={{
                            maxWidth: "50px",
                            borderRadius: "8px",
                            fontSize: "1.2rem",
                          }}
                          value={digit}
                          onChange={(e) => handleInputChange(index, e)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={(e) => handlePaste(index, e)}
                        />
                      ))}
                    </div>

                    {errors.includes(100) && (
                      <p className="text-danger fw-semibold small text-center">
                        The code you entered is incorrect. Please try again
                      </p>
                    )}

                    <div
                      className="fw-normal text_Primary_500 cursor-pointer mb-4 mt-md-3"
                      onClick={handleOTPResend}
                      disabled={isDisabled}
                    >
                      {isDisabled
                        ? `Resend code in ${timeLeft}s`
                        : "Resend code"}
                      <div className="Primary_500 border border-1 border_primary"></div>
                    </div>

                    <small className="text-muted fw-light text-center cursor-pointer p-1 mt-4">
                      Didn&apos;t receive a code?
                      <br />
                      Check your span folder, or{" "}
                      <a
                        className="text_Primary_500 fw-semibold fs-6 text-decoration-underline"
                        onClick={() => setStep("register")}
                      >
                        try a different email address
                      </a>
                    </small>
                  </div>
                </div>
              ) : step == "verificationSuccess" ? (
                <div className="d-flex flex-column align-items-center gap-3 p-2">
                  <div className="w-100 text-center">
                    <h4 className="fw-bold">Email Verification</h4>
                    <div className="arrow-line w-100 mt-3" />
                  </div>

                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <img
                      src="/images/verification-success.png"
                      alt=""
                      style={{
                        width: "88px",
                      }}
                      className="img-fluid mb-3"
                    />
                    <h6 className="fw-bold m-0">Success !!</h6>
                    <p className="text-muted text-center">
                      You have been successfully authenticated
                    </p>
                  </div>
                  <button
                    className="btn Primary_500 text-white w-100 mt-md-5"
                    onClick={() => setStep("setPassword")}
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
                        Continue <i className="fa-solid fa-arrow-right"></i>
                      </>
                    )}
                  </button>
                </div>
              ) : step == "setPassword" ? (
                <div className="d-flex flex-column align-items-center gap-3 py-md-3 px-2">
                  <div className="w-100 text-center">
                    <h4 className="fw-bold">Set Your Password</h4>
                    <div className="arrow-line w-100 my-3" />
                  </div>
                  <div className="w-100 d-flex flex-column gap-4 mb-2">
                    <div className="form-group">
                      <label
                        className={`mb-2 ${
                          errors.includes("password") && "text-danger"
                        }`}
                      >
                        Password
                      </label>
                      <div className="d-flex justify-content-center position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className={`form-control form-control-lg ${
                            errors.includes("passwordStrong") &&
                            "border border-1 border-danger bg-danger-subtle"
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
                            <i className="fa-solid fa-eye-slash"></i>
                          ) : (
                            <i className="fa-solid fa-eye"></i>
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
                      <div className="d-flex justify-content-center align-items-center position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          className={`form-control form-control-lg  mt-2 ${
                            errors.includes("passwordStrong") &&
                            "border border-1 border-danger bg-danger-subtle"
                          }`}
                          placeholder=""
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <div
                          className="position-absolute cursor-pointer end-0 px-3 mt-2 me-1 translate-end-x"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={!confirmPassword}
                        >
                          {showPassword ? (
                            <i className="fa-solid fa-eye-slash"></i>
                          ) : (
                            <i className="fa-solid fa-eye"></i>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* {errors.includes("passwordStrong") && ( */}
                    <ul className="text-danger">
                      {(password?.length < 8 ||
                        confirmPassword?.length < 8) && (
                        <li className="mt-1">
                          Password must contain at least 8 characters.
                        </li>
                      )}
                      {errors.includes("passwordStrong") && (
                        <li className="mt-1">
                          Include upper, lower, a number, and a special
                          character.
                        </li>
                      )}
                      {password != confirmPassword && (
                        <li className="mt-1">Password not matched.</li>
                      )}
                    </ul>

                    <div className="password-strength mt-md-2 px-1">
                      <div className="d-flex justify-content-between ">
                        <small
                          className={`fw-bold
                            ${strength >= 1 ? "text-danger" : "text-muted"}
                         `}
                        >
                          Low
                        </small>
                        <small
                          className={`fw-bold
                            ${strength >= 1 ? "text-warning" : "text-muted"}
                         `}
                        >
                          Medium
                        </small>
                        <small
                          className={`fw-bold
                            ${strength >= 1 ? "text-success" : "text-muted"}
                         `}
                        >
                          High
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
                    <div className="d-flex justify-content-between mt-md-3">
                      <ul className="list-unstyled">
                        <li className="d-flex align-items-start align-items-md-center mb-2">
                          <img
                            alt=""
                            src="/svgs/check-circle.svg"
                            className="rounded-2"
                            height="20"
                          />
                          <span className="ms-2 text-muted">
                            Minimum 8 characters
                          </span>
                        </li>
                        <li className="d-flex align-items-start align-items-md-center mb-2">
                          <img
                            alt=""
                            src="/svgs/check-circle.svg"
                            className="rounded-2"
                            height="20"
                          />
                          <span className="ms-2 text-muted">
                            At least one uppercase letter
                          </span>
                        </li>
                        <li className="d-flex align-items-start align-items-md-center mb-2">
                          <img
                            alt=""
                            src="/svgs/check-circle.svg"
                            className="rounded-2"
                            height="20"
                          />
                          <span className="ms-2 text-muted">
                            At least one lowercase letter
                          </span>
                        </li>
                      </ul>
                      <ul className="list-unstyled">
                        <li className="d-flex align-items-start align-items-md-center mb-2">
                          <img
                            alt=""
                            src="/svgs/check-circle.svg"
                            className="rounded-2"
                            height="20"
                          />
                          <span className="ms-2 text-muted">
                            At least one number
                          </span>
                        </li>
                        <li className="d-flex align-items-start align-items-md-center mb-2">
                          <img
                            alt=""
                            src="/svgs/check-circle.svg"
                            className="rounded-2"
                            height="20"
                          />
                          <span className="ms-2 text-muted">
                            At least one symbol
                          </span>
                        </li>
                      </ul>
                    </div>

                    <button
                      // disabled={
                      //   !password ||
                      //   !confirmPassword ||
                      //   password != confirmPassword ||
                      //   loading
                      // }
                      className="btn btn-lg Primary_500 text-white"
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
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="text-center d-md-none">
              <img
                src="/images/logo-watermark-png.png"
                className="img-fluid"
                width={230}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
