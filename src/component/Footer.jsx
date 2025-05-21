"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { APITemplate } from "./API/Template";
import { useRouter } from "next/navigation";

export default function Footer({ language = "en" }) {
  const [settings, setSettings] = useState({
    siteName: "",
    logo: "",
    email: "",
    address: "",
    description: "",
    telegramContact: "",
    telegramChannel: "",
    whatsappSupport: "",
    socialMedia: {
      instagram: "",
      linkedin: "",
      twitter: "",
      medium: "",
      reddit: "",
      pinterest: "",
      facebook: "",
      discord: "",
      quora: "",
    },
    status: "active",
  });

  const fetchSettings = async () => {
    const response = await APITemplate("website/settings/getSettings", "GET");

    if (response.success) {
      setSettings(response.data);
    }
  };
  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <footer className="py-4 py-md-5 Primary_700">
      <div>
        <div className="container border-bottom border-dark pb-4">
          <div className="d-flex gap-24 flex-wrap align-items-center justify-content-between">
            <div className="">
              <div className="footer-logo-wrapper text-start">
                <Link href="/">
                  <img
                    src={settings?.logo ? settings?.logo : "/images/logo.png"}
                    width={226}
                    alt=""
                    className="img-fluid"
                  />
                </Link>
              </div>
            </div>
            <div className="">
              <div className="d-flex gap-24 flex-wrap">
                <Link href={settings?.telegramChannel} target="_blank">
                  {" "}
                  <img
                    src="/images/telegram.png"
                    className="img-fluid"
                    width={32}
                    height={32}
                    alt=""
                  />
                </Link>
                <Link href={settings?.socialMedia?.instagram} target="_blank">
                  {" "}
                  <img
                    src="/images/instagram.png"
                    className="img-fluid"
                    width={32}
                    height={32}
                    alt=""
                  />
                </Link>
                <Link href={settings?.socialMedia?.linkedin} target="_blank">
                  <img
                    src="/images/linkedin.png"
                    className="img-fluid"
                    width={32}
                    height={32}
                    alt=""
                  />
                </Link>
                <Link href={settings?.socialMedia?.twitter} target="_blank">
                  <img
                    src="/images/xtwitter.png"
                    className="img-fluid"
                    width={32}
                    height={32}
                    alt=""
                  />
                </Link>
                <Link href={settings?.socialMedia?.medium} target="_blank">
                  <img
                    src="/images/medium.png"
                    className="img-fluid"
                    width={32}
                    height={32}
                    alt=""
                  />
                </Link>
                <Link href={settings?.socialMedia?.reddit} target="_blank">
                  <img
                    src="/images/reddit.png"
                    className="img-fluid"
                    width={32}
                    height={32}
                    alt=""
                  />
                </Link>
                <Link href={settings?.socialMedia?.pinterest} target="_blank">
                  <img
                    src="/images/pinterest.png"
                    className="img-fluid"
                    width={32}
                    height={32}
                    alt=""
                  />
                </Link>
                <Link href={settings?.socialMedia?.facebook} target="_blank">
                  <img
                    src="/images/facebook.png"
                    className="img-fluid"
                    width={32}
                    height={32}
                    alt=""
                  />
                </Link>
                {/* <Link href={settings?.socialMedia?.discord} target="_blank">
                  <img
                    src="/images/discord.png"
                    className="img-fluid"
                    width={32}
                    height={32}
                    alt=""
                  />
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-4 py-md-5 py-xl-7 py-xxl-10">
        <div className="container">
          <div className="row gy-4 gy-md-0">
            <div className="col-lg-5  col-md-12 fs-5 text-white">
              {settings?.description}
            </div>
            <div className="col-lg-3 offset-lg-1 col-md-6">
              <div className="link-wrapper">
                <h4 className="mb-3 fw-bold fs-7 text-light">Explore</h4>
                <ul className="m-0 list-unstyled">
                  <li className="mb-4">
                    <Link
                      href={`/${language}/`}
                      className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-5 link-light"
                    >
                      Home
                    </Link>
                  </li>
                  {/* <li className="mb-4">
                    <Link
                      href={`/${language}/blog`}
                      className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-5 link-light"
                    >
                      Blogs
                    </Link>
                  </li> */}
                  <li className="mb-4">
                    <Link
                      href={`/${language}/buy`}
                      className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-5 link-light"
                    >
                      Buy
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link
                      href={`/${language}/sell`}
                      className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-5 link-light"
                    >
                      Sell
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link
                      href={`/${language}/about`}
                      className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-5 link-light"
                    >
                      Company
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link
                      href={`/${language}/contact`}
                      className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-5 link-light"
                    >
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="link-wrapper">
                <h4 className="mb-3 fw-bold fs-7 text-light">Contact us</h4>
                <ul className="m-0 list-unstyled">
                  <li className="mb-4">
                    <a
                      href="mailto:support@indiaotc.com"
                      target="_blank"
                      className="d-flex gap-12 align-items-center link-opacity-75 link-opacity-100-hover text-decoration-none fs-5 link-light"
                    >
                      <div>
                        <i className="fa fa-envelope"></i>
                      </div>
                      <div>{settings?.email}</div>
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="#!"
                      className="d-flex gap-12  link-opacity-75 link-opacity-100-hover text-decoration-none fs-5 link-light"
                    >
                      <div>
                        <i className="fa fa-location-dot"></i>
                      </div>
                      <div>{settings?.address}</div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <div className="container border-top border-dark pt-4">
          <div className="row gy-3 align-items-lg-center">
            <div className="col-12 col-lg-6 order-1 order-lg-0">
              <div className="copyright-wrapper d-block mb-1 fs-7 text-light text-start">
                &copy; {new Date().getFullYear()}. All Rights Reserved.
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="link-wrapper">
                <ul className="m-0 list-unstyled d-flex justify-content-centerX justify-content-lg-end gap-2 gap-md-3">
                  <li>
                    <a
                      href={`/${language}/terms-of-use`}
                      className="link-underline-opacity-0 link-opacity-75-hover link-offset-1 link-light fs-8 d-flex align-items-center pe-2 pe-md-3 bsb-sep bsb-sep-border"
                    >
                      Terms of use
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/${language}/privacy-policies`}
                      className="link-underline-opacity-0 link-opacity-75-hover link-offset-1 link-light fs-8 d-flex align-items-center pe-2 pe-md-3 bsb-sep bsb-sep-border"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/${language}/cookie-policies`}
                      className="link-underline-opacity-0 link-opacity-75-hover link-offset-1 link-light fs-8 d-flex align-items-center pe-2 pe-md-3 bsb-sep bsb-sep-border"
                    >
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
