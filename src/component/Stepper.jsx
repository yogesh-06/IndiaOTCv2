const Stepper = ({ currentStep, data }) => {
  const steps = [
    { label: "Email", key: "register" },
    { label: "Phone", key: "initVerification" },
    { label: "Document", key: "uploadDocument" },
    { label: "Questionaries", key: "questionaries" },
    { label: "Declaration", key: "declaration" },
  ];

  const currentIndex = steps.findIndex((step) => step.key === currentStep) + 1;

  return (
    <>
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
        }}
        className=" mx-auto d-none d-sm-block"
      >
        <div className="d-flex justify-content-between align-items-center w-100 px-5 py-4 ms-5">
          <div className="d-flex flex-column align-items-start flex-fill position-relative">
            <div
              className="d-flex align-items-center position-relative w-100 "
              style={{ height: "40px" }}
            >
              {data.email ? (
                <div className="bg-white rounded-circle mx-2">
                  <i className="fa-solid fa-circle-check fa-2xl text_Primary_500 z-1 "></i>
                </div>
              ) : (
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center fw-bold mx-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: currentIndex === 1 ? "#facc15" : "#fff",
                    border: "3px solid white",
                    color: "#000",
                    zIndex: 1,
                  }}
                >
                  1
                </div>
              )}

              <div
                className={`flex-grow-1 ${
                  currentIndex > 1 ? "Primary_500" : "Gray_600"
                }`}
                style={{ height: "2px" }}
              ></div>
            </div>

            <div
              className="mt-2 text-start fw-semibold text-dark small"
              // style={{ marginLeft: "-30px" }}
            >
              Email
            </div>
          </div>
          <div className="d-flex flex-column align-items-start flex-fill position-relative">
            <div
              className="d-flex align-items-center position-relative w-100 "
              style={{ height: "40px" }}
            >
              {data.phone ? (
                <div className="bg-white rounded-circle mx-2">
                  <i className="fa-solid fa-circle-check fa-2xl text_Primary_500 z-1 "></i>
                </div>
              ) : (
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center fw-bold mx-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: currentIndex === 2 ? "#facc15" : "#fff",
                    border: "3px solid white",
                    color: "#000",
                    zIndex: 1,
                  }}
                >
                  2
                </div>
              )}

              <div
                className={`flex-grow-1 ${
                  currentIndex > 2 ? "Primary_500" : "Gray_600"
                }`}
                style={{ height: "2px" }}
              ></div>
            </div>

            <div
              className="mt-2 text-start fw-semibold text-dark small"
              // style={{ marginLeft: "-30px" }}
            >
              Phone
            </div>
          </div>
          <div className="d-flex flex-column align-items-start flex-fill position-relative">
            <div
              className="d-flex align-items-center position-relative w-100 "
              style={{ height: "40px" }}
            >
              {data.identification ? (
                <div className="bg-white rounded-circle mx-2">
                  <i className="fa-solid fa-circle-check fa-2xl text_Primary_500 z-1 "></i>
                </div>
              ) : (
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center fw-bold mx-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: currentIndex === 3 ? "#facc15" : "#fff",
                    border: "3px solid white",
                    color: "#000",
                    zIndex: 1,
                  }}
                >
                  3
                </div>
              )}

              <div
                className={`flex-grow-1 ${
                  currentIndex > 3 ? "Primary_500" : "Gray_600"
                }`}
                style={{ height: "2px" }}
              ></div>
            </div>

            <div
              className="mt-2 text-start fw-semibold text-dark small"
              style={{ marginLeft: "-20px" }}
            >
              Identification
            </div>
          </div>
          {/* <div className="d-flex flex-column align-items-start flex-fill position-relative">
            <div
              className="d-flex align-items-center position-relative w-100 "
              style={{ height: "40px" }}
            >
              <div
                className="rounded-circle d-flex justify-content-center align-items-center fw-bold mx-2"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: currentIndex >= 4 ? "#facc15" : "#fff",
                  border: "3px solid white",
                  color: "#000",
                  zIndex: 1,
                }}
              >
                4
              </div>

              <div
                className={`flex-grow-1 ${
                  currentIndex > 4 ? "Primary_500" : "Gray_600"
                }`}
                style={{ height: "2px" }}
              ></div>
            </div>

            <div
              className="mt-2 text-start fw-semibold text-dark small"
              style={{ marginLeft: "-30px" }}
            >
              Selfie
            </div>
          </div> */}
          <div className="d-flex flex-column align-items-start flex-fill position-relative">
            <div
              className="d-flex align-items-center position-relative w-100 "
              style={{ height: "40px" }}
            >
              {data?.questionaries ? (
                <div className="bg-white rounded-circle mx-2">
                  <i className="fa-solid fa-circle-check fa-2xl text_Primary_500 z-1 "></i>
                </div>
              ) : (
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center fw-bold mx-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: currentIndex == 4 ? "#facc15" : "#fff",
                    border: "3px solid white",
                    color: "#000",
                    zIndex: 1,
                  }}
                >
                  4
                </div>
              )}

              <div
                className={`flex-grow-1 ${
                  currentIndex > 4 ? "Primary_500" : "Gray_600"
                }`}
                style={{ height: "2px" }}
              ></div>
            </div>

            <div
              className="mt-2 text-start fw-semibold text-dark small"
              style={{ marginLeft: "-25px" }}
            >
              Questionaries
            </div>
          </div>
          <div className="d-flex flex-column align-items-start">
            <div
              className="d-flex align-items-center"
              style={{ height: "40px" }}
            >
              {data?.declaration ? (
                <div className="bg-white rounded-circle mx-2">
                  <i className="fa-solid fa-circle-check fa-2xl text_Primary_500 z-1 "></i>
                </div>
              ) : (
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center fw-bold mx-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: currentIndex === 5 ? "#facc15" : "#fff",
                    border: "3px solid white",
                    color: "#000",
                    zIndex: 1,
                  }}
                >
                  5
                </div>
              )}
            </div>

            <div
              className="mt-2 text-start fw-semibold text-dark small"
              style={{ marginLeft: "-15px" }}
            >
              Declaration
            </div>
          </div>
        </div>
      </div>

      <div className="w-100 mx-auto d-flex gap-2 d-sm-none px-2 mb-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-fill  ${
              step.key === currentStep
                ? "bg-warning"
                : index < currentIndex || currentStep == "completed"
                ? "Primary_500"
                : "bg-white"
            }`}
            style={{ height: "6px", transition: "width 0.3s ease" }}
          ></div>
        ))}
      </div>
    </>
  );
};

export default Stepper;
