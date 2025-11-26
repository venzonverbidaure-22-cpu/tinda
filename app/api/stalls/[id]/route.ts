import { NextResponse } from 'next/server';
import { db } from '@/db';
import { stalls } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const stall = await db.select().from(stalls).where(eq(stalls.id, Number(id))).get();
    if (stall) {
      return NextResponse.json(stall);
    } else {
      return NextResponse.json({ message: 'Stall not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching stall:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
