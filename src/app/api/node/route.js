import { NextResponse } from 'next/server';

// 動的なインポートを使用
let sqlite3;
if (typeof window === "undefined") {
    sqlite3 = (await import('sqlite3')).default;
}

const db = new sqlite3.Database('database.sqlite');

export async function POST(request) {
    console.log("POST /api/node reached");

    try {
        const { head, question } = await request.json();
        console.log("Received data:", { head, question });

        return new Promise((resolve, reject) => {
            const parentQuery = 'SELECT * FROM nodes WHERE id = ?';
            db.get(parentQuery, [head], (err, parent) => {
                if (err) {
                    console.error("Database error:", err);
                    reject(
                        NextResponse.json({ error: 'Database error' }, { status: 500 })
                    );
                } else if (!parent) {
                    console.error("Parent node not found");
                    reject(
                        NextResponse.json({ error: 'Parent node not found' }, { status: 404 })
                    );
                } else {
                    const answer = `回答文 (質問: ${question})`; // AI API呼び出し部分は仮
                    const insertQuery =
                        'INSERT INTO nodes (parent_id, question, answer) VALUES (?, ?, ?)';

                    db.run(insertQuery, [head, question, answer], function (err) {
                        if (err) {
                            console.error("Failed to insert node:", err);
                            reject(
                                NextResponse.json(
                                    { error: 'Failed to insert node' },
                                    { status: 500 }
                                )
                            );
                        } else {
                            console.log("Node inserted with ID:", this.lastID);
                            resolve(
                                NextResponse.json({
                                    new_node: {
                                        id: this.lastID,
                                        parent_id: head,
                                        question,
                                        answer,
                                    },
                                })
                            );
                        }
                    });
                }
            });
        });
    } catch (e) {
        console.error("Unhandled error:", e);
        return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
}