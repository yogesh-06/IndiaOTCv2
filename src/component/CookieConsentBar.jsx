"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieConsentBar() {
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === "true") {
      setShowCookieConsent(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShowCookieConsent(false);
  };

  return (
    showCookieConsent && (
      <div className="cookie-consent-contianer">
        <div className="cookie-consent-bar shadow-lg Tertiary_500 text-white">
          <p>
            We use cookies to improve your experience on our website. By
            continuing to use our website, you consent to our{" "}
            <Link
              target="_blank"
              title="Cookie Policy"
              href={"/en/cookie-policies"}
              className="text-light link-offset-3 text-decoration-underline "
            >
              use of cookies
            </Link>
            .
          </p>
          <div>
            <button
              className="btn Tertiary_100 px-4  rounded-pill"
              onClick={handleAccept}
              style={{ color: "black" }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    )
  );
}
