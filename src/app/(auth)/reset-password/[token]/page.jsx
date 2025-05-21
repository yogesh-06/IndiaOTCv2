"use client";

import { APITemplate } from "@/component/API/Template";
import Footer from "@/component/Footer";
import { checkUserCountry, checkUserVPNValid } from "@/component/global";
import Header from "@/component/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";

const Page = ({ params }) => {
  const [passResetStep, setPassResetStep] = useState("");
  const [user, setUser] = useState({});

  const router = useRouter();
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
    const fetchData = async () => {
      const response = await APITemplate(
        "user/getUserByResetToken/" + params.token,
        "GET"
      );
      if (!response.success) {
        setPassResetStep("expiredToken");
      }
      setUser(response.data);
    };
    fetchData();
  }, []);

  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});

  const ResetPassword = async () => {
    setLoading(true);
    try {
      // let isValidUser = await checkUserVPNValid();

      // if (!isValidUser) {
      //   router.push("/403");
      //   return;
      // }
      if (password !== passwordConf) {
        setLoading(false);
        enqueueSnackbar("Passwords do not match", {
          variant: "warning",
        });
        return;
      } else {
        const formData = new FormData();
        formData.append("id", user._id);
        formData.append("password", password);
        const responseLink = await APITemplate(
          "user/changePassword",
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
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          setResponse(responseLink);
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
                        <h3>Change Your Password </h3>
                        <p className="">Enter the password you want to use.</p>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="form-control form-control-lg mt-1"
                            id="password"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="passwordConf">Confirm Password</label>
                          <input
                            type="password"
                            onChange={(e) => setPasswordConf(e.target.value)}
                            value={passwordConf}
                            className="form-control form-control-lg mt-1"
                            id="passwordConf"
                          />
                        </div>

                        <button
                          className="btn btn-primary btn-lg rounded-pill my-3"
                          onClick={ResetPassword}
                          disabled={loading}
                        >
                          {loading && (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          )}
                          Set Password
                        </button>
                      </div>
                    </>
                  )}

                  {passResetStep === "expiredToken" && (
                    <>
                      <div className="d-flex flex-column gap-2 text-center">
                        <div
                          style={{
                            height: "70px",
                            width: "70px",
                            margin: "0 auto",
                          }}
                        >
                          <div className="circle-border">
                            <div className="circle">
                              <div className="error"></div>
                            </div>
                          </div>
                        </div>
                        <h3>Password Reset Request Expired</h3>
                        <p className="">Please go back and try again</p>
                        <a href={response?.message} target="_blank">
                          {response?.message}
                        </a>
                      </div>
                      <div id="login-base" className="d-flex flex-column gap-2">
                        <Link
                          className="btn btn-primary rounded-pill my-3"
                          href="/forgot-password"
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
