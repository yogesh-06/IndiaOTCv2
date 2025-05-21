import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "../globals.css";
import { LoaderProvider } from "@/context/LoaderProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IndiaOTC",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <>
      <div className="position-relative">{children}</div>
    </>
  );
}
