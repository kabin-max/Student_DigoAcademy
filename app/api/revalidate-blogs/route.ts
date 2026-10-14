import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret =
      req.headers.get('x-revalidate-secret') || searchParams.get('secret');

    const expectedSecret =
      process.env.BLOG_REVALIDATE_SECRET || 'digo-academy-revalidate-secret';

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized secret token' },
        { status: 401 }
      );
    }

    // Invalidate academy blogs cache tags
    revalidateTag('academy-blogs', 'max-age=0' as any);

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      message: 'Academy blogs cache revalidated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revalidate cache', details: String(error) },
      { status: 500 }
    );
  }
}
