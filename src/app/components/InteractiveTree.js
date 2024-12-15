"use client";
import React from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

const DISPLAY_NUM_ON_NODE = true;

const InteractiveTree = ({ nodes, visibleNodeId, headNodeId, onNodeClick, onNodeClickWithCMD }) => {
    // unit size for spacing
    const unitX = 40;
    const unitY = 50;

    // Create node elements for ReactFlow
    const reactFlowNodes = Array.from(nodes.values()).map((node) => {
        // Determine style based on node id
        let style = {
            width: "30px",
            height: "30px",
            border: "3px solid #dfdfdf",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px", // Optional: Adjust font size as needed
            color: "black", // Optional: Adjust text color as needed
            fontWeight: "bold",
        };

        // Highlight visibleNodeId with a yellow background
        if (node.id === visibleNodeId) {
            style = {
                ...style,
                backgroundColor: "#dfdfdf",
            };
        }

        // Highlight headNodeId with a blue border
        if (node.id === headNodeId) {
            style = {
                ...style,
                border: "3px solid #4855E5",
            };
        }

        return {
            id: node.id.toString(),
            data: { label: DISPLAY_NUM_ON_NODE ? node.id : "" }, // Pass node ID as label
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

        if (event.metaKey) {
            console.log(`Node clicked with Shift: ${nodeId}`);
            if (onNodeClickWithCMD) {
                onNodeClickWithCMD(nodeId);
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
                onNodeClick={onNodeClickHandler}
                nodesDraggable={false}
                nodesConnectable={false}
                panOnDrag={false}
                fitView
                zoomOnScroll={false} // Disable zoom with scroll
                zoomOnPinch={false} // Disable zoom with pinch
                minZoom={1} // Prevent zooming out
                maxZoom={1} // Prevent zooming in
                selectNodesOnDrag={false}
            >
            </ReactFlow>
        </div>
    );
};

export default InteractiveTree;