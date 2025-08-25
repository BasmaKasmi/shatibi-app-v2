import { EvalMod } from "@/models/index";

export async function GET() {
  let data;
  try {
    data = await EvalMod.find({ delete: { $ne: true } });
    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ message: "No data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Error retrieving data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID is required to delete the resource" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const res = await EvalMod.updateOne(
      { _id: id },
      { $set: { deleted: true } }
    );

    if (!res || res.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Resource not found or already deleted" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Resource successfully marked as deleted" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error deleting resource:", err);
    return new Response(
      JSON.stringify({
        error: "An internal server error occurred while processing the request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
