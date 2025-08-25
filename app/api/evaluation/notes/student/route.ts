import { Rating } from "@/models/index";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const groupId = searchParams.get("groupId");

    if (!studentId) {
      return new Response(JSON.stringify({ error: "studentId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!groupId) {
      return new Response(JSON.stringify({ error: "Group ID is missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch the ratings with filtered evalSheetId
    let ratings = await Rating.find({ studentId }).populate({
      path: "evalSheetId",
      match: { groupId, status: "Transmise" },
      populate: [
        {
          path: "modId",
          select: "title",
        },
        {
          path: "scaleId",
          select: "max",
        },
      ],
    });

    ratings = ratings.filter((rating) => rating.evalSheetId);

    // Check if ratings are found
    if (!ratings.length) {
      return new Response(
        JSON.stringify({ message: "No ratings found for the given criteria" }),
        {
          status: 204,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ data: ratings }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`Error fetching data: ${err}`);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
