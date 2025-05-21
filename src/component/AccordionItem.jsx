const AccordionItem = ({ id, item }) => {
  const wordId = numberToWord(id);

  return (
    <div className="accordion-item border-0 my-2">
      <h2
        className="accordion-header border-0"
        id={item.content ? `heading${wordId}` : ""}
      >
        <button
          className={`${
            item.content ? "accordion-button fw-bold" : "btn"
          } fs-5 fw-semibold p-1`}
          aria-expanded={item.content ? "true" : "false"}
          data-bs-toggle={item.content ? "collapse" : ""}
          aria-controls={item.content ? `collapse${wordId}` : ""}
          data-bs-target={item.content ? `#collapse${wordId}` : ""}
        >
          {item.heading}
        </button>
      </h2>
      <div
        id={`collapse${wordId}`}
        className={`accordion-collapse collapse ${id === 0 && "show"}`}
        aria-labelledby={`heading${wordId}`}
        data-bs-parent="#accordionExample"
      >
        <div
          className="accordion-body border-0 shadow rounded-5 mt-4"
          style={{ background: "#7f56d91c" }}
        >
          <div className="d-flex flex-column align-items-center gap-4 px-2 py-3">
            {item?.content?.length > 0 &&
              item.content.map((data, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center gap-3 w-100"
                >
                  <div className="Primary_50 p-1 rounded-3">
                    <img
                      alt=""
                      src={data?.icon}
                      className="rounded-2 m-1"
                      height="36"
                    />
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <p className="fw-semibold">{data?.title}</p>
                    <h6>{data.description} </h6>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;

const numberToWord = (num) => {
  const words = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
  ];
  return words[num - 1] || `Item${num}`;
};
