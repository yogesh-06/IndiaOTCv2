"use client";

import { useEffect, useRef } from "react";
import "select2/dist/css/select2.min.css";
import dynamic from "next/dynamic";

const CustomSelect = ({ data, onChange, value, label }) => {
  const selectRef = useRef(null);
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const $ = require("jquery");
  //     require("select2");
  //     $(selectRef.current).select2();
  //     $(selectRef.current).val(value).trigger("change");
  //   }
  // }, []);

  useEffect(() => {
    // Dynamically import jQuery and Select2 on the client-side
    if (typeof window !== "undefined") {
      const $ = require("jquery");
      require("select2");

      // Initialize Select2
      $(selectRef.current).select2();

      // Trigger Select2 change event and update React state
      $(selectRef.current).on("change", function (e) {
        onChange(e); // Call the passed onChange handler
      });

      // Cleanup Select2 instance on component unmount
      return () => {
        $(selectRef.current).select2("destroy");
      };
    }
  }, [onChange]);

  return (
    <select ref={selectRef} value={value} className="form-select btn-dark">
      <option value="none">Select {label}</option>
      {data?.length > 0 ? (
        data.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))
      ) : (
        <option value="none">No Data Added</option>
      )}
    </select>
  );
};

export default dynamic(() => Promise.resolve(CustomSelect), { ssr: false });
