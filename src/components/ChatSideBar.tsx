"use client"
import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { ChevronLeftIcon, ChevronRightIcon, MessageCircle, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'


type Props = {
    chats: DrizzleChat[],
    chatId: number,
}

const ChatSideBar = ({ chats, chatId }: Props) => {
    return (
        <div className='w-full h-full  p-4 text-gray-200 bg-[#0D7C66]'>




            <Link href='/' className="inline-block ">
                <div className="flex  gap-2 text-gray-900 bg-[#BDE8CA]  rounded-xl mb-3 pr-5 ">
                    <ChevronLeftIcon />Home
                </div>

            </Link>

            <Link href='/'>
                <Button className='w-full border-dashed border-white border '>
                    <PlusCircle className='mr-2 w-4 h-4' />
                    New Chat
                </Button>
            </Link>

            <div className="flex max-h-screen  pb-20 flex-col gap-2 mt-4">
                {chats.map(chat => (
                    <Link href={`/chat/${chat.id}`} key={chat.id}>

                        <div className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                            "bg-[#41B3A2] text-white": chat.id == chatId,
                            "hover:text-white": chat.id !== chatId
                        })
                        }
                        >
                            <MessageCircle className='mr-2' />
                            <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>{chat.pdfName}</p>

                        </div>

                    </Link>
                ))}
            </div>



        </div>
    )
}

export default ChatSideBar
