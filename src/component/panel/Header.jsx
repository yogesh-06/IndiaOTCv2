"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { APITemplate } from "@/component/API/Template.js";
import { useUser } from "@/context/UserContext";
import jsCookie from "js-cookie";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function Header() {
  const { user } = useUser();
  const [userData, setUserData] = useState({});
  useEffect(() => {
    setUserData(user);
  }, [user]);
  const [settings, setSettings] = useState({});
  const [language, setLanguage] = useState("en");

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

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    window.location.reload();
  };

  const [active, setActive] = useState("");
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
    const path = window.location.pathname;
    const pathArr = path.split("/");
    setActive(pathArr[1]);
    fetchSettings();
    setLanguage(localStorage.getItem("lang"));
  }, []);

  return (
    // <nav className="navbar navbar-dark navbar-expand-lg Primary_400 position-fixed w-100 top-0 z-999">
    <nav className="navbar navbar-dark navbar-expand-lg Primary_400 ">
      <SnackbarProvider />
      <div className="container gap-3">
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
          <div className="d-flex w-100 justify-content-between">
            <ul className="navbar-nav mb-2 mb-lg-0 gap-4">
              <li className="nav-item w-fit">
                <Link
                  className={`nav-link px-1 ${
                    active === "" && "active border-bottom"
                  }`}
                  aria-current="page"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item w-fit">
                <Link
                  className={`nav-link px-1 ${
                    active === "buy" && "active border-bottom"
                  }`}
                  href="/buy"
                >
                  Buy
                </Link>
              </li>
              <li className="nav-item w-fit">
                <Link
                  className={`nav-link px-1 ${
                    active === "sell" && "active border-bottom"
                  }`}
                  href="/sell"
                >
                  Sell
                </Link>
              </li>
              <li className="nav-item w-fit">
                <Link
                  className={`nav-link px-1 ${
                    active === "about" && "active border-bottom"
                  }`}
                  href="/about"
                >
                  Company
                </Link>
              </li>
              {/* <li className="nav-item w-fit">
                <Link
                  className={`nav-link px-1 ${
                    active === "blog" && "active border-bottom"
                  }`}
                  href="/blog"
                >
                  Blogs
                </Link>
              </li> */}
              <li className="nav-item w-fit">
                <Link
                  className={`nav-link px-1 ${
                    active === "contact" && "active border-bottom"
                  }`}
                  href="/contact"
                >
                  Support
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0 gap-4">
              <div className="d-flex gap-4 flex-wrap align-items-center">
                <li className="nav-item dropdown ">
                  <button
                    className="nav-link dropdown-toggle px-1 active"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-user text-white fa-lg pe-1"></i>
                  </button>

                  <ul
                    className="dropdown-menu dropdown-menu-end p-3 shadow-lg rounded-3"
                    aria-labelledby="navbarDropdown"
                  >
                    <li className="d-flex gap-3 mb-3">
                      <img
                        src={
                          userData?.profilePic || "/images/userPlaceholder.png"
                        }
                        alt="Profile"
                        className="rounded-2 object-fit-cover"
                        width="60"
                        height="60"
                      />
                      <div className="d-flex flex-column align-items-start justify-content-center gap-1">
                        <h6 className="mb-0">
                          Hi! {userData?.firstName + " " + userData?.lastName}
                        </h6>
                        <small>{userData?.email}</small>
                        {/* <p className="badge bg-success">Active</p> */}
                      </div>
                    </li>

                    <hr className="dropdown-divider" />

                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center ps-1 pb-2"
                        href="/dashboard"
                      >
                        <i className="fas fa-tachometer-alt me-3"></i> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center ps-1 pb-2"
                        href="/orders"
                      >
                        <i className="fas fa-user-cog me-3"></i> Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center ps-1 pb-2"
                        href="/kyc"
                      >
                        <i className="fas fa-id-card me-3"></i> KYC
                      </Link>
                    </li>

                    <hr className="dropdown-divider" />

                    <li className="text-center py-1">
                      <button className="btn btn-danger w-100" onClick={logout}>
                        <i className="fas fa-sign-out-alt me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown w-fit">
                  <i className="fa-solid fa-bell fa-lg text-white "></i>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
