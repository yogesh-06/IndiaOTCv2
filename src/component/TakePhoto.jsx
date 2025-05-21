import React, { useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { APITemplate } from "./API/Template";

const TakePhoto = ({ isOpen, onClose, onPhotoSubmit }) => {
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageSelfieData, setImageSelfieData] = useState(null);
  const [binaryData, setBinaryData] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [stream, setStream] = useState(null);

  const startWebcam = async () => {
    try {
      setImageSelfieData("");
      setCameraOn(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();
    } catch (err) {
      handleSelfieError(err);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop()); // Stop each track
      setStream(null); // Clear the stored stream
    }

    setCameraOn(false); // Update the camera state to indicate it's off
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL("image/png");
    const binaryImageSelfieData = base64ToBinary(base64Image);

    setCameraOn(false);
    setImageSelfieData(base64Image);
    setBinaryData(binaryImageSelfieData);
    stopWebcam(); // Stop the webcam and release the camera system
    // setStep("confirmSelfie");
  };

  const base64ToBinary = (base64) => {
    const binaryString = atob(base64.split(",")[1]);
    const binaryLength = binaryString.length;
    const binaryArray = new Uint8Array(binaryLength);

    for (let i = 0; i < binaryLength; i++) {
      binaryArray[i] = binaryString.charCodeAt(i);
    }

    return binaryArray.buffer;
  };

  const handleUploadSelfie = async () => {
    setLoading(true);
    const blob = new Blob([binaryData], { type: "image/png" });

    const formData = new FormData();
    formData.append("image", blob);
    formData.append("verificationId", verification?._id);

    try {
      const response = await APITemplate(
        "user/updateSelfieVerification",
        "POST",
        formData
      );
      if (response.success == true) {
        // enqueueSnackbar(response.message, { variant: "success" });
        await getVerification(verification?._id);
        setTimeout(() => {
          setStep("completed");
        }, 500);
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  const handleSelfieError = async (err) => {
    stopWebcam();
    console.error("Error accessing webcam: ", err);
    setCameraOn(false);

    const formData = new FormData();
    // formData.append("email", user?.email);
    const responseLink = await APITemplate(
      "user/genJWTUserToken",
      "POST",
      formData
    );
    if (responseLink.success == true) {
      const localUrl = responseLink.data;
      setQrCodeUrl(localUrl);
    } else {
      enqueueSnackbar(
        responseLink.message,
        { variant: "error" },
        { autoHideDuration: 500 }
      );
    }

    enqueueSnackbar("Error accessing webcam.", {
      variant: "error",
      autoHideDuration: 5000,
    });
  };

  const handleSelfieMobile = async (err) => {
    try {
      setImageSelfieData("");
      const formData = new FormData();
      formData.append("email", user?.email);
      const responseLink = await APITemplate(
        "user/genJWTUserToken",
        "POST",
        formData
      );
      if (responseLink.success == true) {
        const localUrl = responseLink.data;
        setQrCodeUrl(localUrl);
      } else {
        enqueueSnackbar(
          responseLink.message,
          { variant: "error" },
          { autoHideDuration: 500 }
        );
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(
        "Somethng went wrong",
        { variant: "error" },
        { autoHideDuration: 500 }
      );
    }
  };
  return (
    <Modal
      show={isOpen === "open"}
      onHide={() => {
        onClose(), stopWebcam();
      }}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="bg-primary text-white">
        <div className="fs-5 fw-medium">Capture Document Photo</div>
        <Button
          variant="close"
          onClick={() => {
            onClose(), stopWebcam();
          }}
          className="btn-close-white"
        />
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="text-center">
          {!cameraOn && qrCodeUrl && !imageSelfieData && (
            <div>
              <h5 className="">
                Scan the QR Code Below and continue with phone
              </h5>
              <QRCodeCanvas value={qrCodeUrl} size={128} />
            </div>
          )}
          {(cameraOn || imageSelfieData) && (
            <div className="d-flex flex-column align-items-center gap-4">
              {imageSelfieData ? (
                <div>
                  <div className="d-flex flex-column align-items-center gap-2">
                    <img
                      src={imageSelfieData}
                      alt="Captured"
                      className="img-fluid object-fit-cover rounded-3 h-75 w-75"
                    />
                    <p className="">
                      Please ensure that document is clearly visible in the
                      image.
                    </p>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  className="img-fluid object-fit-cover rounded-3 h-100 w-100"
                ></video>
              )}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success"
                  onClick={
                    !cameraOn && imageSelfieData ? startWebcam : capturePhoto
                  }
                >
                  {!cameraOn && imageSelfieData ? "Retake" : " Take a snapshot"}
                </button>
                {!cameraOn && (
                  <button
                    className={`btn btn-success`}
                    onClick={() => {
                      onPhotoSubmit(binaryData, imageSelfieData);
                      setImageSelfieData("");
                      stopWebcam();
                      onClose();
                    }}
                  >
                    Confirm
                  </button>
                )}
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>
          )}
          {!cameraOn && !qrCodeUrl && !imageSelfieData && (
            <div className="d-flex flex-column align-items-center gap-3">
              <img
                src="/images/UAE-ID.png"
                className="img-fluid"
                width={250}
                alt=""
              />
              <button className="btn btn-success" onClick={startWebcam}>
                Start a Camera
              </button>
            </div>
          )}
        </div>

        {/*  <div className="d-flex flex-column align-items-start gap-2 p-3">
          <div className="w-100 d-flex align-items-center w-100 flex-column gap-4 ">
             <div className="bg-light rounded-5 w-100 p-4 text-center">
              {imageSelfieData && (
                <div>
                  <div className="d-flex flex-column align-items-center gap-2">
                    <img
                      src={imageSelfieData}
                      alt="Captured"
                      className="img-fluid object-fit-cover rounded-3 h-75 w-75"
                    />
                    <p className="">
                      Please ensure that your face is clearly visible in the
                      image.
                    </p>
                  </div>
                </div>
              )}
            </div> */}
        {/*  <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
              <div>
                <button
                  onClick={() => setStep("selfie")}
                  className="btn btn-primary btn-lg"
                >
                  <i className="fa fa-plus"></i>
                  Retake Selfie
                </button>
              </div>
              <button
                disabled={loading}
                onClick={handleUploadSelfie}
                className="btn btn-outline-dark btn-lg"
              >
                {loading ? (
                  <div className="d-flex align-items-center">
                    <div
                      className="spinner-border "
                      role="status"
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2">Loading...</span>
                  </div>
                ) : (
                  "Sumbit"
                )}
              </button>
            </div>
          </div>
        </div> */}
      </Modal.Body>
    </Modal>
  );
};

export default TakePhoto;
