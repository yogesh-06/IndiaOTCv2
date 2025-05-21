"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const Partners = () => {
  const partnars = [
    "/images/OKX.png",
    "/images/Ledger.png",
    "/images/Binance.png",
    "/images/amlBot.png",
  ];
  let settings = {
    dots: false,
    arrows: false,
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
      {partnars?.map((item, index) => (
        <div key={index} className="">
          <img
            alt={item}
            src={item}
            height={54}
            className="w-md-auto mx-md-auto"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay={`${index * 100}`}
          />
        </div>
      ))}
    </Slider>
  );
};

export default Partners;
