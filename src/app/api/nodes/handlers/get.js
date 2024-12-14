import { runQuery } from '../../db';

export async function handleGet() {
    try {
        const rows = await runQuery('SELECT * FROM nodes ORDER BY id DESC');

        const nodes = rows.map(row => ({
            id: row.id,
            parentId: row.parent_id,
            question: row.question,
            answer: row.answer,
        }));

        return { status: 200, body: { nodes } };
    } catch (error) {
        console.error('Error fetching node:', error);
        return { status: 500, body: { error: 'Database error' } };
    }
}