import { NextResponse } from 'next/server';
import { runQuery } from '../db';

export async function GET() {
    try {
        const nodes = await runQuery('SELECT * FROM nodes');
        return NextResponse.json({ nodes }, { status: 200 });
    } catch (error) {
        console.error('Error fetching nodes:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
