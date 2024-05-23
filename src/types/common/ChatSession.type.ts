export type ChatSession = {
  firebaseId: String;
  sessionId: String;
  name?: String;
  agent: String; // Can be gpt, translate, search
  messages?: Array<any>;
};
