import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ status: "none" });
  }

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(req.url);
  const targetId = searchParams.get("userId");

  if (!targetId || targetId === userId) {
    return NextResponse.json({ status: "self" });
  }

  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId: userId, addresseeId: targetId },
        { requesterId: targetId, addresseeId: userId },
      ],
    },
  });

  if (!connection) {
    return NextResponse.json({ status: "none" });
  }

  if (connection.status === "ACCEPTED") {
    return NextResponse.json({ status: "connected", connectionId: connection.id });
  }

  if (connection.status === "PENDING") {
    return NextResponse.json({
      status: "pending",
      connectionId: connection.id,
      direction: connection.requesterId === userId ? "sent" : "received",
    });
  }

  // REJECTED — allow re-request
  return NextResponse.json({ status: "none" });
}
