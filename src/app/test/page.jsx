"use client";
import React, { Component, useEffect } from "react";
import { useState } from "react";

function page() {
  let [value, setValue] = useState(0);
  useEffect(() => {
    console.log(value);
  }, []);

  return (
    <div>
      {value}
      <button
        onClick={() => {
          setValue(value + 1);
        }}
      >
        click me
      </button>
    </div>
  );
}

export default page;
