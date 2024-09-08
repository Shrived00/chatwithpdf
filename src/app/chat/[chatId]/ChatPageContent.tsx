"use client";
import Link from "next/link";
import { CircleUser, FileText, Home, LineChart, Menu, MessageCircle, Package, Package2, ShoppingCart, Squirrel, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"


type Chat = {
    id: number;
    pdfUrl?: string;
    pdfName: string;
};

type ChatPageContentProps = {
    chatId: string;
    initialChatsData: Chat[];
};

export default function ChatPageContent({ chatId, initialChatsData }: ChatPageContentProps) {
    const [chats, setChats] = useState(initialChatsData);

    // Find the current chat based on chatId
    const currentChat = chats.find(chat => chat.id === parseInt(chatId));

    return (
        <div className="relative">
            <div className=" sticky top-0 left-0 max-h-screen w-full flex overflow-hidden ">


                <div className="hidden border-r bg-muted/40 md:block max-w-[400px] ">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link href="/" className="flex items-center gap-2 font-semibold h-[100px] ml-1">
                                <Squirrel className="h-6 w-6" />
                                <span> Chat with PDF </span>
                            </Link>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 overflow-y-auto h-full chat-container gap-2">
                                {chats.map((chat) => (
                                    <Link href={`/chat/${chat.id}`} key={chat.id}>
                                        <div
                                            className={cn("rounded-lg p-3 text-black flex items-center ", {
                                                "bg-[#41B3A2] text-white": chat.id === parseInt(chatId),
                                                "hover:text-black/80 hover:bg-[#41B3A2]/10": chat.id !== parseInt(chatId),
                                            })}
                                        >
                                            <FileText className="mr-2" />
                                            <div className="overflow-hidden w-full text-sm truncate whitespace-nowrap text-ellipsis max-w-[300px]">
                                                {chat.pdfName}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                </div>



                <div className="flex flex-col w-full">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 p-2 md:p-0">
                        <Sheet>
                            <SheetTrigger asChild className="">
                                <Button variant="outline" size="icon" className="shrink-0 md:hidden ">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col">
                                <nav className="grid gap-2 text-lg font-medium overflow-hidden overflow-y-auto chat-container">
                                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold ml-1">
                                        <Squirrel className="h-6 w-6" />
                                        <span> Chat with PDF </span>
                                    </Link>
                                    {chats.map(chat => (
                                        <Link href={`/chat/${chat.id}`} key={chat.id}>
                                            <div
                                                className={cn("rounded-lg p-3 text-black flex items-center", {
                                                    "bg-[#41B3A2] text-white": chat.id === parseInt(chatId),
                                                    "hover:text-black/80 hover:bg-[#41B3A2]/10": chat.id !== parseInt(chatId),
                                                })}
                                            >
                                                <FileText className="mr-2" />
                                                <div className="overflow-hidden w-full  text-sm truncate whitespace-nowrap text-ellipsis max-w-[250px]">
                                                    {chat.pdfName}
                                                </div>

                                            </div>
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <div className="flex-1 " />

                    </header>
                    <main className="flex flex-1 flex-col h-full " >
                        <div className="flex items-center justify-center h-full">



                            <ResizablePanelGroup direction="horizontal" className="flex w-full h-full min-h-screen">
                                <ResizablePanel className="">
                                    <div className="h-full ">
                                        <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
                                    </div>
                                </ResizablePanel>
                                <ResizableHandle withHandle />
                                <ResizablePanel>
                                    <div className="  h-full">
                                        <ChatComponent chatId={parseInt(chatId)} />
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
