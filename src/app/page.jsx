import Footer from "@/component/Footer";
import Header from "@/component/Header";
import { Heading } from "@/component/Heading";
import JoinTelegram from "@/component/JoinTelegram";
import CustomerReview from "@/component/sliders/CustomerReview";
import Partners from "@/component/sliders/Partners";
import Review from "@/component/sliders/Review";
import {
  BankTransferIcon,
  ManagerCheque,
  OtcDeskIcon,
  PaymentIcon,
} from "@/component/svgs/icons";
import Link from "next/link";

const fetchExchangeData = async () => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}website/stats/getStatsByExchange`;

    const params = new URLSearchParams({
      exchangeName: "Accounts-IndiaOTC",
    });

    const res = await fetch(`${baseUrl}?${params.toString()}`, {
      cache: "no-store",
    });

    const exchangeData = await res.json();

    if (!res.ok) {
    }

    return exchangeData.data;
  } catch (error) {
    console.log(error);
  }
};

export default async function Home() {
  const exchangeData = await fetchExchangeData();

  return (
    <div className="d-flex flex-column gap-4">
      <div
        className="p-2 p-md-3 hero-bg bg-light"
        style={{
          position: "relative",
          color: "#000",
          // backgroundImage: "url('/images/home-background.png')",
        }}
      >
        <Header />
        <div className="min-vh-90 d-flex align-items-center justify-content-center">
          <div className="container h-100">
            <div className="row gy-5 g-4">
              <div className="col-12 col-md-6 d-flex align-items-center py-md-0 py-5 mobile-vh-100">
                <div className="d-flex flex-column justify-content-between h-100 w-100 gap-4">
                  <div className="display-2 d-md-none fw-medium lh-lg text-white text-md-danger">
                    A Professional Crypto OTC Exchange in India
                  </div>
                  <h1
                    className="display-5 d-none d-md-block fw-medium lh-base"
                    style={{ color: "#454545" }}
                  >
                    A Professional Crypto OTC Exchange in India
                  </h1>
                  <div>
                    <div className="d-md-inline-block btn-sm fw-medium text-light Primary_500 rounded-3 px-3 py-1">
                      <h5 className="m-0 p-1">
                        Exchange USDT with AED Cash - Securely
                      </h5>
                    </div>
                  </div>
                  <p className="fw-normal fs-5 d-none d-md-block">
                    Secure, fast, and a Reliable Crypto OTC Exchange platform
                    for bulk crypto transactions (primarily USDT) with AED,
                    ensuring competitive rates and exceptional service.
                  </p>
                  <p className="fw-normal d-md-none fs-3">
                    Secure, fast, and a Reliable Crypto OTC Exchange platform
                    for bulk crypto transactions (primarily USDT) with AED,
                    ensuring competitive rates and exceptional service.
                  </p>

                  <div className="row gap-1 gy-3">
                    <div className="col-12 col-md-3">
                      <Link
                        href={`/register`}
                        className="btn btn-lg Primary_500 text-white fw-medium w-100"
                      >
                        Explore
                      </Link>
                    </div>
                    <div className="col-12 col-md-4">
                      <Link
                        href={`/register`}
                        className="btn btn-lg btn-light fw-medium w-100"
                      >
                        Get Started
                        <i className="fa fa-long-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section - mobile-vh-100 */}
              <div className="col-12 col-md-6 mobile-vh-100 d-flex flex-column justify-content-center pt-5 pt-md-0">
                <div className="text-star text-center mb-0 mb-md-4">
                  <h1 className="display-1 text_Primary_600 fw-semibold">
                    {exchangeData?.trustedUser || 0} +
                  </h1>
                  <h1 className="text_Primary_600 fw-medium pt-2">
                    Users Trusted
                  </h1>
                </div>

                <div className="row gy-5 mt-md-5 mt-3">
                  {/* Repeat for each stat */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3 bg-light shadow p-4 rounded-4">
                      <div className="Primary_50 p-2 rounded-circle">
                        <img
                          alt=""
                          src="/svgs/trusted-users.svg"
                          className="rounded-2 m-1"
                          height="38"
                        />
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="fw-semibold">
                          {exchangeData?.trustedUser || 0}
                        </h3>
                        <h6>Users Trusted</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3 bg-light shadow p-md-3 p-4 rounded-4">
                      <div className="Primary_50 p-2 rounded-circle">
                        <img
                          alt=""
                          src="/svgs/usdt-traded.svg"
                          className="rounded-2 m-1"
                          height="38"
                        />
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="fw-semibold">
                          {" "}
                          {exchangeData?.usdtTraded || 0}{" "}
                        </h3>
                        <h6>USDT Traded</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3 bg-light shadow p-md-3 p-4 rounded-4">
                      <div className="Primary_50 p-2 rounded-circle">
                        <img
                          alt=""
                          src="/svgs/successfull-traded.svg"
                          className="rounded-2 m-1"
                          height="38"
                        />
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="fw-semibold">
                          {exchangeData?.tradeVolume || 0}{" "}
                        </h3>
                        <h6>Successful Trades</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3 bg-light shadow p-md-3 p-4 rounded-4">
                      <div className="Primary_50 p-2 rounded-circle">
                        <img
                          alt=""
                          src="/svgs/reviews.svg"
                          className="rounded-2 m-1"
                          height="38"
                        />
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="fw-semibold">
                          {exchangeData?.reviews || 0}{" "}
                        </h3>
                        <h6>Reviews</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid pb-5 mb-md-5">
        <JoinTelegram />
      </div>
      <div className="container-fluid pt-md-5 mt-md-5 px-0">
        <img
          src="/images/p2p-section.png"
          alt=""
          className="img-fluid object-fit-cover w-100"
        />
      </div>
      <div className="container pt-md-5 pt-3 px-3 px-md-0">
        <div className="d-flex flex-column gap-5">
          <div className="text-center d-none d-md-block">
            <Heading
              classes={"fs-1 fw-bold "}
              lineWidth={"35%"}
              heading={"Multiple Payment Options to Choose From"}
            />
          </div>
          <div className="display-4 text-center fw-bold d-md-none">
            <span className="">Multiple Payment Options</span>
            <Heading
              classes={"text-center fw-bold display-4 pb-2"}
              lineWidth={"100%"}
              heading={"to Choose From"}
            />
          </div>
          <div className="grid mt-md-4">
            <div className="card cursor-pointer">
              <div className="card-content">
                <OtcDeskIcon
                  style={{ height: "55px" }}
                  className="options-hover-color"
                />

                <h2 className="pt-3 options-hover-color">Crypto OTC Desk</h2>
                <div className="options-hover-color">
                  Execute secure and high-value crypto transactions through our
                  Crypto OTC in India.
                </div>
              </div>
            </div>

            <div className="card cursor-pointer">
              <div className="card-content">
                <BankTransferIcon
                  style={{ height: "55px" }}
                  className="options-hover-color"
                />
                <h2 className="pt-3 options-hover-color">Bank Transfer</h2>
                <div className="options-hover-color">
                  Sell crypto seamlessly via P2P platforms or directly on our
                  website and receive AED & USD bank transfers in your account.
                </div>
              </div>
            </div>
            <div className="card cursor-pointer">
              <div className="card-content">
                <ManagerCheque
                  style={{ height: "55px" }}
                  className="options-hover-color"
                />
                <h2 className="pt-3 options-hover-color">Manager’s Cheque</h2>
                <div className="options-hover-color">
                  Navigate complex business challenges with our expert guidance.
                  We provide actionable insights and strategies to accelerate
                  your growth and innovation.
                </div>
              </div>
            </div>

            <div className="card cursor-pointer">
              <div className="card-content">
                <PaymentIcon
                  style={{ height: "55px" }}
                  className="options-hover-color"
                />
                <h2 className="pt-3 options-hover-color">
                  Business Payment Solutions
                </h2>
                <div className="options-hover-color">
                  Reliable global payment solutions tailored for businesses.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-md-5 pt-5 pb-0">
        <div className="row gy-5 px-3 px-md-0">
          <div className="col-12 col-md-4">
            <div className="d-flex flex-column gap-4">
              <div className="text-md-start text-center">
                <h1 className="fw-bold display-5">What Clients Say</h1>
              </div>
              <div className="row">
                <CustomerReview />
              </div>
              <div className="d-flex flex-column align-items-md-start align-items-center">
                <img
                  src="/svgs/google-reviews.svg"
                  alt=""
                  className="img-fluid "
                  style={{ width: "145px" }}
                />
                <p className="text-primary fw-semibold">
                  120 Reviews{" "}
                  <span className="text-warning fw-semibold ms-2">
                    {" "}
                    5.0/5.0
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-8 py-md-3 ps-md-5">
            <div className="d-flex flex-column justify-content-between h-100">
              <h5 className="fw-medium">
                Experience the best crypto exchange customer service tailored
                just for you to sell USDT (Tether) for cash at market
                competitive rates.
              </h5>

              <div className="row justify-content-between gy-4 d-none d-md-flex">
                <div className="col-md-4 mt-md-0">
                  <div className="d-flex flex-column gap-3 align-items-start">
                    <img
                      alt=""
                      src="/images/partners/binance.png"
                      className="rounded-2 img-fluid"
                      style={{ height: "58px", width: "auto" }}
                    />
                    <div className="d-flex flex-column gap-1">
                      {/* <h3 className="fw-normal heading-red">500 +</h3> */}
                      <Heading
                        classes={"fw-normal fs-3"}
                        lineColor={"#F3BA2F"}
                        heading={"500 +"}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mt-md-0">
                  <div className="d-flex flex-column gap-3 align-items-start">
                    <img
                      alt=""
                      src="/images/partners/htx.png"
                      className="rounded-2 img-fluid"
                      style={{ height: "58px", width: "auto" }}
                    />
                    <div className="d-flex flex-column gap-1">
                      <Heading
                        classes={"fw-normal fs-3"}
                        lineColor={"#059BDC"}
                        heading={"650 +"}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mt-md-0">
                  <div className="d-flex flex-column gap-3 align-items-start">
                    <img
                      alt=""
                      src="/images/partners/okx.png"
                      className="rounded-2 img-fluid"
                      style={{ height: "58px", width: "auto" }}
                    />
                    <div className="d-flex flex-column gap-1">
                      <Heading
                        classes={"fw-normal fs-3"}
                        lineColor={"#000000"}
                        heading={"1820 +"}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-between gy-4 d-none d-md-flex">
                <div className="col-md-4 mt-md-0">
                  <div className="d-flex flex-column gap-3 align-items-start">
                    <img
                      alt=""
                      src="/images/partners/kucoin.png"
                      className="rounded-2 img-fluid"
                      style={{ height: "58px", width: "auto" }}
                    />
                    <div className="d-flex flex-column gap-1">
                      <Heading
                        classes={"fw-normal fs-3"}
                        lineColor={"#24AF92"}
                        heading={"487 +"}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mt-md-0">
                  <div className="d-flex flex-column gap-3 align-items-start">
                    <img
                      alt=""
                      src="/images/partners/bitget.png"
                      className="rounded-2 img-fluid"
                      style={{ height: "58px", width: "auto" }}
                    />
                    <div className="d-flex flex-column gap-1">
                      <Heading
                        classes={"fw-normal fs-3"}
                        lineColor={"#00F0FF"}
                        heading={"700 +"}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mt-md-0">
                  <div className="d-flex flex-column gap-3 align-items-start">
                    <img
                      alt=""
                      src="/images/partners/bybit.png"
                      className="rounded-2 img-fluid"
                      style={{ height: "58px", width: "auto" }}
                    />
                    <div className="d-flex flex-column gap-1">
                      <Heading
                        classes={"fw-normal fs-3"}
                        lineColor={"#F6A500"}
                        heading={"240 +"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5 d-md-none">
                <Review />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="position-relative"
        style={{
          background: "linear-gradient(to bottom, #5761D7 0%, #2E3371 100%)",
        }}
      >
        <div className="container py-5 px-4 px-md-0">
          <img
            src="/images/circles2.png"
            className="position-absolute d-none d-md-block"
            alt=""
            style={{
              width: "350px",
              zIndex: 0,
              right: 0, // Set left to 0
              bottom: 0, // Set bottom to 0
            }}
          />
          <img
            src="/images/circles.png"
            className="position-absolute d-none d-md-block"
            alt=""
            style={{
              width: "180px",
              zIndex: 100,
              left: 0, // Set left to 0
              top: 0, // Set bottom to 0
            }}
          />
          <img
            src="/images/circles2-light.png"
            className="position-absolute d-md-none"
            alt=""
            style={{
              width: "418px",
              zIndex: 0,
              left: "50%",
              bottom: 0,
              transform: "translateX(-50%)",
            }}
          />
          <img
            src="/images/circles-light.png"
            className="position-absolute d-md-none"
            alt=""
            style={{
              width: "252px",
              zIndex: 100,
              left: 0, // Set left to 0
              top: 0, // Set bottom to 0
            }}
          />
          <div className="row justify-content-center text-white py-md-5 py-0">
            <div className="col-md-10">
              <div className="d-flex flex-column gap-4 py-4 justify-content-start align-items-start">
                <h1 className="display-5 fw-medium text-capitalize text-start m-0">
                  Get started in{" "}
                  <span className="text-warning">3 Simple Steps</span>
                </h1>
                <p className="fs-4 fw-normal">
                  A quick and seamless process to start trading crypto with
                  IndiaOTC.
                </p>
              </div>
            </div>
            <div className="col-md-10 z-0">
              <div className="row justify-content-between gy-4 py-4 ">
                <div className="col-12 col-md-4">
                  <div className="d-flex flex-column justify-content-between py-32 px-md-4 px-3 bg-light text-dark rounded-4 shadow gap-3 h-100 w-100">
                    <div className="d-flex flex-column gap-3">
                      <img
                        src="/svgs/meter.svg"
                        alt=""
                        className="d-none d-md-block"
                        style={{
                          width: "72px",
                        }}
                      />
                      <h4 className="fw-bold text-nowrap m-0">
                        Complete Registration
                      </h4>
                      <small className="fw-normal lh-lg">
                        Everything starts here. <br /> Fill out the form to help
                        us get to know you.
                      </small>
                    </div>
                    <Link href={`/register`} className="btn btn-warning">
                      Start Registration
                    </Link>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="d-flex flex-column justify-content-between py-32 px-md-4 px-3 bg-light text-dark rounded-4 shadow gap-3 h-100 w-100">
                    <div className="d-flex flex-column gap-3">
                      {" "}
                      <img
                        src="/svgs/meter.svg"
                        alt=""
                        className="d-none d-md-block"
                        style={{
                          width: "72px",
                        }}
                      />
                      <h4 className="fw-bold text-nowrap m-0">Get in Touch</h4>
                      <small className="fw-normal lh-lg">
                        Our team will review your details and contact you to
                        confirm and discuss your requirements.
                      </small>
                    </div>

                    <Link href={`/register`} className="btn btn-warning">
                      Contact Support
                    </Link>
                  </div>{" "}
                </div>
                <div className="col-12 col-md-4">
                  {" "}
                  <div className="d-flex flex-column justify-content-between py-32 px-md-4 px-3 bg-light text-dark rounded-4 shadow gap-3 h-100 w-100">
                    <div className="d-flex flex-column gap-3">
                      {" "}
                      <img
                        src="/svgs/meter.svg"
                        alt=""
                        className="d-none d-md-block"
                        style={{
                          width: "72px",
                        }}
                      />
                      <h4 className="fw-bold text-nowrap m-0">
                        Schedule Appointment
                      </h4>
                      <small className="fw-normal lh-lg">
                        Once verified, schedule your visit and complete your
                        trade.
                      </small>
                    </div>

                    <Link href={`/register`} className="btn btn-warning">
                      Check Rates
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-5">
        <div className="d-flex flex-column gap-72 py-md-6 px-3 px-md-0">
          <div className="d-flex flex-column gap-3 text-center">
            <div className="text-center d-none d-md-block">
              <Heading
                classes={"fs-1 fw-bold "}
                lineWidth={"60%"}
                heading={"Why Clients Use IndiaOTC"}
              />
            </div>
            <p className="text-center display-4 fw-bold d-md-none">
              Why Clients Use IndiaOTC
            </p>

            <p className="fs-4 px-4">
              We serve real-world needs with secure, fast, and personalized OTC
              crypto solutions in India.
            </p>
          </div>
          <div className="row gy-5 justify-content-around">
            <div className="col-md-4">
              <div className="d-flex flex-column justify-content-between h-100 gap-3 py-md-4">
                <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                  <div className="d-flex flex-column align-items-center align-items-md-end gap-2 order-md-0  order-1">
                    <h4 className="fw-bold m-0">Trusted & Verified</h4>
                    <p className="fs-6 fw-medium text-center text-md-end">
                      Active on top global exchanges with a proven track record.
                    </p>
                  </div>
                  <div className="Primary_50 p-1 rounded-circle">
                    <img
                      alt=""
                      src="/svgs/buyers.svg"
                      className="rounded-2 m-2"
                      height="48"
                    />
                  </div>
                </div>

                <div className="d-flex flex-column flex-md-row align-items-center gap-3 pt-3 pt-md-0">
                  <div className="d-flex flex-column align-items-center align-items-md-end gap-2 order-md-0  order-1">
                    <h4 className="fw-bold m-0">Secure & Transparent</h4>
                    <p className="fs-6 fw-medium text-center text-md-end">
                      All transactions are escrow-protected for maximum safety.
                    </p>
                  </div>
                  <div className="Primary_50 p-1 rounded-circle">
                    <img
                      alt=""
                      src="/svgs/investors.svg"
                      className="rounded-2 m-2"
                      height="48"
                    />
                  </div>
                </div>

                <div className="d-flex flex-column flex-md-row align-items-center gap-3 pt-3 pt-md-0">
                  <div className="d-flex flex-column align-items-center align-items-md-end gap-2 order-md-0  order-1">
                    <h5 className="fw-bold m-0 text-center text-md-end">
                      High Liquidity & Competitive Rates
                    </h5>
                    <p className="fs-6 fw-medium text-center text-md-end">
                      Seamless bulk trading with the best market prices.
                    </p>
                  </div>
                  <div className="Primary_50 p-1 rounded-circle">
                    <img
                      alt=""
                      src="/svgs/trader.svg"
                      className="rounded-2 m-2"
                      height="48"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 d-none d-md-block">
              <img
                src="/images/question-mark.png"
                alt=""
                className="img-fluid"
              />
            </div>

            <div className="col-md-4">
              <div className="d-flex flex-column  justify-content-between h-100 gap-3 py-md-4">
                <div className="d-flex flex-column flex-md-row align-items-center gap-3 pt-3 pt-md-0">
                  <div className="Primary_50 p-1 rounded-circle">
                    <img
                      alt=""
                      src="/svgs/expatriates.svg"
                      className="rounded-2 m-2"
                      height="48"
                    />
                  </div>
                  <div className="d-flex flex-column align-items-center align-items-md-start gap-2">
                    <h4 className="fw-bold m-0">Diverse Payment Options</h4>
                    <p className="fs-6 fw-medium text-center text-md-start">
                      Cash, Bank Transfers, and Manager’s Cheques for flexible
                      settlements.
                    </p>
                  </div>
                </div>

                <div className="d-flex flex-column flex-md-row align-items-center gap-3 pt-3 pt-md-0">
                  {" "}
                  <div className="Primary_50 p-1 rounded-circle">
                    <img
                      alt=""
                      src="/svgs/clients.svg"
                      className="rounded-2 m-2"
                      height="48"
                    />
                  </div>
                  <div className="d-flex flex-column align-items-center align-items-md-start gap-2">
                    <h4 className="fw-bold m-0">Institutional & OTC Traders</h4>
                    <p className="fs-6 fw-medium text-center text-md-start">
                      High-liquidity bulk crypto transactions with secure
                      settlements and fast execution.
                    </p>
                  </div>
                </div>

                <div className="d-flex flex-column flex-md-row align-items-center gap-3 pt-3 pt-md-0">
                  {" "}
                  <div className="Primary_50 p-1 rounded-circle">
                    <img
                      alt=""
                      src="/svgs/buyers.svg"
                      className="rounded-2 m-2"
                      height="48"
                    />
                  </div>
                  <div className="d-flex flex-column align-items-center align-items-md-start gap-2">
                    <h4 className="fw-bold m-0">Expert Support</h4>
                    <p className="fs-6 fw-medium text-center text-md-start">
                      Dedicated 1-on-1 assistance for smooth and efficient
                      transactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid py-64">
        <div className="fs-1 fw-semibold text-center pb-72">
          <Heading
            classes={"text-center fw-bold fs-1"}
            lineWidth={"180%"}
            heading={"Our"}
          />{" "}
          <span className="text_Primary_500">Partners</span>
        </div>
        <Partners />
      </div>
      <Footer />
      {/* <button className="Btn">
        <span className="svgContainer">
          <svg fill="white" viewBox="0 0 496 512" height="1.6em">
            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
          </svg>
        </span>
        <span className="BG"></span>
      </button> */}
    </div>
  );
}
