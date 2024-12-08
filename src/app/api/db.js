import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.sqlite');

// クエリを実行するヘルパー関数
export function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// 単一行を取得するヘルパー関数
export function getSingleRow(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// データを挿入するヘルパー関数
export function insertQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}
