import { Student } from "@/api";
import { EvalSheet, Rating } from "@/models/index";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const { modId, subject, scaleId, date, groups, teacherId } = body;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("access_token")?.value;

  if (!cookieHeader) {
    return new Response(
      JSON.stringify({ error: "Missing authorization token" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const groupPromises = groups.map(async (grp: string) => {
      let statut;
      const today = new Date();
      new Date(date) >= today ? (statut = "À venir") : (statut = "À saisir");

      const newEvalSheet = new EvalSheet({
        modId,
        subject,
        scaleId,
        groupId: grp,
        passageDate: date,
        statut,
      });

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/teacher/student/list/${grp}/group`,
          { teacher_id: teacherId },
          {
            headers: {
              Authorization: `Bearer ${cookieHeader}`,
              "Content-Type": "application/json",
            },
          }
        );

        const evalSheet = await newEvalSheet.save();

        const ratingPromises = response.data.result.map(
          async (stud: Student) => {
            await new Rating({
              evalSheetId: evalSheet._id,
              studentId: stud.id,
              score: "N/A",
            }).save();
          }
        );

        await Promise.all(ratingPromises);
      } catch (error) {
        // If an error occurs in the group request, log and throw
        console.error(
          `Error processing group ${grp}:`,
          axios.isAxiosError(error) && (error.response?.data || error.message)
        );
        throw new Error(`Failed to process group ${grp}`);
      }
    });

    await Promise.all(groupPromises);

    return new Response(
      JSON.stringify({ message: "La feuille d'évaluation a bien été créée" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error:
          (axios.isAxiosError(error) && error.message) ||
          "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
export async function GET(req: Request) {
  try {
    // Analyse de l'URL et extraction des paramètres
    const { searchParams } = new URL(req.url);
    const groupIds = searchParams.get("groupIds");

    // Transformation des `groupIds` en tableau de nombres
    const groupIdsArr =
      groupIds?.split(",").map(Number).filter(Number.isFinite) || [];

    // Vérification si `groupIds` est vide
    if (groupIdsArr.length === 0) {
      return new Response(
        JSON.stringify({
          message: "Aucun identifiant de groupe valide fourni",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Récupération des données depuis la base
    const evalSheet = await EvalSheet.find({ groupId: { $in: groupIdsArr } })
      .populate({ path: "modId", select: "title" })
      .populate({ path: "scaleId", select: "subject min max type" })
      .sort({ passageDate: 1 });

    // Vérification si des données ont été trouvées
    if (!evalSheet || evalSheet.length === 0) {
      return new Response(
        JSON.stringify({ message: "Aucune donnée trouvée" }),
        {
          status: 204,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Retour des données
    return new Response(JSON.stringify({ data: evalSheet }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Erreur dans GET:", err);

    return new Response(
      JSON.stringify({
        message: "Une erreur est survenue",
        error: err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { evalSheetIds, definitely = false } = body;
    let ids = evalSheetIds;

    if (!ids) {
      return new Response(
        JSON.stringify({ error: "Le paramètre evalSheetIds est requis" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
      return new Response(
        JSON.stringify({
          error: "evalSheetIds doit être un tableau valide de chaînes",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!definitely) {
      const result = await EvalSheet.updateMany(
        { _id: { $in: ids } },
        { $set: { delete: true } }
      );

      if (result.modifiedCount === 0) {
        return new Response(
          JSON.stringify({
            error:
              "Aucune ressource trouvée pour les IDs fournis ou elles sont déjà supprimées",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Mise à jour réussie",
          modifiedCount: result.modifiedCount,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const result = await EvalSheet.deleteMany({ _id: { $in: ids } });
      const ratingResult = await Rating.deleteMany({
        evalSheetId: { $in: ids },
      });

      if (!result || !ratingResult) {
        return new Response(
          JSON.stringify({
            error:
              "Une erreur s'est produite lors de la suppression des ressources",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (result.deletedCount === 0) {
        return new Response(
          JSON.stringify({
            error:
              "Aucune ressource trouvée pour les IDs fournis ou elles sont déjà supprimées",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Suppression réussie",
          deletedCount: result.deletedCount,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { evalSheetId, modId, subject, scaleId, date, groups, teacherId } =
      body;

    if (!evalSheetId) {
      return new Response(
        JSON.stringify({ error: "Le paramètre evalSheetId est requis" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const evalSheet = await EvalSheet.findById(evalSheetId);

    if (!evalSheet) {
      return new Response(
        JSON.stringify({ error: "Feuille d'évaluation introuvable" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (modId) evalSheet.modId = modId;
    if (subject) evalSheet.subject = subject;
    if (scaleId) evalSheet.scaleId = scaleId;
    if (date) evalSheet.passageDate = date;
    if (groups) evalSheet.groups = groups;
    if (teacherId) evalSheet.teacherId = teacherId;

    await evalSheet.save();

    return new Response(
      JSON.stringify({ message: "Mise à jour réussie", evalSheet }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour :", error);
    return new Response(
      JSON.stringify({
        error: "Erreur interne du serveur",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
