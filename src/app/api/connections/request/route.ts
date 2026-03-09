import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { addresseeId } = await req.json();

  if (!addresseeId) {
    return NextResponse.json({ error: "addresseeId required" }, { status: 400 });
  }

  if (addresseeId === userId) {
    return NextResponse.json({ error: "Cannot connect with yourself" }, { status: 400 });
  }

  // Check if connection already exists in either direction
  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId: userId, addresseeId },
        { requesterId: addresseeId, addresseeId: userId },
      ],
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Connection already exists" }, { status: 409 });
  }

  const connection = await prisma.connection.create({
    data: { requesterId: userId, addresseeId },
  });

  return NextResponse.json(connection, { status: 201 });
}
