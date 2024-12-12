"use client";

import React, { useState } from "react";

const Chat = ({ messages, onSubmit }) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSubmit(input);
            setInput("");
        }
    };

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded-lg">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-2 rounded-lg ${
                            msg.type === "user"
                                ? "bg-blue-100 text-right"
                                : "bg-gray-200"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex mt-4">
                <input
                    type="text"
                    className="flex-1 border rounded-lg p-2"
                    placeholder="質問を入力してください..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    送信
                </button>
            </form>
        </div>
    );
};

export default Chat;
