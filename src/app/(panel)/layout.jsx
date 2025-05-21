import "../globals.css";
import "bootstrap/dist/css/bootstrap.css";

import Link from "next/link";
import Footer from "@/component/Footer";
import { LoaderProvider } from "@/context/LoaderProvider";
import Header from "@/component/panel/Header";

export const metadata = {
  title: "IndiaOTC",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <div className="d-flex align-items-start w-100 bg-light text-dark">
        <div id="sidebar" className="d-flex flex-column p-3">
          <ul className="nav nav-pills flex-column mb-4 gap-3">
            <li>
              <Link
                href="/dashboard"
                className="nav-link text-dark d-flex align-items-center"
              >
                <i className="fas fa-tachometer-alt me-3"></i>
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                href="/extraction"
                className="nav-link text-dark d-flex align-items-center"
              >
                <i className="fas fa-tachometer-alt me-3"></i>
                Data Extraction
              </Link>
            </li>

            <li>
              <Link
                href="/orders"
                className="nav-link text-dark d-flex align-items-center"
              >
                <i className="fas fa-box me-3"></i>
                Orders
              </Link>
            </li>

            <li>
              <a
                href="#account"
                data-bs-toggle="collapse"
                aria-expanded="false"
                aria-controls="account"
                className="nav-link text-dark d-flex align-items-center justify-content-between py-2 px-3 rounded-3 mb-2 hover-effect"
              >
                <div className="d-flex align-items-center">
                  <i className="fas fa-user me-3"></i>
                  Account
                </div>
                <span className="fas fa-chevron-down"></span>
              </a>
              <div
                className="collapse ps-3 py-2 mt-2 bg-light rounded-3"
                id="account"
              >
                <ul className="nav nav-collapse flex-column">
                  <li className="nav-item">
                    <Link
                      href="/kyc"
                      className="nav-link text-dark d-flex align-items-center py-2 px-3 rounded-3"
                    >
                      <i className="fas fa-id-card me-2"></i>
                      KYC
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      href="/accountStatement"
                      className="nav-link text-dark d-flex align-items-center py-2 px-3 rounded-3"
                    >
                      <i className="fas fa-file-invoice me-2"></i>
                      Account Statement
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <Link
                href="#"
                className="nav-link text-dark d-flex align-items-center"
              >
                <i className="fas fa-cogs me-3"></i>
                Settings
              </Link>
            </li>
          </ul>
          <hr className="border-dark" />

          {/* <div className="mt-auto mb-96 text-center">
            <div className="bg-gradient p-4 rounded-4 shadow-lg">
              <h5 className="fw-bold mb-4">Help</h5>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link
                    href="/faq"
                    className="nav-link text-white py-2 px-3 rounded-3 mb-2 bg-primary hover-bg-primary"
                  >
                    <i className="bi bi-question-circle me-2"></i> FAQ's
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/contact"
                    className="nav-link text-white py-2 px-3 rounded-3 mb-2 bg-success hover-bg-success"
                  >
                    <i className="bi bi-envelope me-2"></i> Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div> */}
        </div>
        <LoaderProvider>
          <div className="flex-fill min-vh-100 bg-white p-4">{children}</div>
        </LoaderProvider>
      </div>
      <Footer />
    </>
  );
}
