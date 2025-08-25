import { importSPKI, jwtVerify } from "jose";

export const verifyToken = async (token: Uint8Array) => {
  try { 
    if (!process.env.JWT_PUBLIC_KEY) {
      throw new Error("Public key is not set in the environment variables.");
    }
    const key = await importSPKI(process.env.JWT_PUBLIC_KEY, "RS256");
    const { payload } = await jwtVerify(token, key);

    return payload;
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Token invalide" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
};
