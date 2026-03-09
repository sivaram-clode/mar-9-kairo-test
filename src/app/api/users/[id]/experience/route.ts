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
  const { title, company, startDate, endDate, description } = body;

  if (!title || !company || !startDate) {
    return NextResponse.json(
      { error: "Title, company, and start date are required" },
      { status: 400 }
    );
  }

  const experience = await prisma.experience.create({
    data: {
      userId: params.id,
      title,
      company,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      description,
    },
  });

  return NextResponse.json(experience, { status: 201 });
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
  const experienceId = searchParams.get("experienceId");

  if (!experienceId) {
    return NextResponse.json(
      { error: "experienceId is required" },
      { status: 400 }
    );
  }

  await prisma.experience.deleteMany({
    where: { id: experienceId, userId: params.id },
  });

  return NextResponse.json({ success: true });
}
