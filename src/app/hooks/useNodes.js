"use client";

import { useState, useEffect } from "react";
import { fetchNodes, postNode } from "../services/api";

export const useNodes = () => {
  const [nodes, setNodes] = useState([]);
  const [head, setHead] = useState(null);

  useEffect(() => {
    const loadNodes = async () => {
      const nodes = await fetchNodes();
      setNodes(nodes);
      if (nodes.length > 0) {
        setHead(nodes.at(-1)?.id);
      }
    };
    loadNodes();
  }, []);

  const addNode = async (question) => {
    const newNodes = await postNode(head, question);
    setNodes((prev) => ({ ...prev, ...newNodes }));
    setHead(newNodes[0]?.id); // 新ノードをHEADに設定
  };

  return { nodes, head, setHead, addNode };
};