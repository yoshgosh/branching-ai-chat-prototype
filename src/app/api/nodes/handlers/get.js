import { runQuery } from '../../db';

export async function handleGet() {
    try {
        // データベースから全ノードを取得
        const rows = await runQuery('SELECT * FROM nodes');

        // データを指定形式に変換
        const nodes = rows.reduce((acc, row) => {
            acc[row.id] = {
                id: row.id,
                parent_id: row.parent_id,
                question: row.question,
                answer: row.answer,
            };
            return acc;
        }, {});

        return { status: 200, body: { nodes } };
    } catch (error) {
        console.error('Error fetching node:', error);
        return { status: 500, body: { error: 'Database error' } };
    }
}

