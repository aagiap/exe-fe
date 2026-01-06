"use client"
import { useState, useEffect, useRef } from "react"
import "./ChatBox.css"
import { askAI } from "../../api/AI"
import ReactMarkdown from 'react-markdown'

export default function ChatBox() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [messages, setMessages] = useState([
        { id: 1, role: "ai", content: "Xin chào! Mình là **May É** 🌿. Bạn đang tìm đồ mây tre trang trí hay quà tặng ạ?" },
    ])
    const [input, setInput] = useState("")
    const [selectedImage, setSelectedImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const fileInputRef = useRef(null)
    const messagesEndRef = useRef(null)

    // Tự động cuộn xuống cuối khi có tin nhắn mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isExpanded, isLoading])

    // Xử lý chọn ảnh
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => setSelectedImage(event.target.result)
            reader.readAsDataURL(file)
        }
        // Reset input để chọn lại cùng 1 ảnh được
        e.target.value = null;
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim() && !selectedImage) return

        // 1. Tạo tin nhắn user và hiển thị ngay
        const userMsg = {
            id: Date.now(),
            role: "user",
            content: input,
            image: selectedImage
        }

        // Chỉ gửi phần text và role lên server (trừ tin nhắn hiện tại có ảnh)
        const historyForBackend = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        setMessages(prev => [...prev, userMsg])
        setInput("")
        setSelectedImage(null)
        setIsLoading(true)

        try {
            // 2. Gọi API
            const responseText = await askAI({
                question: userMsg.content,
                image: userMsg.image,
                chatHistory: historyForBackend
            })

            // 3. Hiển thị phản hồi AI
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: "ai",
                content: responseText
            }])
        } catch (err) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: "ai",
                content: "⚠️ _Có lỗi kết nối, bạn thử lại sau nhé!_"
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`chatbox-wrapper ${isExpanded ? 'is-open' : 'is-closed'}`}>
            {/* Nút Launcher */}
            <button className="chat-launcher" onClick={() => setIsExpanded(true)}>
                <span className="icon">💬</span>
            </button>

            {/* Container Chat */}
            <div className="chatbox-container">
                <div className="chatbox-header">
                    <div className="chatbox-title">MAY É BOT 🌿</div>
                    <div className="header-actions">
                        <button className="chatbox-action-btn" onClick={() => setMessages([])} title="Xóa lịch sử">🗑️</button>
                        <button className="chatbox-toggle-btn" onClick={() => setIsExpanded(false)} title="Thu gọn">✕</button>
                    </div>
                </div>

                <div className="chatbox-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message message-${msg.role}`}>
                            <div className="message-bubble">
                                {msg.role === 'ai' ? (
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                ) : (
                                    <span>{msg.content}</span>
                                )}
                                {msg.image && <img src={msg.image} alt="uploaded" className="message-image" />}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message message-ai">
                            <div className="message-bubble typing-indicator">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Form Input */}
                <form className="chatbox-input-form" onSubmit={handleSendMessage}>
                    {selectedImage && (
                        <div className="image-preview-container">
                            <img src={selectedImage} alt="Preview" className="image-preview" />
                            <button type="button" className="remove-image-btn" onClick={() => setSelectedImage(null)}>×</button>
                        </div>
                    )}

                    <div className="input-actions">
                        <button type="button" className="upload-btn" onClick={() => fileInputRef.current?.click()} title="Gửi ảnh">
                            📷
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileSelect}
                        />

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi..."
                            className="message-input"
                            disabled={isLoading}
                        />
                        <button type="submit" className="send-btn" disabled={isLoading || (!input && !selectedImage)}>
                            ➤
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}