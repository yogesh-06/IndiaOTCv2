import Link from "next/link";
import React from "react";
import { Heading } from "./Heading";

const JoinTelegram = () => {
  return (
    <div className="row gy-3 justify-content-start align-items-center position-relative pt-5 pt-md-0">
      <div className="col-12 col-md-5 p-0">
        <img
          src="/svgs/Ellipse1.svg"
          alt=""
          className="object-fit-cover ellipse-img d-none d-md-block "
          style={{ width: "37%" }}
        />
        <img
          src="/svgs/Ellipse1.svg"
          alt=""
          className="object-fit-cover ellipse-img d-md-none"
          // style={{ width: "0px" }}
        />
        <img
          src="/svgs/Ellipse2.svg"
          alt=""
          className="img-fluid object-fit-cover position-absolute"
          style={{ height: "635px", zIndex: 0, bottom: "-180px", right: "0px" }}
        />
        <img
          src="/images/joinTelegram.png"
          alt=""
          className="img-fluid object-fit-cover position-relative z-999"
          style={{ width: "909px" }}
        />
      </div>
      <div className="col-12 col-md-6 position-relative z-999">
        <div className="d-flex flex-column gap-md-3 gap-5 p-2">
          <div className="d-md-none">
            <Heading
              classes={"fw-semibold display-2 text-white"}
              lineWidth={"35%"}
              heading={"Join Our Telegram Channel."}
            />
          </div>
          <div className="d-none d-md-block">
            <Heading
              classes={"fw-semibold display-6 text-dark"}
              lineWidth={"35%"}
              heading={"Join Our Telegram Channel."}
            />
          </div>
          <h4 className="fw-normal lh-base pt-3">
            Get real-time market rates and critical updates— <br />
            directly on Telegram! Stay ahead in trading with <br /> instant
            insights.
          </h4>
          <div className="row gy-5 py-md-5 py-3 order-md-0 order-1">
            <div className="col-6 col-md-3 d-flex flex-column align-items-center gap-4 p-0">
              <img
                src="/svgs/live-rates.svg"
                alt=""
                className="img-fluid"
                style={{ width: "48px" }}
              />
              <h5 className="fw-semibold text-center">Live AED/USDT Rates</h5>
            </div>
            <div className="col-6 col-md-3  d-flex flex-column align-items-center gap-4 ">
              <img
                src="/svgs/market-updates.svg"
                alt=""
                className="img-fluid"
                style={{ width: "48px" }}
              />
              <h5 className="fw-semibold text-center">Market Updates</h5>
            </div>
            <div className="col-6 col-md-3  d-flex flex-column align-items-center gap-4 ">
              <img
                src="/svgs/offers.svg"
                alt=""
                className="img-fluid"
                style={{ width: "48px" }}
              />
              <h5 className="fw-semibold text-center">Exclusive Offers</h5>
            </div>
            <div className="col-6 col-md-3  d-flex flex-column align-items-center gap-4 p-0">
              <img
                src="/svgs/traders.svg"
                alt=""
                className="img-fluid"
                style={{ width: "48px" }}
              />
              <h5 className="fw-semibold text-center">5k+ Traders Available</h5>
            </div>
          </div>
          <div className="row gy-3">
            <div className="col-12 col-md-4">
              <Link
                href={`/register`}
                className="btn btn-lg bg-telegram shadow fw-medium py-12 px-2 text-white"
              >
                Telegram Channel{" "}
                <i
                  className="fa-brands fa-telegram fa-xl ps-1"
                  // style={{ color: "#74C0FC" }}
                ></i>
              </Link>
            </div>
            <div className="col-12 col-md-4">
              <Link
                href={`/register`}
                className="btn btn-lg btn-light shadow fw-medium py-12 px-2"
              >
                Telegram Support{" "}
                {/* <i className="fa-brands fa-telegram fa-xl"></i> */}
                <i
                  className="fa-brands fa-telegram fa-xl ps-1"
                  style={{ color: "#74C0FC" }}
                ></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTelegram;
