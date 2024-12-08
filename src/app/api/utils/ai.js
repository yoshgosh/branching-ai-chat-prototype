import OpenAI from "openai";
const DEFAULT_MODEL = process.env.OPENAI_DEFAULT_MODEL || "gpt-4o-mini";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

export async function answerByAI(messages, model=DEFAULT_MODEL){
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: messages
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw new Error("Failed to fetch AI response");
    }
}