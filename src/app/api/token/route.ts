import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const access_token = (await cookies()).get('access_token')?.value;
    return NextResponse.json({ access_token });
}