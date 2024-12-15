"use client";

import React, { useState } from "react";

const Chat = ({ activeNodes, headNodeId, nodeIdToActivate, onScroll, onSubmit }) => {
    const [inputValue, setInputValue] = useState("");

    const handleScroll = (event) => {
        if (onScroll) {
            const visibleNodeId = event.target.dataset.nodeId; // スクロールイベントから可視ノードを取得
            onScroll(visibleNodeId);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue.trim() && onSubmit) {
            onSubmit(inputValue.trim());
            setInputValue("");
        }
    };

    return (
        <div className="chat">
            <div className="chat-messages" onScroll={handleScroll}>
                {Array.from(activeNodes.values()).map((node) => (
                    <div
                        key={node.id}
                        className={`chat-node ${
                            node.id === nodeIdToActivate ? "activated-node" : ""
                        }`}
                        data-node-id={node.id}
                        
                    >
                        <strong>{node.label || `Node ${node.id}`}</strong>
                        <p>{node.question || "No content available."}</p>
                    </div>
                ))}
            </div>
            <form className="chat-input" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your question..."
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Chat;