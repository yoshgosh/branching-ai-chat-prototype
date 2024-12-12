// "use client";

// import React from "react";

// const InteractiveTree = ({ nodes, onNodeClick }) => {
//     // ノードをツリー構造に変換
//     console.log(nodes);
//     const renderTree = (nodes, parentId = null) => {
//         console.log("InteractiveTree rendered");
//         return Object.entries(nodes)
//             .filter(([id, node]) => node.parent_id === parentId)
//             .map(([id, node]) => (
//                 <div key={node.id} className="ml-4 border-l pl-2">
//                     <div
//                         className="cursor-pointer hover:bg-gray-200 p-1"
//                         onClick={() => onNodeClick(node.id)}
//                     >
//                         {node.question}
//                     </div>
//                     {renderTree(nodes, parseInt(node.id))}
//                 </div>
//             ));
//     };

//     return <div className="p-4">{renderTree(nodes)}</div>;
// };

// export default InteractiveTree;

"use client";
import React, { useEffect, useState } from "react";
import ReactFlow, { Background } from "react-flow-renderer";
import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Dagreを使ったノードの配置
const getLayoutedElements = (nodes, edges, direction = "TB") => {
    dagreGraph.setGraph({ rankdir: direction });

    // ノードをDagreに登録
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 50, height: 50 });
    });

    // エッジをDagreに登録
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // レイアウト計算
    dagre.layout(dagreGraph);

    // 計算後の位置を反映
    nodes.forEach((node) => {
        const dagreNode = dagreGraph.node(node.id);
        node.position = {
            x: dagreNode.x - 25,
            y: dagreNode.y - 25,
        };
    });

    return { nodes, edges };
};

const InteractiveTree = ({ nodes, onNodeClick }) => {
    const [layoutedNodes, setLayoutedNodes] = useState([]);
    const [layoutedEdges, setLayoutedEdges] = useState([]);
    const [hoveredNode, setHoveredNode] = useState(null); // ホバー中のノードを管理

    useEffect(() => {
        // ノードをID降順でソート
        const sortedNodes = Object.values(nodes)
            .sort((a, b) => b.id - a.id)
            .map((node) => ({
                id: node.id.toString(),
                data: { label: node.id.toString(), question: node.question },
                position: { x: 0, y: 0 },
                style: {
                    background: "#FFFFFF", // 背景色
                    border: "3px solid #667CFA", // 赤い枠線
                    borderRadius: "50%", // 円形
                    width: 50,
                    height: 50,
                },
                connectable: false,
            }));

        // エッジ情報を作成
        const edges = Object.values(nodes)
            .filter((node) => node.parent_id !== null)
            .map((node) => ({
                id: `e${node.parent_id}-${node.id}`,
                source: node.parent_id.toString(),
                target: node.id.toString(),
                style: { stroke: "#667CFA", strokeWidth: 3 },
            }));

        // Dagreでレイアウト
        const layoutedElements = getLayoutedElements(sortedNodes, edges, "TB");
        setLayoutedNodes(layoutedElements.nodes);
        setLayoutedEdges(layoutedElements.edges);
    }, [nodes]);

    const handleMouseEnter = (event, node) => {
        setHoveredNode(node); // ホバーしたノードをセット
    };

    const handleMouseLeave = () => {
        setHoveredNode(null); // ホバー解除でリセット
    };

    return (
        <div style={{ height: "800px", width: "100%", position: "relative" }}>
            {/* ポップアップ */}
            {hoveredNode && (
                <div
                    style={{
                        position: "absolute",
                        left: `${hoveredNode.position.x}px`,
                        top: `${hoveredNode.position.y}px`,
                        background: "#FFFFFF",
                        border: "0px solid #000",
                        padding: "5px",
                        borderRadius: "5px",
                        zIndex: 10,
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                        width: "300px",
                    }}
                >
                    {hoveredNode.data.question}
                </div>
            )}
            <ReactFlow
                nodes={layoutedNodes}
                edges={layoutedEdges}
                fitView
                onNodeClick={(event, node) => onNodeClick(node.id)} // クリック時のイベント
                onNodeMouseEnter={handleMouseEnter} // ホバー時のイベント
                onNodeMouseLeave={handleMouseLeave} // ホバー解除のイベント
            >
                <Background />
            </ReactFlow>
        </div>
    );
};

export default InteractiveTree;