import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Create a post
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { content, imageUrl } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      authorId: userId,
      content: content.trim(),
      imageUrl: imageUrl || null,
    },
    include: {
      author: { select: { id: true, name: true, avatar: true, headline: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return NextResponse.json({ ...post, isLiked: false }, { status: 201 });
}

// Get paginated feed (own posts + connections' posts)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  // Get accepted connection user IDs
  const connections = await prisma.connection.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    select: { requesterId: true, addresseeId: true },
  });

  const connectionIds = connections.map((c) =>
    c.requesterId === userId ? c.addresseeId : c.requesterId
  );
  const feedUserIds = [userId, ...connectionIds];

  const posts = await prisma.post.findMany({
    where: { authorId: { in: feedUserIds } },
    include: {
      author: { select: { id: true, name: true, avatar: true, headline: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId }, select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = posts.length > limit;
  const results = posts.slice(0, limit).map((post) => ({
    ...post,
    isLiked: post.likes.length > 0,
    likes: undefined,
  }));

  return NextResponse.json({
    posts: results,
    nextCursor: hasMore ? results[results.length - 1].id : null,
  });
}
