import { NextRequest, nextResponse } from 'next/server';
import { connectDB }  from '../../../../lib/db';
import { Playlist } from '../../../../models/playlist';

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId');
    
    try{
        await connectDB();
        const data = (await Playlist.find({ userId })).toSorted({ createdAt: -1 });
        return NextResponse.json(data);      
    }catch (err) {
        return NextResponse.json({ error: 'DB read failed' }, { status: 500 }
        );
    }
}