"use client";

import React from "react";
import InteractiveTree from "./components/IntractiveTree.js";
import Chat from "./components/Chat";
import { useNodes } from "./hooks/useNodes";

const App = () => {
  const { nodes, head, setHead, addNode } = useNodes();

  const handleNodeClick = (nodeId) => {
    setHead(nodeId);
  };

  const handleQuestionSubmit = (question) => {
    addNode(question);
  };

  const getMessages = () => {
    const messages = [];
    let current = head;
    while (current) {
      const node = nodes[current];
      if (!node) break;
      messages.unshift({ type: "ai", text: node.answer });
      messages.unshift({ type: "user", text: node.question });
      current = node.parent_id;
    }
    return messages;
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-white border-r">
        <InteractiveTree nodes={nodes} onNodeClick={handleNodeClick} />
      </div>
      <div className="w-2/3">
        <Chat messages={getMessages()} onSubmit={handleQuestionSubmit} />
      </div>
    </div>
  );
};

export default App;