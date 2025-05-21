import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import CookieConsentBar from "@/component/CookieConsentBar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IndiaOTC",
  description: "",
  keywords: [],
  // alternates: {
  //   canonical: ⁠ ${process.env.DOMAIN}/service ⁠,
  // },
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          />
        </head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <body className={inter.className}>
          <div>
            <CookieConsentBar />
          </div>
          {children}
        </body>
      </html>
    </UserProvider>
  );
}
