import { Suspense } from 'react';
import ChatPageContent from './ChatPageContent';
import { getChatsData } from './chatUtils';
import { Slab } from 'react-loading-indicators';

type Props = {
    params: {
        chatId: string;
    };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
    // Server-side: Fetch data
    const chatsData = await getChatsData(chatId);

    return (
        // Wrap the ChatPageContent in Suspense for client-side lazy loading or rendering
        <div className="h-screen overflow-hidden ">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-screen">
                        <Slab color="#32cd32" size="medium" text="" textColor="" />
                    </div>
                }
            >
                {/* Pass server-side data to the component */}
                <ChatPageContent chatId={chatId} initialChatsData={chatsData} />
            </Suspense>
        </div>
    );
};

export default ChatPage;
