import { EvalSheet, Rating } from "@/models/index";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import { Student as StudentInterface, Rating as RatingInterface } from "@/api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sheetId = searchParams.get("sheetId");
  const groupId = searchParams.get("groupId");
  const teacherId = searchParams.get("teacherId");
  const date = searchParams.get("date");

  if (!sheetId) {
    return new Response(JSON.stringify({ error: "sheetId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const grpId =
    groupId && !Number.isNaN(parseInt(groupId)) ? parseInt(groupId) : null;
  const teachId =
    teacherId && !Number.isNaN(parseInt(teacherId))
      ? parseInt(teacherId)
      : null;

  if (!grpId || !teachId) {
    return new Response(
      JSON.stringify({ error: "Group ID or Teacher ID is missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const tempRatings = await Rating.find({
      evalSheetId: new Types.ObjectId(sheetId),
    });
    let res: RatingInterface[] = [];

    const headers = req.headers as unknown as Headers;
    const cookieStore = await cookies();
    const authHeader: String | undefined | null =
      headers.get("authorization") || cookieStore.get("access_token")?.value;

    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/teacher/student/list/${grpId}/group`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${authHeader}`,
    //     },
    //     body: JSON.stringify({ teacher_id: teachId }),
    //   }
    // );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/teacher/attendance/student/list/group`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authHeader}`,
        },
        body: JSON.stringify({ group_id: grpId, date, teacher_id: teachId }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    let students = await response.json();
    students = students.result;

    tempRatings.forEach((rating) => {
      const student = students.find(
        (student: StudentInterface) => student.id == rating.studentId
      );

      res.push(
        student?.name
          ? {
              ...rating._doc,
              studentName: student.name,
              abs: rating.abs || (rating.score === "N/A" && student.absent),
              score:
                rating.score === "N/A" && student.absent ? "Abs" : rating.score,
            }
          : { ...rating._doc }
      );
    });

    return new Response(JSON.stringify({ data: res }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    err instanceof Error &&
      console.error(`Error fetching data: ${err.message}`);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  const { data } = await req.json();

  try {
    const resRating = await Promise.all(
      data.evalRating.map(async (rating: RatingInterface) => {
        await Rating.updateOne(
          { _id: rating._id },
          {
            $set: {
              score: rating.score,
              nc: rating.nc,
              appreciation: rating.appreciation,
            },
          }
        );
      })
    );

    if (!resRating) {
      return new Response(
        JSON.stringify({ error: "Failed to update ratings" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const resEvalSheet = await EvalSheet.updateOne(
      { _id: data.evalRating[0].evalSheetId },
      { $set: { statut: "Remplis", sendDate: data.date } }
    );

    if (!resEvalSheet) {
      return new Response(
        JSON.stringify({ error: "Failed to update evalSheet" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response(
      JSON.stringify({ message: "Data updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
