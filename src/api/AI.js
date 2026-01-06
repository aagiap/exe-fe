// Configuration for backend API
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

/**
 * Send question to AI backend and get response
 * @param {string} question - User's question
 * @param {string} image - Base64 encoded image (optional)
 * @param {Array} chatHistory - Previous chat messages (optional)
 * @returns {Promise<string>} - AI response text
 */
export async function askAI({ question, image, chatHistory = [] }) {
    try {
        console.log("Calling AI API with question:", question.substring(0, 50))

        const payload = {
            question,
            image: image || null,
            chatHistory: chatHistory || []
        }

        const response = await fetch(`${BACKEND_URL}/ai/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        console.log("API response status:", response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error("API error response:", errorText)
            throw new Error(`Server error: ${response.status}`)
        }

        const answer = await response.text()
        console.log("Received answer:", answer.substring(0, 100))

        return answer
    } catch (error) {
        console.error("API call failed:", error.message)
        throw new Error(`Không thể kết nối đến backend: ${error.message}`)
    }
}


