import { runQuery } from '../../db';

export async function handleDeleteAll() {
    try {
        // データベース内の全ての行を削除
        const result = await runQuery('DELETE FROM nodes');
        
        // 変更があった場合の結果を確認
        if (result.changes === 0) {
            return { status: 404, body: { message: 'No nodes to delete' } };
        }
        
        return { status: 200, body: { message: 'All nodes deleted successfully' } };
    } catch (error) {
        console.error('Error deleting all nodes:', error);
        return { status: 500, body: { error: 'Database error' } };
    }
}