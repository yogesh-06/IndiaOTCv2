import React from "react";

const MAX_FILE_SIZE_MB = 5; // limit to 5MB
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]; // .docx

function FileUploadBase64({ walletOwnership, setWalletOwnership }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Unsupported file type.");
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      alert("File is too large. Max size is 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const fullDataUrl = reader.result;
      const base64Only = fullDataUrl.split(",")[1]; // remove MIME prefix if needed

      setWalletOwnership((prev) => ({
        ...prev,
        answerLabel: file.name, // Show file name
        answer: base64Only, // Store clean base64
        mimeType: file.type, // Optional: store MIME separately
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="col-md-12">
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.pdf,.txt,.docx"
        className="form-control form-control-lg mt-2"
        onChange={handleFileChange}
      />

      {/* Optional preview / download */}
      {walletOwnership.answer && (
        <div className="mt-2">
          {walletOwnership.mimeType?.startsWith("application/pdf") ? (
            <a
              className="btn btn-primary"
              href={`data:${walletOwnership.mimeType};base64,${walletOwnership.answer}`}
              download={walletOwnership.answerLabel}
            >
              Download PDF
            </a>
          ) : walletOwnership.mimeType?.startsWith("image/") ? (
            <div className="text-center">
              <img
                className="img-fluid rounded-2"
                src={`data:${walletOwnership.mimeType};base64,${walletOwnership.answer}`}
                alt="Preview"
                style={{ width: "290px", height: "auto" }}
              />
            </div>
          ) : (
            <a
              className="btn btn-primary"
              href={`data:${walletOwnership.mimeType};base64,${walletOwnership.answer}`}
              download={walletOwnership.answerLabel}
            >
              Download File
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUploadBase64;
