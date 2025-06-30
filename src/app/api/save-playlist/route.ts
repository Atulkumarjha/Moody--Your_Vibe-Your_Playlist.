import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import { Playlist } from '../../../../models/playlist';

export async function POST(req: NextRequest) {
    const {  id, name, image, userId } = await req.json();

    try {
        await connectDB();
        await Playlist.create({
            spotifyId: id,
            name,
            image,
            userId,
        });

        return NextResponse.json({ success: true });
    }catch (err) {
        console.error('DB error;', err);
        return NextResponse.json({ error: 'faileed to save'}, { status: 500 });
    }
}