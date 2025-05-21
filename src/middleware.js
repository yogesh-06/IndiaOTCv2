import { NextResponse } from "next/server";
import { getSession } from "./component/API/Auth";
import { APITemplate } from "./component/API/Template";

export async function middleware(request) {
  const session = await getSession(request);
  // Cache the response if the session exists
  let cachedResponse = null;
  const response = NextResponse.next();

  if (request.nextUrl.pathname == "/login" && !session) {
    return response;
  }
  if (request.nextUrl.pathname == "/register" && !session) {
    return response;
  }
  if (request.nextUrl.pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (request.nextUrl.pathname === "/register" && session) {
    if (session.status == "active") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/kyc", request.url));
    }
  }

  const lockedPaths = ["/kyc", "/dashboard", "/orders", "/accountStatement"];

  // const languages = ["en", "fr", "it", "lt", "ru", "es"];

  // Check if the request is for a protected path and the user is not authenticated
  if (
    lockedPaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    !session
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session) {
    if (!cachedResponse) {
      cachedResponse = await APITemplate(
        `user/check/${session._id}`,
        "GET",
        {},
        {
          Authorization: `${request.cookies.get("userAccessToken")?.value}`,
        }
      );
    }
  } else {
    cachedResponse = {
      success: false,
      data: {
        active: false,
        status: "pending",
      },
    };
  }

  if (cachedResponse.success == false || cachedResponse.data.active == false) {
    response.cookies.delete("userAccessToken", {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    response.cookies.delete("userRefreshToken", {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    response.cookies.delete("userSession", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    if (request.nextUrl.pathname == "/") {
      return NextResponse.redirect(new URL("/register", request.url));
    }
    return response;
  }

  response.cookies.set("userSession", session._id, {
    httpOnly: false,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  if (
    lockedPaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    session &&
    cachedResponse.data?.status == "pending" &&
    request.nextUrl.pathname != "/kyc" &&
    request.nextUrl.pathname != "/kyc/enhanceVerification" &&
    request.nextUrl.pathname != "/kyc/test" &&
    request.nextUrl.pathname != "/kyc/verification"
  ) {
    return NextResponse.redirect(new URL("/kyc", request.url));
  }
  if (request.nextUrl.pathname == "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  return response;
}
