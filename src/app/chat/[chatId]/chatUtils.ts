import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function getChatsData(chatId: string) {
    const { userId } = await auth();
    if (!userId) {
        redirect('/sign-in');
    }

    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

    if (!_chats) {
        redirect('/');
    }

    if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
        redirect('/');
    }

    console.log(_chats);
    return _chats;

}