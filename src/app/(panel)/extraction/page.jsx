"use client";
import { APITemplate } from "@/component/API/Template";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

const Page = () => {
  const [image, setImage] = useState(null);
  const [requestResponse, setRequestResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [docType, setDocType] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!image) {
      enqueueSnackbar("upload an image first.", {
        variant: "error",
        autoHideDuration: 5000,
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("document", image);
    formData.append("docType", docType);

    try {
      const response = await APITemplate("extractDocument", "POST", formData);
      console.log("====response===", response);
      setRequestResponse(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      enqueueSnackbar("Error processing the image.", {
        variant: "error",
        autoHideDuration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const persantage = 90;
  if (persantage > 70) {
  } else if (persantage > 80) {
    return <h1></h1>;
  }

  return (
    <div className="container">
      <div className="page-inner px-5">
        <div className="d-flex flex-column justify-content-between align-items-start gap-3">
          <h2 className="fw-bold">Data extraction</h2>

          <form onSubmit={handleSubmit}>
            <div className="d-flex align-items-center gap-1">
              <input
                type="file"
                className="form-control"
                onChange={handleImageUpload}
                accept="image/*"
              />
              {/* <select
                className="form-select"
                onChange={(e) => setDocType(e.target.value)}
                value={docType}
              >
                <option value="">Select Type</option>
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving Licence">Driving Licence</option>
              </select> */}
              <button
                type="submit"
                className="btn btn-primary w-50 ms-2"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Extract data"}
              </button>
            </div>
          </form>

          <div className="container my-4">
            <h1 className="mb-4 text-center">User Information</h1>
            {requestResponse?.first_name && (
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Personal Details</h5>
                      <ul className="list-group list-group-flush">
                        {Object.keys(requestResponse).map((key) => {
                          // Skip the full address key for this section (you can choose how to handle it)
                          if (key === "full_address") return null;
                          return (
                            <li key={key} className="list-group-item">
                              <strong className="me-2">
                                {key.replace(/_/g, " ").toUpperCase()}:
                              </strong>{" "}
                              {requestResponse[key] || "N/A"}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Address</h5>
                      <p className="card-text">
                        {requestResponse?.full_address ||
                          "No address available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
