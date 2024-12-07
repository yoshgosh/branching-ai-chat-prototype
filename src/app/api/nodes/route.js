import { NextResponse } from 'next/server';

// 動的なインポートを使用
let sqlite3;
if (typeof window === "undefined") {
    sqlite3 = (await import('sqlite3')).default;
}

const db = new sqlite3.Database('database.sqlite');

export async function GET(request) {
    console.log("GET /api/nodes reached");

    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM nodes'; // 全レコードを取得

        db.all(query, [], (err, rows) => {
            if (err) {
                console.error("Database error:", err);
                reject(
                    NextResponse.json({ error: 'Database error' }, { status: 500 })
                );
            } else {
                console.log("Retrieved nodes:", rows);
                resolve(
                    NextResponse.json({ nodes: rows }, { status: 200 })
                );
            }
        });
    });
}
