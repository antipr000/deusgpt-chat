export type ChatSession = {
  agent: string; // Can be gpt, translate, search
  createdAt: Date;
  firebaseId: string;
  messages?: Array<any>;
  name?: string;
  sessionId: string;
};