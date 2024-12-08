import { runQuery } from '../../db';

export async function handleDelete(id) {
    try {
        const result = await runQuery('DELETE FROM nodes WHERE id = ?', [id]);
        if (result.changes === 0) {
            return { status: 404, body: { error: 'Node not found' } };
        }
        return { status: 200, body: { message: 'Node deleted successfully' } };
    } catch (error) {
        console.error('Error deleting node:', error);
        return { status: 500, body: { error: 'Database error' } };
    }
}
