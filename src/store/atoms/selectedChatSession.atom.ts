
import { ChatSession } from "@/types/common/ChatSession.type";
import { atom } from "jotai";

export const selectedChatSessionAtom = atom<ChatSession | null>(null);
