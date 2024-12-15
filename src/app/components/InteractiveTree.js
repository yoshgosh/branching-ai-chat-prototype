"use client";

import React, { useMemo } from "react";
import ReactFlow, {
    Background,
    Controls,
} from "react-flow-renderer";

const InteractiveTree = ({ nodes, headNodeId, visibleNodeId, onNodeClick, onNodeDoubleClick }) => {
    const unit = 50;

    // ノードタイプ（デフォルトの円形ノード）
    const nodeTypes = useMemo(() => ({
        circleNode: ({ data }) => (
            <div
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#6c5ce7",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #2d3436",
                }}
            >
                {data.label}
            </div>
        ),
    }), []);

    // エッジタイプ（デフォルトの線）
    const edgeTypes = useMemo(() => ({
        thickEdge: {
            style: {
                stroke: "#2d3436",
                strokeWidth: 3,
            },
        },
    }), []);

    const flowNodes = [];
    const flowEdges = [];

    for (const [nodeId, node] of nodes.entries()) {
        flowNodes.push({
            id: nodeId,
            type: "circleNode",
            data: { label: nodeId },
            position: { x: node.lane * unit, y: node.level * unit },
        });

        if (node.parentId != null) {
            flowEdges.push({
                id: `${nodeId}-${node.parentId}`,
                source: node.parentId,
                target: nodeId,
                type: "thickEdge",
            });
        }
    }

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeClick={(_, node) => onNodeClick && onNodeClick(node)}
                onNodeDoubleClick={(_, node) => onNodeDoubleClick && onNodeDoubleClick(node)}
                fitView
            >
                {/* 背景とコントロールを追加 */}
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default InteractiveTree;