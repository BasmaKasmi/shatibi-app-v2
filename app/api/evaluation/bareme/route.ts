import { Scale } from "@/models/index";

export async function GET() {
  let data;
  try {
    data = await Scale.find({ delete: { $ne: true } });
    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ message: "No data found" }),
        {
          status: 204,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Error retrieving data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return new Response(
    JSON.stringify({ data }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { baremeIds } = body;

    if (!baremeIds || baremeIds.length < 1) {
      return new Response(
        JSON.stringify({ error: "baremeIds is required to delete the resources" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update multiple records based on provided IDs
    const res = await Scale.updateMany(
      { _id: { $in: baremeIds } },
      { $set: { deleted: true } }
    );

    if (!res || res.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Resources not found or already deleted" }),
        {
          status: 304,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: `${res.modifiedCount} resource(s) successfully marked as deleted`,
      }),
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
