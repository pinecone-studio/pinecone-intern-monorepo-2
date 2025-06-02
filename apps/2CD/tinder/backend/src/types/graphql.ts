export interface SendMessageArgs {
  matchId: string;
  content: string;
  senderId: string;
}

export interface MarkAsReadArgs {
  messageId: string;
}

export interface GetMessagesArgs {
  matchId: string;
}
