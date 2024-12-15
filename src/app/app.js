"use client";

import React, { useState, useEffect } from "react";
import InteractiveTree from "./components/InteractiveTree";
import Chat from "./components/Chat";
import { fetchNodes, postNode } from "./services/api";

const App = () => {
    // TODO: カスタムフックに引っ越ししたい
    const [nodes, setNodes] = useState(new Map());
    const [rootNodeId, setRootNodeId] = useState(null);
    const [latesetNodeId, setLatestNodeId] = useState(null);
    const [activeNodes, setActiveNodes] = useState(new Map());
    const [headNodeId, setHeadNodeId] = useState(null);
    const [nodeIdToActivate, setNodeIdToActivate] = useState(null);
    const [visibleNodeId, setVisibleNodeId] = useState([]);

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
        console.log("attachChildIds");
        console.log(nodes);
    };

    const assignGrid = (nodes) => {
        // FIXME: waitingMapをwaitingNodesに改名し、occupiedLanesを分離すると良いかも
        const nodeIds = Array.from(nodes.keys());
        let currentLevel = 0;
        let waitingMap = new Map(); // 値をSetで管理

        // 使用するレーンを取得する関数
        const getLane = (nodeId) => {
            const lanes = waitingMap.get(nodeId) ?? new Set();

            // 待ちリストに存在する場合
            if (lanes.size > 0) {
                // 待機中の最小のレーンを取得して削除
                const lane = Math.min(...lanes);
                waitingMap.delete(nodeId);
                return lane;
            }
            
            // 存在しない場合
            // 現在占有されている全レーンを取得
            const occupiedLanes = new Set(
                [...waitingMap.values()].flatMap((set) => [...set])
            );
            // 空いている最小レーンを取得
            let lane = 0;
            while (occupiedLanes.has(lane)) {
                lane++;
            }
            return lane;
        };

        const setWaitingMap = (node) => {
            if (node.parentId) {
                if (!waitingMap.has(node.parentId)) {
                    waitingMap.set(node.parentId, new Set());
                }
                waitingMap.get(node.parentId).add(node.lane);
            }
        };

        // 逆順（新しい順）でfor処理
        for (const nodeId of nodeIds.reverse()) {
            const currentNode = nodes.get(nodeId);

            // レベルを割り当てて更新
            currentNode.level = currentLevel;
            currentLevel++;

            // レーンを割り当て
            currentNode.lane = getLane(currentNode.id);

            // 待ちリストを更新
            setWaitingMap(currentNode);
        }
        console.log(nodes);
    };

    const getActiveNodes = (nodes, nodeId) => {
        // FIXME: 前の状態のactiveNodesを参照し、変化の少ないように計算すうようにしたい（見つけたらそれ以前/以降は前の状態を写すような感じでいいかな）
        const activeNodeIds = [nodeId]; // 中心ノードを初期化
        let currentId = nodeId;

        // 親ノードをたどる
        while (true) {
            const parentId = nodes.get(currentId)?.parentId;
            if (parentId == null) break; // nullまたはundefinedで終了
            activeNodeIds.unshift(parentId); // 親を先頭に追加
            currentId = parentId;
        }

        // 子ノードをたどる
        currentId = nodeId;
        while (true) {
            const childId = nodes.get(currentId)?.childId;
            if (childId == null) break; // nullまたはundefinedで終了
            activeNodeIds.push(childId); // 子を後に追加
            currentId = childId;
        }

        // 新しいMapを作成
        const newActiveNodes = new Map();
        for (const id of activeNodeIds) {
            newActiveNodes.set(id, nodes.get(id));
        }

        return newActiveNodes;
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
            console.log("initNodes",newNodes);
            setNodes(newNodes);
            const newRootNodeId = nodesArray.at(0).id || null;
            setRootNodeId(newRootNodeId);
            const newLatestNodeId = nodesArray.at(-1).id || null;
            setLatestNodeId(newLatestNodeId);
            if (newLatestNodeId !== null) {
                const newActiveNodes = getActiveNodes(
                    newNodes,
                    newLatestNodeId
                );
                setActiveNodes(newActiveNodes);
                setHeadNodeId(newLatestNodeId);
                setNodeIdToActivate(newLatestNodeId);
                setVisibleNodeId(newLatestNodeId);
            }
        };
        initNodes();
    }, []);

    const submitQestion = async (question) => {
        const nodesArray = await postNode(headNodeId, question);
        const newNode = nodesArray[0];
        console.log("submitQestion", newNode);
        const newNodes = new Map([...nodes,[newNode.id, newNode]]);
        attachChildId(newNodes, newNode);
        assignGrid(newNodes);
        setNodes(newNodes);
        const newLatestNodeId = newNode.id;
        const newActiveNodes = getActiveNodes(newNodes, newLatestNodeId);
        setActiveNodes(newActiveNodes);
        setLatestNodeId(newLatestNodeId);
        setHeadNodeId(newLatestNodeId);
        setNodeIdToActivate(newLatestNodeId);
        setVisibleNodeId(newLatestNodeId);
    };

    const activateNodes = (nodeId) => {
        if (!activeNodes.has(nodeId)) {
            const newActiveNodes = getActiveNodes(nodes, nodeId);
            setActiveNodes(newActiveNodes); // activeNode更新後にnodeIdToActivateを更新する
        }
        setNodeIdToActivate(nodeId);
        console.log(activeNodes);
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/3 bg-white border-r">
                <InteractiveTree
                    nodes={nodes}
                    headNodeId={headNodeId}
                    visibleNodeId={visibleNodeId}
                    onNodeClick={activateNodes}
                    onNodeClickWithShift={setHeadNodeId}
                />
            </div>
            <div className="w-2/3">
                <Chat
                    activeNodes={activeNodes}
                    headNodeId={headNodeId}
                    nodeIdToActivate={nodeIdToActivate}
                    onScroll={setVisibleNodeId}
                    onSubmit={submitQestion}
                    onIconClick={setHeadNodeId}
                />
            </div>
        </div>
    );
};

export default App;
