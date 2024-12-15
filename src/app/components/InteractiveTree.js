"use client";
import React from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

const InteractiveTree = ({ nodes, visibleNodeId, headNodeId, onNodeClick, onNodeClickWithShift }) => {
    // unit size for spacing
    const unitX = 40;
    const unitY = 50;

    // Create node elements for ReactFlow
    const reactFlowNodes = Array.from(nodes.values()).map((node) => {
        // Determine style based on node id
        let style = {
            width: "30px",
            height: "30px",
            border: "2px solid #dadada",
            padding: "5px",
            borderRadius: "50%",
        };

        // Highlight visibleNodeId with a yellow background
        if (node.id === visibleNodeId) {
            style = {
                ...style,
                backgroundColor: "#dadada",
            };
        }

        // Highlight headNodeId with a blue border
        if (node.id === headNodeId) {
            style = {
                ...style,
                border: "2px solid #4855E5",
                fontWeight: "bold",
            };
        }

        return {
            id: node.id.toString(),
            data: { label: node.id },
            position: { x: node.lane * unitX, y: -1 * node.level * unitY },
            style,
        };
    });

    // Create edge elements for ReactFlow
    const reactFlowEdges = Array.from(nodes.values())
        .filter((node) => node.parentId !== null)
        .map((node) => ({
            id: `e${node.parentId}-${node.id}`,
            source: node.parentId.toString(),
            target: node.id.toString(),
            type: "simplebezier",
        }));

    // Node click handler
    const onNodeClickHandler = (event, node) => {
        const nodeId = parseInt(node.id, 10);

        if (event.shiftKey) {
            console.log(`Node clicked with Shift: ${nodeId}`);
            if (onNodeClickWithShift) {
                onNodeClickWithShift(nodeId);
            }
        } else {
            console.log(`Node clicked: ${nodeId}`);
            if (onNodeClick) {
                onNodeClick(nodeId);
            }
        }
    };

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <ReactFlow
                nodes={reactFlowNodes}
                edges={reactFlowEdges}
                onNodeClick={onNodeClickHandler} // シングルクリックとShift対応
                nodesDraggable={false}
                nodesConnectable={false}
                panOnDrag={false}
                fitView
            >
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default InteractiveTree;