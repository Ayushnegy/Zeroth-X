import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';

export async function DELETE(req: Request, { params }: { params: { issueId: string } }) {
  const session = await auth();
  if (!session?.user?.githubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    await Bookmark.findOneAndDelete({ githubId: session.user.githubId, issueId: Number(params.issueId) });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
