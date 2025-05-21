"use client";
import { checkUserCountry, checkUserVPNValid } from "@/component/global";
import { useRouter } from "next/navigation";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { createContext, useContext, useEffect, useState } from "react";

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loader, setLoader] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    async function authAdmin() {
      // let isValidUser = await checkUserVPNValid();
      // let isValidCountry = await checkUserCountry();
      // if (!isValidCountry) {
      //   enqueueSnackbar("We are not available in your country", {
      //     variant: "error",
      //     autoHideDuration: 50000,
      //   });
      //   setLoader(true);
      //   return;
      // }
      // if (!isValidUser) {
      //   router.push("/403");
      //   return;
      // }
    }
    // setTimeout(() => {
    //   authAdmin();
    // }, 2000);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <LoaderContext.Provider value={{ loader, setLoader, isMobile }}>
      <SnackbarProvider
        preventDuplicate
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />

      {loader == true && (
        <div className="position-fixed top-0 start-0 w-100 h-100 loader-glass z-999">
          <div className="position-absolute top-50 start-50 z-999 translate-middle">
            <div
              className="spinner-border text-primary"
              style={{ width: "100px", height: "100px" }}
            ></div>
          </div>
        </div>
      )}
      {children}
    </LoaderContext.Provider>
  );
};
