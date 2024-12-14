import { insertQuery, getSingleRow, runQuery } from '../../db';
import { answerByAI } from '../../utils/ai';
const ANSWER_MODE = true;

export async function handlePost(head, question) {
    try {
        // messagesを構築
        let messages = [
            { role: "system", content: "あなたは優秀なAIアシスタントです。" },
        ];

        if (head !== null) {
            const parentNode = await getSingleRow('SELECT id FROM nodes WHERE id = ?', [head]);
            if (!parentNode) {
                return { status: 404, body: { error: 'Parent node not found' } };
            }
            // 再帰クエリで親ノードをたどる
            const query = `
            WITH RECURSIVE recursive_nodes AS (
                SELECT id, parent_id, question, answer
                FROM nodes
                WHERE id = ?
        
                UNION ALL
        
                SELECT n.id, n.parent_id, n.question, n.answer
                FROM nodes n
                INNER JOIN recursive_nodes rn ON rn.parent_id = n.id
            )
            SELECT question, answer
            FROM recursive_nodes;
            `;
            const rows = await runQuery(query, [head]);

            // 再帰クエリで取得したデータをメッセージ形式に追加
            for (const row of rows.reverse()) { // 上位ノードから順に並べるため逆順に
                messages.push({ role: "user", content: row.question });
                messages.push({ role: "assistant", content: row.answer });
                console.log(`Type of row.question: ${typeof row.question}`);
                console.log(`Value of row.question: ${row.question}`);
            }
        }

        // 新しい質問を追加
        messages.push({ role: "user", content: question });
        console.log("messages: ", messages)

        // 回答生成
        let answer = "answer to "+question;
        if (ANSWER_MODE){
            answer = await answerByAI(messages);
        }
        console.log("answer: ", answer)

        // 新しいノードを挿入
        const newId = await insertQuery(
            'INSERT INTO nodes (parent_id, question, answer) VALUES (?, ?, ?)',
            [head, question, answer]
        );

        const nodes = [{
                id: newId,
                parentId: head,
                question,
                answer,
            }];

        return {
            status: 201,
            body: {
                nodes
            },
        };
    } catch (error) {
        console.error('Error creating node:', error);
        return { status: 500, body: { error: 'Database error' } };
    }
}