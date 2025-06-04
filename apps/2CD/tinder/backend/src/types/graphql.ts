export interface SendMessageArgs {
  matchId: string;
  content: string;
}

export interface MarkAsReadArgs {
  messageId: string;
}

export interface GetMessagesArgs {
  matchId: string;
}
