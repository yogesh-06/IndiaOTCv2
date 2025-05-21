"use client";
import Link from "next/link";
import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { DateFormate } from "../global";

const CustomerReview = () => {
  const sliderRef = useRef(null);

  const settings = {
    adaptiveHeight: true,
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0, // Continuous movement
    speed: 10000, // Slow and smooth movement
    cssEase: "linear", // Ensures smooth scrolling
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false, // Disable swipe to ensure non-stop movement
    arrows: false, // Remove navigation arrows
    // rtl: rtl,
    pauseOnHover: false, // Prevent pause on hover
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div>
      <Slider ref={sliderRef} {...settings}>
        <div
          className="card-container border p-3 rounded-4"
          // style={{ maxHeight: "100px", maxWidth: "450px" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img
                src="/images/avatar2.png"
                alt="image"
                className="me-2 rounded-circle"
                style={{ height: "60px", width: "60px" }}
              />
              <div>
                <p className="fs-6 fw-medium m-0">John Matthews</p>
                <small className="text-muted">Photographer</small>
              </div>
            </div>
            <Link
              target="_blank"
              href="x.com"
              className="fa-brands fa-twitter fa-lg text-secondary text-decoration-none"
            ></Link>
          </div>
          <p className="fs-5 text-body-secondary pb-4 pt-3 fw-light">
            <span className="truncate-paragraph-3">
              {" "}
              Romen ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem
              ipsum dolor sit amet consectetur, adipisicing elit.
            </span>
          </p>
          <small className="text-muted">{DateFormate(Date.now())}</small>
        </div>

        <div
          className="card-container border p-3 rounded-4"
          // style={{ maxHeight: "100px", maxWidth: "450px" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img
                src="/images/avatar2.png"
                alt="image"
                className="me-2 rounded-circle"
                style={{ height: "60px", width: "60px" }}
              />
              <div>
                <p className="fs-6 fw-medium m-0">John Matthews</p>
                <small className="text-muted">Photographer</small>
              </div>
            </div>
            <Link
              target="_blank"
              href="x.com"
              className="fa-brands fa-twitter fa-lg text-secondary text-decoration-none"
            ></Link>
          </div>
          <p className="fs-5 text-body-secondary pb-4 pt-3 fw-light">
            <span className="truncate-paragraph-3">
              {" "}
              Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem
              ipsum dolor sit amet consectetur, adipisicing elit.
            </span>
          </p>
          <small className="text-muted">{DateFormate(Date.now())}</small>
        </div>
      </Slider>

      <style>{`
        .card-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          padding: 20px;
        }

        .slick-slide {
          margin: 0 10px;
          transition: transform 0.5s ease !important;
        }
      `}</style>
    </div>
  );
};

export default CustomerReview;
