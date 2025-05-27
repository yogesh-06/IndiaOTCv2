"use client";

import { APITemplate } from "@/component/API/Template";
import Footer from "@/component/Footer";
import { checkUserCountry, checkUserVPNValid } from "@/component/global";
import Header from "@/component/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useState, useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("login");
  const [MFA, setMFA] = useState("");
  const [userID, setUserID] = useState("");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlesubmit = async () => {
    setLoading(true);
    try {
      // let isValidUser = await checkUserVPNValid();

      // if (!isValidUser) {
      //   router.push("/403");
      //   return;
      // }
      if (email == "" || password == "") {
        setLoading(false);
        enqueueSnackbar(
          "Please fill all the fields",
          { variant: "warning" },
          { autoHideDuration: 500 }
        );
        return;
      } else if (!emailRegex.test(email)) {
        setLoading(false);
        enqueueSnackbar("Please enter a valid email address", {
          variant: "warning",
        });
        return;
      } else {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        const response = await APITemplate("user/login", "POST", formData);
        // console.log(response);
        if (response.success == true) {
          setLoading(false);
          if (response.message == "toggleMFA") {
            setUserID(response.data);
            setStep("2fa");
          } else {
            enqueueSnackbar(
              "Login Successful",
              { variant: "success" },
              { autoHideDuration: 500 }
            );
            setTimeout(() => {
              // router.push("/kyc/verification");
              window.location.href = "/kyc/verification";
            }, 500);
          }
        } else {
          setLoading(false);
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
        error.response?.data?.message || error.message,
        { variant: "error" },
        { autoHideDuration: 500 }
      );
    }
  };

  const handle2fa = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", userID);
      formData.append("token", MFA);
      const response = await APITemplate("user/Verify2fa", "POST", formData);
      // console.log(response);
      if (response.success == true) {
        setLoading(false);
        enqueueSnackbar(
          "Login Successful",
          { variant: "success" },
          { autoHideDuration: 500 }
        );
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      } else {
        setLoading(false);
        enqueueSnackbar(
          response.message,
          { variant: "error" },
          { autoHideDuration: 500 }
        );
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      enqueueSnackbar(
        error.response?.data?.message || error.message,
        { variant: "error" },
        { autoHideDuration: 500 }
      );
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

  return (
    <>
      <SnackbarProvider />
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
                {step == "login" ? (
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex flex-column gap-2">
                      <h3>Login your account</h3>
                      <p className="">
                        IndiaOTC, one of the fastest-growing digital currency
                        trading desks.
                      </p>
                    </div>
                    <form className="d-flex flex-column gap-2">
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="text"
                          className="form-control form-control-lg mt-1"
                          id="email"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          type="password"
                          className="form-control form-control-lg mt-1"
                          id="password"
                        />
                      </div>

                      <button
                        disabled={loading}
                        onClick={handlesubmit}
                        className="btn btn-primary my-3"
                      >
                        <div className="d-flex align-items-center ">
                          <div>Login</div>
                          {loading && (
                            <div
                              className="spinner-border spinner-border-sm ms-2 "
                              role="status"
                              aria-hidden="true"
                            ></div>
                          )}
                        </div>
                      </button>
                      <div
                        id="login-base"
                        className="d-flex flex-column text-center gap-1 py-3"
                      >
                        <Link
                          className="text-secondary text-decoration-none fs-6 "
                          href="/forgot-password"
                        >
                          Forgot Password
                        </Link>

                        <p className="">
                          Don&apos;t have an account?{" "}
                          <Link
                            href="/register"
                            className="text-secondary text-decoration-none fs-6"
                          >
                            Create Account
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="d-flex flex-column text-center gap-4">
                    <div className="d-flex flex-column gap-2">
                      <h3>Two-factor authentication</h3>
                      <p className="">
                        Enter the 6-digit code from your authenticator app, such
                        as Google Authenticator, Microsoft Authenticator, or
                        1Password.
                      </p>
                    </div>
                    <form className="d-flex flex-column gap-2">
                      <div className="form-group">
                        {/* <label ></label> */}
                        <input
                          type="text"
                          className="form-control text-center form-control-lg mt-1"
                          placeholder="XXX XXX"
                          onChange={(e) => setMFA(e.target.value)}
                          value={MFA}
                        />
                      </div>

                      <button
                        disabled={loading}
                        onClick={handle2fa}
                        className="btn btn-primary my-3"
                      >
                        <div className="d-flex align-items-center ">
                          <div>Login</div>
                          {loading && (
                            <div
                              className="spinner-border spinner-border-sm ms-2 "
                              role="status"
                              aria-hidden="true"
                            ></div>
                          )}
                        </div>
                      </button>
                    </form>
                  </div>
                )}
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
