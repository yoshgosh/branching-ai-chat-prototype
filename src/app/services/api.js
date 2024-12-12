const BASE_URL = "/api";

export const fetchNodes = async () => {
  const response = await fetch(`${BASE_URL}/nodes`);
  const data = await response.json();
  return data.nodes;
};

export const postNode = async (head, question) => {
  const response = await fetch(`${BASE_URL}/node`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ head, question }),
  });
  const data = await response.json();
  return data.nodes;
};