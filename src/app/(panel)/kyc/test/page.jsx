"use client";
import { enqueueSnackbar } from "notistack";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const Page = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageSelfieData, setImageSelfieData] = useState(null);
  const [binaryData, setBinaryData] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [stream, setStream] = useState(null);

  const startWebcam = async () => {
    try {
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

  const saveBinary = async (binaryData) => {
    const blob = new Blob([binaryData], { type: "image/png" });

    const formData = new FormData();
    formData.append("file", blob, "snapshot.png");

    try {
      const response = await axios.post(
        "http://localhost:8000/webcam-test",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSelfieError = (err) => {
    stopWebcam();
    console.error("Error accessing webcam: ", err);
    setCameraOn(false);

    const localUrl = window.location.href;
    setQrCodeUrl(localUrl);

    enqueueSnackbar("Error accessing webcam.", {
      variant: "error",
      autoHideDuration: 5000,
    });
  };

  useEffect(() => {
    if (binaryData) {
      saveBinary(binaryData);
    }
  }, [imageSelfieData, binaryData]); // Track both imageSelfieData and binaryData

  return (
   
    <>
        <div className="d-flex flex-column justify-content-between align-items-start gap-3">
          <h2 className="fw-bold">Webcam Test</h2>

          <button className="btn btn-primary" onClick={startWebcam}>
            <i className="fa-solid fa-camera me-2"></i>
            Start Webcam
          </button>
        </div>
        {!cameraOn && qrCodeUrl && (
          <div className="mt-4">
            <h4 className="fw-bold">
              Webcam Not Found. Scan the QR Code Below:
            </h4>
            <QRCodeCanvas value={qrCodeUrl} size={128} />
          </div>
        )}
        {(cameraOn || imageSelfieData) && (
          <div className="d-flex justify-content-start align-items-center gap-4 mt-3">
            <div>
              <div className="d-flex flex-column align-items-center gap-2">
                <video
                  ref={videoRef}
                  className="img-fluid object-fit-cover rounded-3 h-50 w-50"
                ></video>
                <button
                  className="btn btn-success"
                  onClick={!cameraOn && imageSelfieData ? startWebcam : capturePhoto}
                >
                  {!cameraOn && imageSelfieData ? "Retake" : " Take a snapshot"}
                </button>
              </div>
            </div>
            <canvas ref={canvasRef} className="d-none"></canvas>

            {imageSelfieData && (
              <div>
                <div className="d-flex flex-column align-items-center gap-2">
                  <img
                    src={imageSelfieData}
                    alt="Captured"
                    className="img-fluid object-fit-cover rounded-3 h-50 w-50"
                  />
                  <h6 className="fw-bold">Captured Image</h6>
                </div>
              </div>
            )}
          </div>
        )}
     </>
    
  );
};

export default Page;