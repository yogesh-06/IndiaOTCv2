import "bootstrap/dist/css/bootstrap.css";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DubaiOTC",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <>
      <div className="position-relative hero-bg-sm">{children}</div>
    </>
  );
}
