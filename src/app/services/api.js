const BASE_URL = "/api";

export const fetchNodes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/nodes`);
        if (!response.ok) throw new Error("Failed to fetch nodes.");
        const data = await response.json();
        return data.nodes;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const postNode = async (head, question) => {
    try {
        const response = await fetch(`${BASE_URL}/node`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ head, question }),
        });
        if (!response.ok) throw new Error("Failed to post node.");
        const data = await response.json();
        return data.nodes;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};