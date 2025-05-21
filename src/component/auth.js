import { jwtVerify } from "jose";

export const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

export async function getSession(request) {
  const session = request?.cookies?.get("userAccessToken")?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    if (payload.type !== "individual" && payload.type !== "company") {
      return null;
    }
    return payload;
  } catch (error) {
    // console.error('JWT verification failed:', error);
    return null;
  }
}
