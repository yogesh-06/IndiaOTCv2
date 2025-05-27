import "../globals.css";
import "bootstrap/dist/css/bootstrap.css";

import Link from "next/link";
import { LoaderProvider } from "@/context/LoaderProvider";

export const metadata = {
  title: "IndiaOTC",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <>
      <div className="">
        <LoaderProvider>
          <div className="">{children}</div>
        </LoaderProvider>
      </div>
    </>
  );
}
