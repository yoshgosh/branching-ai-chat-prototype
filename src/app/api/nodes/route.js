import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.sqlite');

export async function GET() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM nodes', (err, rows) => {
            if (err) {
                reject(NextResponse.json({ error: 'Database error' }, { status: 500 }));
            } else {
                resolve(NextResponse.json({ nodes: rows }));
            }
        });
    });
}