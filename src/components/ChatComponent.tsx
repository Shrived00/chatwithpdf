import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

type CoreMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

export default function ChatComponent() {
    const [messages, setMessages] = useState<CoreMessage[]>([]);
    const [input, setInput] = useState<string>("");

    const sendMessage = async () => {
        if (!input.trim()) {
            console.error("Message is empty!");
            return;
        }

        const userMessage: CoreMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        const assistantMessage: CoreMessage = { role: "assistant", content: "" };
        setMessages((prev) => [...prev, assistantMessage]);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage], chatId: 1 }),
            });

            if (!response.body) {
                throw new Error("No response body!");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                // Debugging: Log raw chunks
                console.log("Raw chunk:", chunk);

                // Process and clean each chunk
                const lines = chunk.split("\n");
                lines.forEach((line) => {
                    const match = line.match(/^0:"(.*?)"/);
                    if (match) {
                        let extractedContent = match[1];

                        // Remove escape sequences (\" and \n)
                        extractedContent = extractedContent.replace(/\\n/g, " "); // Replace \n with a space
                        extractedContent = extractedContent.replace(/\\"/g, '"'); // Replace \" with "

                        // Accumulate cleaned content
                        fullContent += extractedContent;

                        // Update the assistant message dynamically
                        setMessages((prev) =>
                            prev.map((msg, idx) =>
                                idx === prev.length - 1 && msg.role === "assistant"
                                    ? { ...msg, content: fullContent }
                                    : msg
                            )
                        );
                    }
                });
            }

            console.log("Final AI response:", fullContent);
        } catch (error) {
            console.error("Error fetching the assistant's response:", error);
            setMessages((prev) =>
                prev.map((msg, idx) =>
                    idx === prev.length - 1 && msg.role === "assistant"
                        ? { ...msg, content: "Oops! Something went wrong. Please try again." }
                        : msg
                )
            );
        }
    };




    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto">
            <Card className="flex-grow overflow-auto mb-4">
                <CardContent className="p-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
                            <span
                                className={`inline-block px-3 py-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                <strong>{message.role === "user" ? "You" : "AI"}:</strong> {message.content}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <div className="sticky bottom-0 bg-background p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-grow"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                sendMessage()
                            }
                        }}
                    />
                    <Button onClick={sendMessage}>Send</Button>
                </div>
            </div>
        </div>
    );
}
