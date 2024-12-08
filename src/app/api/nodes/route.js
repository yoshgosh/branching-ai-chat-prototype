import { NextResponse } from 'next/server';
import { runQuery } from '../db';

export async function GET() {
    try {
        // データベースから全ノードを取得
        const rows = await runQuery('SELECT * FROM nodes');

        // データを指定形式に変換
        const nodes = rows.reduce((acc, row) => {
            acc[row.id] = {
                parent_id: row.parent_id,
                question: row.question,
                answer: row.answer,
            };
            return acc;
        }, {});

        return NextResponse.json({ nodes }, { status: 200 });
    } catch (error) {
        console.error('Error fetching nodes:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
