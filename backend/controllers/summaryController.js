import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

// POST /api/summary
export const getBookSummary = async (req, res) => {
    try {
        const { title, author } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Book title is required' });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(503).json({ message: 'AI Service unavailable (Missing API Key)' });
        }

        const model = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: "gpt-3.5-turbo", // Cost-effective for demos
            temperature: 0.7,
        });

        const prompt = PromptTemplate.fromTemplate(
            "Summarize the book '{title}' by {author} in 3-4 distinct bullet points. Keep it concise, engaging, and under 100 words total."
        );

        const chain = prompt.pipe(model);

        const response = await chain.invoke({
            title,
            author: author || "Unknown Author"
        });

        // Extract the content from the response
        const summary = response.content;

        res.json({ summary });

    } catch (error) {
        console.error('AI Summary Error:', error);
        res.status(500).json({ message: 'Failed to generate summary' });
    }
};
