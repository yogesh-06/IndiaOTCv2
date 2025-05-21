"use client";
import { Typewriter } from "react-simple-typewriter";

const Type = ({ array, delaySpeed }) => {
  return (
    <span>
      <Typewriter
        words={array}
        loop={50}
        cursor
        cursorStyle="|"
        typeSpeed={100}
        deleteSpeed={100}
        delaySpeed={delaySpeed}
      />
    </span>
  );
};

export default Type;
