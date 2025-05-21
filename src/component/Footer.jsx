import Link from "next/link";
import { Heading } from "./Heading";
import SocialIcon from "./SocialIcon";
// import "./Footer.css";

export default function Footer() {
  return (
    <div
      className="pt-72"
      style={{ background: "linear-gradient(to bottom, #5761D7, #2E3371)" }}
    >
      {/* <button className="Btn">
        <span className="svgContainer">
          <svg fill="white" viewBox="0 0 496 512" height="1.6em">
            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
          </svg>
        </span>
        <span className="BG"></span>
      </button> */}
      <div className="container">
        <footer className="px-md-5">
          <section className="container-fluid">
            <div className="row justify-content-between gy-4">
              <div className="col-md-6">
                <div className="d-flex flex-column align-items-start gap-4">
                  <div className="text-start">
                    <Link href="/">
                      <img
                        src={"/images/footer-logo.png"}
                        style={{
                          minWidth: "226px",
                          maxWidth: "251px",
                        }}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>

                  <div className="fs-6 text-white">
                    <span className="fw-bold">DubaiOTC </span> is a premier
                    crypto OTC platform based in Dubai, enabling individuals and
                    businesses to buy and sell crypto with AED. We specialize in
                    bulk trades, fast settlements, and secure service — offering
                    tailored solutions to crypto traders, investors, and NRIs in
                    the UAE.
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="text-md-start text-center">
                  <Heading
                    classes={"text-center text-white fw-medium fs-4"}
                    lineWidth={"60%"}
                    heading={"Highlights"}
                  />
                  <div className="d-flex gap-3">
                    <div className="d-md-flex justify-content-between gap-4 align-items-center mt-4 w-100">
                      <div className="d-flex align-items-center gap-4 bg-light shadow py-3 px-4 rounded-4">
                        <img
                          alt=""
                          src="/svgs/Google.svg"
                          className="rounded-2"
                          height="55"
                        />
                        <div className="text-start">
                          <h4 className="text-nowrap text-success fw-medium">
                            120 +
                          </h4>
                          <p className="text-nowrap fw-medium mt-1">
                            Google Reviews{" "}
                            <span className="text-primary">4.8</span>
                          </p>
                        </div>
                      </div>
                      <div
                        className="d-flex align-items-center gap-24 bg-light shadow py-3 px-4 rounded-4 mt-3 mt-md-0"
                        style={{
                          background:
                            "linear-gradient(to right, #003A57 0%, #00AAFF 100%)",
                        }}
                      >
                        <img
                          alt=""
                          src="/svgs/telegram-button.svg"
                          className="rounded-2"
                          height="55"
                        />
                        <div className="text-start text-white">
                          <h4 className="text-nowrap fw-medium">
                            5,000 + Users
                          </h4>
                          <p className="text-nowrap fw-medium mt-1">
                            Telegram channel
                          </p>
                        </div>
                      </div>{" "}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 mt-72">
                <div className="row gy-3 justify-content-center">
                  <div className="col-md-3 offset-lg-">
                    <div className="link-wrapper">
                      <h4 className="fw-medium fs-4 text-white mb-md-4 mb-2">
                        About
                      </h4>
                      <ul className="m-0 list-unstyled">
                        <li className="mb-3 link-with-hover-icon">
                          <Link
                            href="/"
                            className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-6 link-light"
                          >
                            About DubaiOTC
                            <i className="fa-solid fa-arrow-right ms-3 hover-icon"></i>
                          </Link>
                        </li>
                        <li className="mb-3 link-with-hover-icon">
                          <Link
                            href="/testimonial"
                            className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-6 link-light"
                          >
                            Compliance & Security
                            <i className="fa-solid fa-arrow-right ms-3 hover-icon"></i>
                          </Link>
                        </li>
                        <li className="mb-3 link-with-hover-icon">
                          <Link
                            href="/deals"
                            className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-6 link-light"
                          >
                            Why Choose Us
                            <i className="fa-solid fa-arrow-right ms-3 hover-icon"></i>
                          </Link>
                        </li>
                        <li className="mb-3 link-with-hover-icon">
                          <Link
                            href="/contact-us"
                            className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-6 link-light"
                          >
                            Verified P2P Profiles on, OKX & More
                            <i className="fa-solid fa-arrow-right ms-3 hover-icon"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-3 offset-lg-">
                    <div className="link-wrapper">
                      <h4 className="fw-medium fs-4 text-white mb-md-4 mb-2">
                        Exchange
                      </h4>
                      <ul className="m-0 list-unstyled">
                        <li className="mb-3 link-with-hover-icon">
                          <Link
                            href={`/`}
                            target="_blank"
                            className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-6 link-light text-capitalize"
                          >
                            Buy Crypto with AED{" "}
                            <i className="fa-solid fa-arrow-right ms-3 hover-icon"></i>
                          </Link>
                        </li>
                        <li className="mb-3 link-with-hover-icon">
                          <Link
                            href={`/`}
                            target="_blank"
                            className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-6 link-light text-capitalize"
                          >
                            Sell Crypto for AED
                            <i className="fa-solid fa-arrow-right ms-3 hover-icon"></i>
                          </Link>
                        </li>{" "}
                        <li className="mb-3 link-with-hover-icon">
                          <Link
                            href={`/`}
                            target="_blank"
                            className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-6 link-light text-capitalize"
                          >
                            Manager&apos;s Cheque
                            <i className="fa-solid fa-arrow-right ms-3 hover-icon"></i>
                          </Link>
                        </li>{" "}
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-3 offset-lg-">
                    <div className="link-wrapper">
                      <h4 className="fw-medium fs-4 text-white mb-md-4 mb-2">
                        Resources
                      </h4>
                      <ul className="m-0 list-unstyled">
                        <li className="mb-3 link-with-hover-icon">
                          <Link
                            href={`/experience/`}
                            target="_blank"
                            className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-6 link-light text-capitalize"
                          >
                            FAQs
                            <i className="fa-solid fa-arrow-right ms-3 hover-icon"></i>
                          </Link>
                        </li>
                        <li className="mb-3 link-with-hover-icon">
                          <Link
                            href={`/experience/`}
                            target="_blank"
                            className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-6 link-light text-capitalize"
                          >
                            Blog
                            <i className="fa-solid fa-arrow-right ms-3 hover-icon"></i>
                          </Link>
                        </li>
                        <li className="mb-3 link-with-hover-icon">
                          <Link
                            href={`/experience/`}
                            target="_blank"
                            className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-6 link-light text-capitalize"
                          >
                            Contact Us
                            <i className="fa-solid fa-arrow-right ms-3 hover-icon"></i>
                          </Link>
                        </li>
                        <li className="mb-3 link-with-hover-icon">
                          <Link
                            href={`/experience/`}
                            target="_blank"
                            className="link-opacity-75 link-opacity-100-hover text-decoration-none fs-6 link-light text-capitalize"
                          >
                            Referral Program
                            <i className="fa-solid fa-arrow-right ms-3 hover-icon"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-3 mt-md-0 mt-4">
                    <div className="link-wrapper">
                      <h4 className="text-md-start text-center fw-medium fs-4 text-white mb-md-4 mb-2">
                        Follow us on
                      </h4>
                      <div className="d-flex flex-column gy-3 align-items-center align-items-md-start mt-4 mt-md-0 gap-24">
                        <div className="d-flex gap-32">
                          <a
                            href="https://www.instagram.com/paylogic/"
                            target="_blank"
                          >
                            <img
                              alt=""
                              src="/svgs/Telegram.svg"
                              className="rounded-2"
                              height="45"
                            />
                          </a>
                          <a
                            href="https://www.instagram.com/paylogic/"
                            target="_blank"
                          >
                            <img
                              alt=""
                              src="/svgs/Github.svg"
                              className="rounded-2"
                              height="45"
                            />
                          </a>{" "}
                          <a
                            href="https://www.instagram.com/paylogic/"
                            target="_blank"
                          >
                            <img
                              alt=""
                              src="/svgs/Facebook.svg"
                              className="rounded-2"
                              height="45"
                            />
                          </a>
                          <a
                            href="https://www.instagram.com/paylogic/"
                            target="_blank"
                          >
                            <img
                              alt=""
                              src="/svgs/Linkedin.svg"
                              className="rounded-2"
                              height="45"
                            />
                          </a>
                        </div>
                        <div className="d-flex gap-32">
                          <a
                            href="https://www.instagram.com/paylogic/"
                            target="_blank"
                          >
                            <img
                              alt=""
                              src="/svgs/Twitter.svg"
                              className="rounded-2"
                              height="45"
                            />
                            {/* <SocialIcon
                              icon={
                                <i className="fa-solid fa-arrow-right text-white"></i>
                              }
                              bgColor="#343a40"
                              borderColor="rgba(255, 255, 255, 0.2)"
                              bsClass="me-2"
                            /> */}
                          </a>
                          <a
                            href="https://www.instagram.com/paylogic/"
                            target="_blank"
                          >
                            <img
                              alt=""
                              src="/svgs/Discord.svg"
                              className="rounded-2"
                              height="45"
                            />
                          </a>
                          <a
                            href="https://www.instagram.com/paylogic/"
                            target="_blank"
                          >
                            <img
                              alt=""
                              src="/svgs/Reddit.svg"
                              className="rounded-2"
                              height="45"
                            />
                          </a>{" "}
                          <a
                            href="https://www.instagram.com/paylogic/"
                            target="_blank"
                          >
                            <img
                              alt=""
                              src="/svgs/Pinterest.svg"
                              className="rounded-2"
                              height="45"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="container pt-3 pb-4 mt-5">
            <div className="row text-md-start text-center gy-3">
              <div className="col-12 col-lg-6">
                <div className="copyright-wrapper d-block mb-1 fs-6 fw-semibold text-white text-">
                  &copy; {new Date().getFullYear()} DubaiOTC. All Rights
                  Reserved.
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="link-wrapper">
                  <ul className="m-0 list-unstyled d-flex justify-content-centerX justify-content-lg-end gap-2 gap-md-3">
                    <li>
                      <a
                        href={`/terms-of-use`}
                        className="link-underline-opacity-0 link-opacity-75-hover link-offset-1 link-light fs-6 d-flex align-items-center pe-2 pe-md-3 bsb-sep bsb-sep-border"
                      >
                        Terms Of Use
                      </a>
                    </li>
                    <li>
                      <a
                        href={`/privacy-policies`}
                        className="link-underline-opacity-0 link-opacity-75-hover link-offset-1 link-light fs-6 d-flex align-items-center pe-2 pe-md-3 bsb-sep bsb-sep-border"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href={`/privacy-policies`}
                        className="link-underline-opacity-0 link-opacity-75-hover link-offset-1 link-light fs-6 d-flex align-items-center pe-2 pe-md-3 bsb-sep bsb-sep-border"
                      >
                        Cookie Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
