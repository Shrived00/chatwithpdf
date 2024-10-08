import * as React from "react"
import { Check, MessagesSquare, Plus, Send } from "lucide-react"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"

import { useChat } from "ai/react"
import { Input } from "./ui/input"
import { currentUser } from "@clerk/nextjs/server"


type Props = { chatId: number };


const ChatComponent = ({ chatId }: Props) => {

    const { input, handleInputChange, handleSubmit, messages } = useChat({
        api: "/api/chat",
        body: {
            chatId
        }
    });

    React.useEffect(() => {
        const messageContainer = document.getElementById("message-container");
        if (messageContainer) {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);



    return (
        <div className="w-full h-full">
            <Card className="h-full bg-white border-0 rounded-none ">
                <CardHeader className="flex flex-row items-center shadow-lg  mb-2 h-[60px] ">
                    <div className="flex items-center space-x-4">

                        <div className="flex  gap-3 items-center justify-center">
                            <MessagesSquare />
                            <p className="text-lg font-medium leading-none">Start Chatting</p>
                        </div>
                    </div>

                </CardHeader>
                <CardContent className=" h-full overflow-hidden overflow-y-auto chat-container">
                    <div className="space-y-4  ">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex w-fit flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                    message.role === "user"
                                        ? "ml-auto bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}

                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="sticky bottom-10 lg:bottom-0 bg-white  p-4 shadow-sm">
                    <form
                        onSubmit={handleSubmit}
                        className="flex w-full items-center space-x-2"
                    >
                        <Input
                            id="message"
                            placeholder="Type your message..."
                            className="bg-gray-100 ring-0 focus:ring-0"
                            autoComplete="off"
                            value={input}
                            onChange={handleInputChange}
                        />

                        <Button type="submit" size="icon">
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>

        </div >
    )
}

export default ChatComponent
