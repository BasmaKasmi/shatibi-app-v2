export async function GET(req: Request) {
    return new Response(JSON.stringify({ data: 'test\'s working' }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
}