"use client";

import React from "react";

const InteractiveTree = ({ nodes, onNodeClick }) => {
    // ノードをツリー構造に変換
    console.log(nodes);
    const renderTree = (nodes, parentId = null) => {
        console.log("InteractiveTree rendered");
        return Object.entries(nodes)
            .filter(([id, node]) => node.parent_id === parentId)
            .map(([id, node]) => (
                <div key={node.id} className="ml-4 border-l pl-2">
                    <div
                        className="cursor-pointer hover:bg-gray-200 p-1"
                        onClick={() => onNodeClick(node.id)}
                    >
                        {node.question}
                    </div>
                    {renderTree(nodes, parseInt(node.id))}
                </div>
            ));
    };

    return <div className="p-4">{renderTree(nodes)}</div>;
};

export default InteractiveTree;
