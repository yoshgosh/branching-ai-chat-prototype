"use client";

import React, { useState, useEffect} from "react";
import InteractiveTree from "./components/InteractiveTree";
import Chat from "./components/Chat";
import { fetchNodes, postNode } from "./services/api";
// import { useNodes } from "./hooks/useNodes";

const App = () => {
    // FIXME: カスタムフックに引っ越し
    // const { nodes, headNodeId, setHeadNodeId, addNode } = useNodes();
    const [nodes, setNodes] = useState(new Map());
    const [rootNodeId, setRootNodeId] = useState(null);
    const [latesetNodeId, setLatestNodeId] = useState(null);
    const [activeNodes, setActiveNodes] = useState(new Map());
    const [headNodeId, setHeadNodeId] = useState(null);
    const [nodeIdToActivate, setNodeIdToActivate] = useState(null);
    const [visibleNodeId, setVisibleNodeId] = useState(null);

    const attachChildId = (nodes, childNode) => {
        const parentId = childNode.parentId;
        if (!parentId) return;
        const parentNode = nodes.get(parentId);
        if (!parentNode) return;
        parentNode.childId = childNode.id; 
    };
    
    const attachChildIds = (nodes) => {
        for (const node of nodes.values()) {
            attachChildId(nodes, node);
        }
    };

    const assignGrid = (nodes) => {
        // FIXME: waitingMapをwaitingNodesに改名し、occupiedLanesをパブリックに分離
        const nodeIds = Array.from(nodes.keys());
        let currentLevel = 0;
        let waitingMap = new Map(); // 値をSetで管理
    
        // 使用可能なレーンを取得する関数
        const getLane = (nodeId) => {
            const lanes = waitingMap.get(nodeId) ?? new Set();
            if (lanes.size > 0) {
                // 使用可能な最小のレーンを取得して削除
                const lane = Math.min(...lanes);
                waitingMap.get(nodeId).delete(lane);
                return lane;
            }
    
            // 現在占有されている全レーンを取得
            const occupiedLanes = new Set(
                [...waitingMap.values()].flatMap((set) => [...set])
            );
            let lane = 0;
            while (occupiedLanes.has(lane)) {
                lane++;
            }
            return lane;
        };

        const setWaitingNodes = (node) => {
            if (node.parentId){
                if (!waitingMap.has(node.parentId)) {
                    waitingMap.set(node.parentId, new Set());
                }
                waitingMap.get(node.parentId).add(node.lane);
            }
        }

        for (const nodeId of nodeIds) {
            const currentNode = nodes.get(nodeId);
    
            // レベルを割り当て
            currentNode.level = currentLevel;
            currentLevel++;
    
            // レーンを割り当て
            currentNode.lane = getLane(currentNode.id);
    
            // 待ちリストを更新
            setWaitingNodes(currentNode);
        }
    };

    // nodes初期化
    useEffect(() => {
        const initNodes = async () => {
            const nodesArray = await fetchNodes();
            // mapに変換
            const newNodes = new Map(nodesArray.map((node) => [node.id, node]));
            // childIdを付加
            attachChildIds(newNodes);
            assignGrid(newNodes);
            setNodes(newNodes);
            const newRootNodeId = nodesArray.at(-1).id || null;
            setRootNodeId(newRootNodeId)
            const newLatestNodeId = nodesArray[0].id || null;
            setLatestNodeId(newLatestNodeId)
            if (newLatestNodeId !== null) {
                const newActiveNodes = getActiveNodes(newNodes, newLatestNodeId);
                setActiveNodes(newActiveNodes);
                setHeadNodeId(newRootNodeId);
                setNodeIdToActivate(newRootNodeId);
                setVisibleNodeId(newRootNodeId);
            }
        };
        initNodes();
    }, []);

    const submitQestion = async (question) => {
        const newNode = await postNode(headNodeId, question)[0];
        const newNodes = new Map([[newNode.id, newNode], ...nodes]);
        attachChildId(newNodes, newNode);
        assignGrid(newNodes);
        setNodes(newNodes);
        const newLatestNodeId = newNode.id;
        const newActiveNodes = getActiveNodes(newNodes, newLatestNodeId);
        setActiveNodes(newActiveNodes);
        setLatestNodeId(newLatestNodeId)
        setHeadNodeId(newLatestNodeId); 
        setNodeIdToActivate(newLatestNodeId); 
        setVisibleNodeId(newLatestNodeId); 
    };

    const getActiveNodes = (nodes, nodeId) => {
        const activeNodeIds = [nodeId]; // 中心ノードを初期化
        let currentId = nodeId;
    
        // 親ノードをたどる
        while (true) {
            const parentId = nodes.get(currentId)?.parentId;
            if (parentId == null) break; // nullまたはundefinedで終了
            activeNodeIds.push(parentId); // 親を後に追加
            currentId = parentId;
        }
    
        // 子ノードをたどる
        currentId = nodeId;
        while (true) {
            const childId = nodes.get(currentId)?.childId;
            if (childId == null) break; // nullまたはundefinedで終了
            activeNodeIds.unshift(childId); // 子を先頭に追加
            currentId = childId;
        }
    
        // 新しいMapを作成
        const newActiveNodes = new Map();
        for (const id of activeNodeIds) {
            newActiveNodes.set(id, nodes.get(id));
        }
    
        return newActiveNodes;
    };
    
    const activateNodes = async (nodeId) => {
        if (!activeNodes.has(nodeId)) {
            const newActiveNodes = getActiveNodes(nodes, nodeId);
            await setActiveNodes(newActiveNodes); // activeNode更新後にnodeIdToActivateを更新する
        }
        setNodeIdToActivate(nodeId);
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/3 bg-white border-r">
                <InteractiveTree
                    nodes={nodes}
                    headNodeId={headNodeId}
                    visibleNodeId={visibleNodeId}
                    onNodeClick={activateNodes}
                    onNodeDoubleClick={setHeadNodeId}
                />
            </div>
            <div className="w-2/3">
                <Chat
                    activeNodes={activeNodes}
                    headNodeId={headNodeId}
                    nodeIdToActivate={nodeIdToActivate}
                    onScroll={setVisibleNodeId}
                    onSubmit={submitQestion}
                />
            </div>
        </div>
    );
};

export default App;
