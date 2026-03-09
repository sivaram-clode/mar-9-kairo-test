import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { id?: string }).id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Skill name is required" },
      { status: 400 }
    );
  }

  const skill = await prisma.skill.create({
    data: { userId: params.id, name },
  });

  return NextResponse.json(skill, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { id?: string }).id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const skillId = searchParams.get("skillId");

  if (!skillId) {
    return NextResponse.json(
      { error: "skillId is required" },
      { status: 400 }
    );
  }

  await prisma.skill.deleteMany({
    where: { id: skillId, userId: params.id },
  });

  return NextResponse.json({ success: true });
}
