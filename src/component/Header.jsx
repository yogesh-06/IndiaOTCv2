"use client";
import Link from "next/link";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { APITemplate } from "./API/Template";
import SocialIcon from "./SocialIcon";
import AccordionItem from "./AccordionItem";
import { Nav_Items } from "@/utils/utils";

export default function Header() {
  const { user } = useUser();
  const [userData, setUserData] = useState("");

  async function logout() {
    const response = await APITemplate("user/logout", "POST");
    jsCookie.remove("userSession");
    if (response.success == true) {
      // enqueueSnackbar(
      //   "Logout Successful",
      //   { variant: "success" },
      //   {
      //     autoHideDuration: 500,
      //   }
      // );
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }

  useEffect(() => {
    setUserData(user);
  }, [user]);

  return (
    <nav className="navbar navbar-dark navbar-expand-lg py-4">
      <div className="container">
        <Link className="navbar-brand" href="/">
          <img
            src="/images/logo.png"
            width="251"
            height="31"
            className="img-fluid"
          />
        </Link>
        {/* TOGGLE BUTTON - unchanged */}
        <button
          className="btn bg-transparent border-0 cursor-pointer text-light d-md-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#navbarOffcanvas"
          aria-controls="navbarOffcanvas"
          aria-expanded="false"
          // aria-label="Toggle navigation"
        >
          <i className="fa-solid fa-bars-staggered fa-flip-horizontal fa-2xl"></i>
        </button>

        {/* OFFCANVAS MENU */}
        <div
          className="offcanvas offcanvas-start w-100"
          tabIndex="-1"
          id="navbarOffcanvas"
          aria-labelledby="navbarOffcanvasLabel"
          data-bs-scroll="true"
          data-bs-backdrop="false"
        >
          <div className="offcanvas-header py-4 px-3">
            <Link className="navbar-brand" href="/">
              <img
                src="/images/logo.png"
                width="251"
                height="31"
                className="img-fluid"
                alt="Logo"
              />
            </Link>
            <button
              type="button"
              className="btn ms-auto"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <i class="fa-solid fa-xmark fa-2xl"></i>
            </button>
          </div>

          <div className="offcanvas-body">
            <div className="accordion d-md-none px-2" id="accordionExample">
              {Nav_Items.map((item, index) => {
                return (
                  <div key={index} className="mb-5">
                    <AccordionItem id={index + 1} item={item} />
                  </div>
                );
              })}
            </div>

            <ul className="navbar-nav align-items-center ms-auto mb-2 mb-lg-0 gap-4">
              <li className="nav-item d-none d-md-block">
                <Link
                  className="nav-link fw-medium px-1 tex text_Primary_500 active border_primary"
                  aria-current="page"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item d-none d-md-block">
                <Link
                  className="nav-link fw-medium px-1 text-dark"
                  href="/exchange"
                >
                  Exchange
                </Link>
              </li>
              <li className="nav-item d-none d-md-block">
                <Link
                  className="nav-link fw-medium px-1 text-dark"
                  href="/about"
                >
                  Company
                </Link>
              </li>
              <li className="nav-item d-none d-md-block">
                <Link
                  className="nav-link fw-medium px-1 text-dark"
                  href="/about"
                >
                  Resource
                </Link>
              </li>

              {userData?._id ? (
                <button onClick={logout} className="btn Primary_500 text-white">
                  Logout
                </button>
              ) : (
                <div className="d-flex justify-content-end gap-3 w-100">
                  <Link
                    href={`/register`}
                    className="btn btn-lg fw-semibold rounded-3 py-2 Primary_500 text-white"
                  >
                    Get Started
                  </Link>
                  <Link href={`/register`} className="d-block">
                    <SocialIcon
                      icon={
                        <svg
                          viewBox="0 0 496 512"
                          height="1.8em"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="white"
                        >
                          <path
                            d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"
                            fill="white"
                          ></path>
                        </svg>
                      }
                      bgColor="#24a1de"
                      borderColor="rgba(226, 226, 226, 0.466)"
                    />
                  </Link>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
