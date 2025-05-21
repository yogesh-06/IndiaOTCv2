"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Heading } from "../Heading";

const Review = () => {
  const review = [
    "/images/partners/binance.png",
    "/images/partners/htx.png",
    "/images/partners/okx.png",
    "/images/partners/kucoin.png",
    "/images/partners/bitget.png",
    "/images/partners/bybit.png",
  ];
  let settings = {
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 4000, // Slow and smooth movement
    cssEase: "linear", // Ensures smooth scrolling,
    slidesToShow: 4,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
          centerMode: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
          centerMode: true,
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      {review?.map((item, index) => (
        <div key={index} className="d-flex flex-column gap-3 align-items-start">
          <img
            alt={item}
            src={item}
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
      ))}
    </Slider>
  );
};

export default Review;
