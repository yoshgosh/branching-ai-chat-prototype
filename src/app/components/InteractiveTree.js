"use client";

import React from "react";

const InteractiveTree = ({ nodes, headNodeId, visibleNodeId, onNodeClick, onNodeDoubleClick }) => {
    const handleNodeClick = (nodeId) => {
        if (onNodeClick) {
            onNodeClick(nodeId); // 親コンポーネントに通知
        }
    };

    const handleNodeDoubleClick = (nodeId) => {
        if (onNodeDoubleClick) {
            onNodeDoubleClick(nodeId); // 親コンポーネントに通知
        }
    };

    return (
        <div className="interactive-tree">
            {Array.from(nodes.values()).map((node) => (
                <div
                    key={node.id}
                    className={`node-item ${
                        node.id === headNodeId ? "head-node" : ""
                    } ${node.id === visibleNodeId ? "visible-node" : ""}`}
                    onClick={() => handleNodeClick(node.id)}
                    onDoubleClick={() => handleNodeDoubleClick(node.id)}
                >
                    {node.label || `Node ${node.id}`}
                </div>
            ))}
        </div>
    );
};

export default InteractiveTree;