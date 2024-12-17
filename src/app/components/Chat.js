"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import "../styles/markdown.css";

const UserMessage = ({ node }) => {
    // サニタイズ処理
    const sanitizedQuestion = DOMPurify.sanitize(node.question || "");

    return (
        <div
            style={{
                margin: "10px 0",
                maxWidth: "70%",
                alignSelf: "flex-end", // コンテナを右寄せ
                display: "flex", // フレックスボックスで整列
                justifyContent: "flex-end", // コンテナ自体を右側に配置
            }}
        >
            <div
                style={{
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "10px",
                    textAlign: "left", // テキストを左寄せ
                    width: "100%", // 内側で幅を確保
                }}
            >
                {sanitizedQuestion}
            </div>
        </div>
    );
};

const AssistantMessage = ({ node, mode, onIconClick }) => {
    const border = mode === "head" ? "2px solid #4855E5" : "2px solid #fff";

    // サニタイズしたマークダウンを生成
    const sanitizedMarkdown = DOMPurify.sanitize(node.answer || "");

    return (
        <div
            style={{
                display: "flex", // 四角と円を横並びに配置
                alignItems: "flex-start", // 垂直方向の中央揃え
                margin: "10px 0",
                maxWidth: "95%",
                alignSelf: "flex-start",
            }}
        >
            {/* 四角の横に置く円 */}
            <div
                onClick={() => onIconClick && onIconClick(node.id)} // クリックイベント
                style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "#dfdfdf",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer", // クリック可能なカーソル
                    margin: "15px 10px 0 0", // 四角との間に余白
                    border: border,
                }}
            >
                <span
                    style={{
                        fontSize: "12px", // Optional: Adjust font size as needed
                        color: "black", // Optional: Adjust text color as needed
                        fontWeight: "bold",
                    }}
                >
                    {node.id}
                </span>
            </div>

            {/* 四角の部分 */}
            <div
                style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "10px",
                    border: border,
                    textAlign: "left",
                }}
            >
                {/* マークダウンのレンダリング */}
                <ReactMarkdown className="markdown-content">
                    {sanitizedMarkdown}
                </ReactMarkdown>
            </div>
        </div>
    );
};

const ChatNode = ({ node, headNodeId, onIconClick }) => {
    const mode = node.id === headNodeId ? "head" : "default";
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                margin: "5px 0",
            }}
        >
            {node.question && <UserMessage node={node} />}
            {node.answer && (
                <AssistantMessage
                    node={node}
                    mode={mode}
                    onIconClick={onIconClick}
                />
            )}
        </div>
    );
};

const ChatNodes = ({
    activeNodes,
    headNodeId,
    nodeIdToActivate,
    onScroll,
    onIconClick,
}) => {
    const containerRef = useRef(null);

    // nodeIdToActivate の変更時にスクロール
    useEffect(() => {
        if (nodeIdToActivate !== null && containerRef.current) {
            const targetNode = containerRef.current.querySelector(
                `[data-id="${nodeIdToActivate}"]`
            );
            if (targetNode) {
                targetNode.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
                // TODO; onScroll(targetnodeid); // 非同期に注意
            }
        }
    }, [nodeIdToActivate]);

    const handleScroll = () => {
        if (containerRef.current) {
            const children = Array.from(containerRef.current.children);

            // activeNodes の順序で最初に一致するノードを判定
            for (const node of activeNodes.values()) {
                const child = containerRef.current.querySelector(
                    `[data-id="${node.id}"]`
                );
                if (child) {
                    const rect = child.getBoundingClientRect();
                    if (rect.top >= -30) {
                        // 上辺がビューポート内にある条件 //なぜか0だとツリークリックと同期しないことあるため-30
                        console.log("Top-most visible child ID:", node.id);
                        onScroll(node.id); // 一番上のノードの ID を渡す
                        break;
                    }
                }
            }
        }
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{
                overflowY: "auto",
                flex: 1,
                height: "100%",
                maxHeight: "100%",
                padding: "10px",
                border: "0",
                backgroundColor: "#fff",
            }}
        >
            {Array.from(activeNodes.values()).map((node) => (
                <div key={node.id} data-id={node.id}>
                    <ChatNode
                        node={node}
                        headNodeId={headNodeId}
                        onIconClick={onIconClick}
                    />
                </div>
            ))}
        </div>
    );
};

const ChatInput = ({ onSubmit }) => {
    const [question, setQuestion] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim() !== "") {
            onSubmit(question);
            setQuestion("");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                margin: "0 10px 10px",
                padding: "0",
                border: "1px solid #ddd",
                borderRadius: "10px",
                alignItems: "center",
            }}
        >
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Send a message to AI"
                style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "transparent",
                    borderRadius: "10px",
                }}
            />
            <button
                type="submit"
                style={{
                    border: "2px solid #4855E5",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#4855E5",
                    cursor: "pointer", // クリック可能なカーソル
                    margin: "0px 10px", // 四角との間に余白
                }}
            ></button>
        </form>
    );
};

const Chat = ({
    activeNodes,
    headNodeId,
    nodeIdToActivate,
    onScroll,
    onSubmit,
    onIconClick,
}) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                backgroundColor: "#fff",
            }}
        >
            {/* ChatNodes scrollable area */}
            <ChatNodes
                activeNodes={activeNodes}
                headNodeId={headNodeId}
                nodeIdToActivate={nodeIdToActivate}
                onScroll={onScroll}
                onIconClick={onIconClick}
            />
            {/* ChatInput fixed at the bottom */}
            <ChatInput onSubmit={onSubmit} />
        </div>
    );
};

export default Chat;
