import axios from "axios";
import { APITemplate } from "./API/Template";
// import { APITemplate } from "./API/Template";

export const DateFormate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getGeoDetails = async () => {
  try {
    const response = await axios.get("https://freeipapi.com/api/json/");
    return response.data; // Return the country code
  } catch (err) {
    console.error("Failed to fetch country:", err);
    return { countryCode: "AE" }; // or null, or some default value
  }
};

export const languages = ["en", "fr", "de", "lt", "ru", "es"];

export const fetchIPData = async (ip) => {
  const accessKey = "b56b710c4baa130e9201abd05d7d9de1";

  const options = {
    method: "GET",
    url: `https://api.ipapi.com/${ip}?access_key=${accessKey}`,
  };

  try {
    const response = await axios.request(options);
    return response.data; // Return the data from ipapi
  } catch (error) {
    console.error("Error fetching IP data:", error);
    throw new Error("Failed to fetch location data");
  }
};

export const fetchSEODetails = async (slug) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}website/seo/${slug}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error loading seo details:", error);
    return null;
  }
};

export const checkUserVPNValid = async () => {
  try {
    let userIP = await axios.get("https://api.ipify.org/?format=json");
    // check if user is using VPN
    let response = await APITemplate("checkVPN?ip=" + userIP?.data?.ip, "POST");
    if (response?.result < 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const checkUserCountry = async () => {
  try {
    let data = await getGeoDetails();
    let response = await APITemplate(
      "checkValidCountry?countryCode=" + data?.countryCode,
      "POST"
    );
    if (response?.data == true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const isFileProtected = async (file) => {
  try {
    const formData = new FormData();
    formData.append("pdfFile", file);

    let response = await APITemplate("user/checkPdfPassword", "POST", formData);

    if (response?.success == true) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error reading PDF:", error);
    return true; // Default to not protected in case of other errors
  }
};
