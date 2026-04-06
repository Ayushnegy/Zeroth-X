import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import UserPrefs from '@/models/UserPrefs';

export async function GET() {
  const session = await auth();
  if (!session?.user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const prefs = await UserPrefs.findOne({ userId: session.user.userId });
    return NextResponse.json(prefs || {});
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { skills, experience, languages } = await req.json();
    await dbConnect();

    const prefs = await UserPrefs.findOneAndUpdate(
      { userId: session.user.userId },
      {
        userId: session.user.userId,
        username: session.user.username || session.user.name || 'Unknown',
        avatar: session.user.avatar || '',
        skills,
        experience,
        languages,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(prefs);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
