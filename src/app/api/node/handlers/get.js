import { getSingleRow } from '../../db';

export async function handleGet(id) {
    try {
        // ノードを取得
        const node = await getSingleRow('SELECT * FROM nodes WHERE id = ?', [id]);

        // ノードが見つからない場合
        if (!node) {
            return { status: 404, body: { error: 'Node not found' } };
        }

        // レスポンス用の形式に変換
        const nodes = [{
                id: node.id,
                parentId: node.parent_id,
                question: node.question,
                answer: node.answer,
            }];

        return { status: 200, body: { nodes } };
    } catch (error) {
        console.error('Error fetching node:', error);
        return { status: 500, body: { error: 'Database error' } };
    }
}
