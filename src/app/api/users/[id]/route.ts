import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      headline: true,
      avatar: true,
      summary: true,
      location: true,
      createdAt: true,
      experiences: { orderBy: { startDate: "desc" } },
      educations: { orderBy: { startDate: "desc" } },
      skills: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { id?: string }).id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, headline, avatar, summary, location } = body;

  const user = await prisma.user.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(headline !== undefined && { headline }),
      ...(avatar !== undefined && { avatar }),
      ...(summary !== undefined && { summary }),
      ...(location !== undefined && { location }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      headline: true,
      avatar: true,
      summary: true,
      location: true,
    },
  });

  return NextResponse.json(user);
}
