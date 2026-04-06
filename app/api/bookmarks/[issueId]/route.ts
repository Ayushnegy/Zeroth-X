import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';

export async function DELETE(req: Request, { params }: { params: { issueId: string } }) {
  const session = await auth();
  if (!session?.user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    await Bookmark.findOneAndDelete({ userId: session.user.userId, issueId: Number(params.issueId) });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
