import React from "react";

const SocialIcon = ({
  icon,
  bgColor = "",
  borderColor = "rgba(156, 156, 156, 0.466)",
  hoverBlur = "4px",
  bsClass = "",
}) => {
  return (
    <div className={`Btn ${bsClass}`}>
      <span className="svgContainer" style={{ borderColor }}>
        {icon}
      </span>
      <span className="BG" style={{ backgroundColor: bgColor }}></span>
    </div>
  );
};

export default SocialIcon;
