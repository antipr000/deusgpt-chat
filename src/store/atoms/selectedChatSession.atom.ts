import { ChatSession } from "firebase/vertexai-preview";
import { atom } from "jotai";

export const selectedChatSessionAtom = atom<ChatSession | null>(null);
