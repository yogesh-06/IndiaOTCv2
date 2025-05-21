"use client";

import { APITemplate } from "@/component/API/Template";
import Footer from "@/component/Footer";
import { checkUserCountry } from "@/component/global";
import Header from "@/component/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [passResetStep, setPassResetStep] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const VerifyEmail = async () => {
    setLoading(true);
    try {
      // let isValidUser = await checkUserVPNValid();

      // if (!isValidUser) {
      //   router.push("/403");
      //   return;
      // }
      if (!emailRegex.test(email)) {
        setLoading(false);
        enqueueSnackbar("Please enter a valid email address", {
          variant: "warning",
        });
        return;
      } else {
        const formData = new FormData();
        formData.append("email", email);
        const responseLink = await APITemplate(
          "user/verifyForgotPassword",
          "POST",
          formData
        );
        if (responseLink.success == true) {
          setLoading(false);
          setResponse(responseLink);
          enqueueSnackbar(
            responseLink.message,
            { variant: "success" },
            { autoHideDuration: 500 }
          );
          setPassResetStep("verifyEmail");
        } else {
          setLoading(false);
          enqueueSnackbar(
            responseLink.message,
            { variant: "error" },
            { autoHideDuration: 500 }
          );
        }
      }
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(
        "Something went wrong",
        { variant: "error" },
        { autoHideDuration: 500 }
      );
    }
  };

  return (
    <>
      <Header />
      <div className="container-fluid px-0">
        <div className="row h-100">
          <div className="col-md-6 bg-light">
            <div className="p-5">
              <img
                src="https://preview.colorlib.com/theme/bootstrap/login-form-07/images/undraw_remotely_2j6y.svg"
                alt="Image"
                className="img-fluid"
              />
            </div>
          </div>
          <div className="col-md-6 shadow p-md-0 p-5">
            <div className="row align-items-center justify-content-center h-100">
              <div className="col-md-8">
                <div className="d-flex flex-column gap-4">
                  {passResetStep === "" && (
                    <>
                      <div className="d-flex flex-column gap-2">
                        <h3>Forgot your password </h3>
                        <p className="">
                          Enter your e-mail address for password change request.
                        </p>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <div className="form-group">
                          <label htmlFor="email">Your Email</label>
                          <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="form-control form-control-lg mt-1"
                            id="email"
                          />
                        </div>

                        <button
                          className="btn btn-primary btn-lg rounded-pill my-3"
                          onClick={VerifyEmail}
                          disabled={loading}
                        >
                          {loading && (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          )}
                          Send Reset Link
                        </button>
                        <div
                          id="login-base"
                          className="d-flex flex-column text-center gap-1 py-3"
                        >
                          <p className="">
                            Don&apos;t have an account?{" "}
                            <Link
                              href="/register"
                              className="text-secondary text-decoration-none fs-6"
                            >
                              Create Account
                            </Link>
                          </p>
                          <p className="">
                            Password recalled?{" "}
                            <Link
                              href="/login"
                              className="text-secondary text-decoration-none fs-6"
                            >
                              Login
                            </Link>
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {passResetStep === "verifyEmail" && (
                    <>
                      <div className="d-flex flex-column gap-2 text-center">
                        <div className="success-checkmark">
                          <div className="check-icon">
                            <span className="icon-line line-tip"></span>
                            <span className="icon-line line-long"></span>
                            <div className="icon-circle"></div>
                            <div className="icon-fix"></div>
                          </div>
                        </div>
                        <h3>Reset Link has been sent to your email</h3>
                        <p className="">
                          Please check your email and follow the instructions
                        </p>
                      </div>
                      <div id="login-base" className="d-flex flex-column gap-2">
                        <Link
                          className="btn btn-primary rounded-pill my-3"
                          href="/login"
                        >
                          Go Back
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
