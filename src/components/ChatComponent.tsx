"use client"
import React from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import MessageList from './MessageList';

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
        <div className='relative  bg-[#BDE8CA] ' id='message-container'>
            <div className="sticky top-0 inset-x-0 bg-[#BDE8CA] p-2 h-fit shadow-md" >
                <h3 className='text-xl font-bold'>Chat</h3>
            </div>


            {/* //mesage  */}

            <MessageList messages={messages} />

            <form onSubmit={handleSubmit} className='sticky flex bottom-0 inset-x-0 p-2 py-4  bg-[#BDE8CA]'>
                <Input value={input} onChange={handleInputChange} placeholder='Ask any Question ?' className='w-full' />
                <Button className='bg-[#41B3A2] ml-2'>
                    <Send className='h-4 w-4' />
                </Button>
            </form>

        </div>
    )
}

export default ChatComponent
