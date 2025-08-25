import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  const cookies = request.cookies;

  const hasStudentToken =
    request.cookies.get("has_student_token")?.value === "true";

  const teacherPaths = [
    "/avis-passage/",
    "/cahier-seances/",
    "/groups/",
    "/emargement/",
  ];

  if (hasStudentToken && teacherPaths.some((tPath) => path.startsWith(tPath))) {
    console.log(
      "Middleware: redirection depuis page prof vers espace étudiant"
    );
    return NextResponse.redirect(new URL("/home-student", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
