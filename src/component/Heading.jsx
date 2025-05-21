export const Heading = ({ classes, lineColor, lineWidth, heading }) => {
  const headingStyle = {
    "--line-color": lineColor,
    "--line-width": lineWidth,
  };

  return (
    <p className={`heading ${classes}`} style={headingStyle}>
      {heading}
    </p>
  );
};
