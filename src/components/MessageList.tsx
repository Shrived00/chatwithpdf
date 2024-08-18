import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";
import MarkdownIt from "markdown-it";

type Props = {
    messages: Message[];
};

const md = new MarkdownIt();

const MessageList = ({ messages }: Props) => {

    if (!messages) return <></>;

    return (
        <div className="flex flex-col gap-2 px-4 my-2">
            {messages.map((message) => {
                const htmlContent = md.render(message.content);

                return (
                    <div
                        key={message.id}
                        className={cn("flex", {
                            "justify-end pl-10": message.role === "user",
                            "justify-start pr-10": message.role === "assistant",
                        })}
                    >
                        <div
                            className={cn(
                                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                                {
                                    "bg-[#41B3A2] text-white": message.role === "user",
                                }
                            )}
                        >
                            <p
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MessageList;
