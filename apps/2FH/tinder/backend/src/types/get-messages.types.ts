export interface GetMessagesArgs {
  senderId?: string;
  receiverId?: string;
}

export interface GetMessageArgs {
  id: string;
}

export interface MessageOutput {
  id: string;
  sender: {
    id: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  };
  receiver: {
    id: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  };
  content: string;
  createdAt: string;
}

export const ERRORS = {
  INVALID_ID: 'Invalid ID format',
  MESSAGE_NOT_FOUND: 'Message not found',
  FETCH_FAILED: 'Failed to fetch messages',
  INVALID_USER_ID: 'Invalid userId format',
}; 