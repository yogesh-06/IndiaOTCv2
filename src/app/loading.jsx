export default function Loading() {
  return (
    <>
      <div className="theme-gradient position-fixed top-0 vh-100 vw-100 d-flex justify-content-center align-items-center">
        <div>
          <svg
            version="1.1"
            id="L1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            width={"100"}
            enableBackground="new 0 0 100 100"
          >
            <circle
              fill="none"
              stroke="#fff"
              strokeWidth="5"
              strokeMiterlimit="15"
              strokeDasharray="14.2472,14.2472"
              cx="50"
              cy="50"
              r="47"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                dur="5s"
                from="0 50 50"
                to="360 50 50"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              fill="none"
              stroke="#fff"
              strokeWidth="1"
              strokeMiterlimit="10"
              strokeDasharray="10,10"
              cx="50"
              cy="50"
              r="35"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                dur="5s"
                from="0 50 50"
                to="-360 50 50"
                repeatCount="indefinite"
              />
            </circle>
            <g fill="#fff">
              <image
                href="/images/logo2.png"
                x="20"
                y="20"
                width="60"
                height="60"
              />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
