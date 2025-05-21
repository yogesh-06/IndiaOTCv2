import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const PdfPassword = ({ isOpen, onClose, onPasswordSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(""); // Clear error when typing
  };

  const handleSubmit = async () => {
    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      onPasswordSubmit(password);
      onClose(); // Close the modal on success
      setPassword("");
      setPasswordError("");
    } catch (error) {
      console.error("error while password submission", error);
      setPasswordError("");
    } finally {
      setLoading(false);
      setPassword("");
      setPasswordError("");
    }
  };

  return (
    <Modal
      show={isOpen === "open"}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="bg-primary text-white">
        <Modal.Title>Unlock Protected PDF</Modal.Title>
        <Button variant="close" onClick={onClose} className="btn-close-white" />
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="text-center mb-4">
          <i
            className="bi bi-lock-fill text-warning"
            style={{ fontSize: "3rem" }}
          ></i>
          <p className="mt-2 text-muted">
            This PDF is password protected. Enter the password below.
          </p>
        </div>
        <Form>
          <Form.Group className="mb-3" controlId="pdfPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
              isInvalid={!!passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
        <div className="d-flex justify-content-end mt-4">
          <Button variant="secondary" className="me-2" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Processing...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PdfPassword;
