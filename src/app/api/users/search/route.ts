import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ users: [] });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { headline: { contains: q, mode: "insensitive" } },
        { skills: { some: { name: { contains: q, mode: "insensitive" } } } },
      ],
    },
    select: {
      id: true,
      name: true,
      headline: true,
      avatar: true,
      location: true,
      skills: { select: { id: true, name: true }, take: 5 },
    },
    take: 20,
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ users });
}
