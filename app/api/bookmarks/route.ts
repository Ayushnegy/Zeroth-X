import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';

export async function GET() {
  const session = await auth();
  if (!session?.user?.githubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const bookmarks = await Bookmark.find({ githubId: session.user.githubId }).sort({ savedAt: -1 });
    return NextResponse.json(bookmarks);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.githubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    await dbConnect();

    const existing = await Bookmark.findOne({ githubId: session.user.githubId, issueId: body.issueId });
    if (existing) {
      return NextResponse.json({ error: 'Already bookmarked' }, { status: 409 });
    }

    const bookmark = await Bookmark.create({
      githubId: session.user.githubId,
      ...body
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: number }).code === 11000) return NextResponse.json({ error: 'Already bookmarked' }, { status: 409 });
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
