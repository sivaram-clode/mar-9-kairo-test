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
  const { school, degree, field, startDate, endDate } = body;

  if (!school || !degree || !field || !startDate) {
    return NextResponse.json(
      { error: "School, degree, field, and start date are required" },
      { status: 400 }
    );
  }

  const education = await prisma.education.create({
    data: {
      userId: params.id,
      school,
      degree,
      field,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  return NextResponse.json(education, { status: 201 });
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
  const educationId = searchParams.get("educationId");

  if (!educationId) {
    return NextResponse.json(
      { error: "educationId is required" },
      { status: 400 }
    );
  }

  await prisma.education.deleteMany({
    where: { id: educationId, userId: params.id },
  });

  return NextResponse.json({ success: true });
}
