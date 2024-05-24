import { ChatSession } from "@/types/common/ChatSession.type";
import { atom } from "jotai";

export const chatSessionsAtom = atom<ChatSession[]>([]);