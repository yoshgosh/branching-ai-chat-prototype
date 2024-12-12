"use client";

import { useState, useEffect } from "react";
import { fetchNodes, postNode } from "../services/api";

export const useNodes = () => {
  const [nodes, setNodes] = useState({});
  const [head, setHead] = useState(null);

  useEffect(() => {
    const loadNodes = async () => {
      const nodes = await fetchNodes();
      setNodes(nodes);
      if (Object.keys(nodes).length > 0) {
        setHead(Object.values(nodes).at(-1)?.id);
      }
    };
    loadNodes();
  }, []);

  const addNode = async (question) => {
    const newNodes = await postNode(head, question);
    setNodes((prev) => ({ ...prev, ...newNodes }));
    setHead(Object.values(newNodes).at(0)?.id); // 新ノードをHEADに設定
  };

  return { nodes, head, setHead, addNode };
};