import { getSingleRow } from '../../db';

export async function handleGet(id) {
    try {
        const node = await getSingleRow('SELECT * FROM nodes WHERE id = ?', [id]);
        if (!node) {
            return { status: 404, body: { error: 'Node not found' } };
        }
        return { status: 200, body: { node } };
    } catch (error) {
        console.error('Error fetching node:', error);
        return { status: 500, body: { error: 'Database error' } };
    }
}
