
export async function POST() {
  // Endpoint temporairement désactivé pour éviter les erreurs TS
  return new Response(
    JSON.stringify({ message: "Endpoint temporairement désactivé" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
