import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import { Montserrat } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
const inter = Montserrat({ subsets: ["latin"] });
import Script from "next/script";

export const metadata = {
  title: "IndiaOTC",
  description: "",
  keywords: [],
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html>
        <head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          />
        </head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <body className={inter.className}>
          {children}

          <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossOrigin="anonymous"
          ></Script>
        </body>
      </html>
    </UserProvider>
  );
}
