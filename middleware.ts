import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/verifyToken";
import { cookies } from 'next/headers'

export async function middleware(req: NextRequest) {
  const headers = req.headers as unknown as Headers;
  const cookieStore = await cookies()
  const authHeader: String | undefined | null = headers.get('authorization') ||  cookieStore.get('access_token')?.value;

  // if (!authHeader) {
  //   return new Response(JSON.stringify({ message: "Token manquant" }), {
  //     status: 401,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // }

  // const tokenString = authHeader.split(" ")[1];
  // const encoder = new TextEncoder();
  // const token = encoder.encode(tokenString);
  // verifyToken(token);
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
