"use client";
import Link from "next/link";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { APITemplate } from "./API/Template";
import { useUser } from "@/context/UserContext";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { languages } from "./global";

export default function Header({ currentLang }) {
  const [isHiddenLocale, setHiddenLocale] = useState(true);
  const { user } = useUser();
  const [active, setActive] = useState("");
  const [userData, setUserData] = useState({});
  const [settings, setSettings] = useState({});
  const [language, setLanguage] = useState(currentLang || "en");

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    const newPathname = window.location.pathname.replace(
      /^\/[a-z]{2}/,
      `/${lang}`
    );
    window.location.href = newPathname;
  };

  const fetchSettings = async () => {
    const response = await APITemplate("website/settings/getSettings", "GET");
    if (response.success) {
      setSettings(response.data);
    }
  };

  async function logout() {
    const response = await APITemplate("user/logout", "POST");
    jsCookie.remove("userSession");
    if (response.success == true) {
      enqueueSnackbar(
        "Logout Successful",
        { variant: "success" },
        {
          autoHideDuration: 500,
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
    const path = window.location.pathname;
    const pathArr = path.split("/");
    if (languages.includes(pathArr[1])) {
      setHiddenLocale(false);
    }
    setActive(pathArr[2]);
    fetchSettings();
  }, []);

  return (
    // <nav className="navbar navbar-dark navbar-expand-lg Primary_400 position-fixed w-100 top-0 z-999">
    <nav className="navbar navbar-dark navbar-expand-lg Primary_400 ">
      <SnackbarProvider />
      <div className="container">
        <Link className="navbar-brand" href="/">
          <img
            src={settings?.logo ? settings?.logo : "/images/logo.png"}
            width="150"
            className="img-fluid"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav w-100 mb-2 mb-lg-0 gap-4">
            <li className="nav-item w-fit">
              <Link
                className={`nav-link px-1 ${
                  active === "/" && "active border-bottom"
                } `}
                aria-current="page"
                href={`/${language}/`}
              >
                Home
              </Link>
            </li>
            <li className="nav-item w-fit">
              <Link
                className={`nav-link px-1 ${
                  active === "buy" && "active border-bottom"
                } `}
                href={`/${language}/buy`}
              >
                Buy
              </Link>
            </li>
            <li className="nav-item w-fit">
              <Link
                className={`nav-link px-1 ${
                  active === "sell" && "active border-bottom"
                } `}
                href={`/${language}/sell`}
              >
                Sell
              </Link>
            </li>
            <li className="nav-item w-fit">
              <Link
                className={`nav-link px-1 ${
                  active === "about" && "active border-bottom"
                } `}
                href={`/${language}/about`}
              >
                Company
              </Link>
            </li>
            {/* <li className="nav-item w-fit">
              <Link
                className={`nav-link px-1 ${
                  active === "blog" && "active border-bottom"
                } `}
                href={`/${language}/blog`}
              >
                Blogs
              </Link>
            </li> */}
            <li className="nav-item w-fit">
              <Link
                className={`nav-link px-1 ${
                  active === "contact" && "active border-bottom"
                } `}
                href={`/${language}/contact`}
              >
                Support
              </Link>
            </li>
            {/* dropdown */}
            {/* {!isHiddenLocale && (
              <li className="nav-item dropdown w-fit ">
                <a
                  className="nav-link dropdown-toggle px-1 text-uppercase active"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {currentLang}
                </a>
                <ul
                  className="dropdown-menu w-fit"
                  aria-labelledby="navbarDropdown"
                >
                  {languages.map((lang, index) => {
                    return (
                      <li key={index}>
                        <a
                          className="dropdown-item text-uppercase"
                          href="#"
                          onClick={() => handleLanguageChange(lang)}
                        >
                          {lang}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </li>
            )} */}
            <div className="ms-auto">
              <div className="d-flex gap-3 flex-wrap align-items-center ">
                {userData?._id ? (
                  <li className="nav-item dropdown w-fit " data-bs-theme="dark">
                    <button
                      className="nav-link dropdown-toggle px-1 active"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Hi! {userData?.firstName + " " + userData?.lastName}
                    </button>
                    <ul
                      className="dropdown-menu-dark dropdown-menu w-fit p-2"
                      aria-labelledby="navbarDropdown"
                    >
                      <li className="py-1">
                        <Link className="dropdown-item" href="/dashboard">
                          Dashboard
                        </Link>
                      </li>
                      <li className="py-1">
                        <a className="dropdown-item" href="/orders">
                          Orders
                        </a>
                      </li>
                      <li className="py-1">
                        <Link className="dropdown-item" href="/kyc">
                          KYC
                        </Link>
                      </li>
                      <li className="pb-1 text-end">
                        <button
                          className="btn btn-danger ms-auto"
                          onClick={logout}
                        >
                          <i className="fas fa-power-off"></i>
                        </button>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <>
                    <Link
                      href={`/register`}
                      className="btn rounded-pill px-3 fw-bold bg-white"
                    >
                      Register
                    </Link>
                    <Link
                      href={`/login`}
                      className="btn rounded-pill px-3 fw-bold bg-white"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}
