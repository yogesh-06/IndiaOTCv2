"use client";
import CountUp from "react-countup";

const formatNumber = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  } else {
    return value.toString();
  }
};

export default function Counter({ value }) {
  return (
    <CountUp
      end={value}
      duration={2}
      enableScrollSpy
      formattingFn={formatNumber}
    />
  );
}
