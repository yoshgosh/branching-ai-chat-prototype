import { NextResponse } from 'next/server';
import { handleGet } from './handlers/get';
import { handleDelete } from './handlers/delete';
import { handlePost } from './handlers/post';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const { status, body } = await handleGet(id);
    return NextResponse.json(body, { status });
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const { status, body } = await handleDelete(id);
    return NextResponse.json(body, { status });
}

export async function POST(request) {
    try {
        const { head, question } = await request.json();
        if (head === undefined || !question) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const { status, body } = await handlePost(head, question);
        return NextResponse.json(body, { status });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
