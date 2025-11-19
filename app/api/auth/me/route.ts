// app/api/auth/me/route.ts CHECAR ESTRUCTURA ANTES DE USAR
// import { type NextRequest, NextResponse } from "next/server"
// import { getSimpleSession } from "@/lib/simple-auth"

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getSimpleSession()

//     if (!session.isLoggedIn || !session.user) {
//       return NextResponse.json({ isLoggedIn: false })
//     }

//     return NextResponse.json({
//       userId: session.user.id,
//       email: session.user.email,
//       role: session.user.role,
//       isLoggedIn: true,
//       firstName: session.user.firstName,
//       lastName: session.user.lastName,
//       profileImage: session.user.profileImage,
//       isVerified: session.user.isVerified,
//     })
//   } catch (error) {
//     console.error("Auth check error:", error)
//     return NextResponse.json({ isLoggedIn: false }, { status: 500 })
//   }
// }
// NUEVA ESTRUCTURA
import { NextResponse } from "next/server";
import { getSimpleSession } from "@/lib/getSimpleSession";

export async function GET() {
  const session = await getSimpleSession();

  if (!session.isLoggedIn) {
    return NextResponse.json({ isLoggedIn: false });
  }

  return NextResponse.json({
    isLoggedIn: true,
    user: session.user,
  });
}
