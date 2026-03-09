import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const connections = await prisma.connection.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    include: {
      requester: { select: { id: true, name: true, headline: true, avatar: true } },
      addressee: { select: { id: true, name: true, headline: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Return the "other" user for each connection
  const result = connections.map((c) => ({
    connectionId: c.id,
    connectedAt: c.createdAt,
    user: c.requesterId === userId ? c.addressee : c.requester,
  }));

  return NextResponse.json(result);
}
