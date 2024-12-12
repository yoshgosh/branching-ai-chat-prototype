import { NextResponse } from 'next/server';
import { handleGet } from './handlers/get';
import { handleDelete } from './handlers/delete';

export async function GET() {
    const { status, body } = await handleGet();
    return NextResponse.json(body, { status });
}

export async function DELETE() {
    const { status, body } = await handleDelete();
    return NextResponse.json(body, { status });
}
