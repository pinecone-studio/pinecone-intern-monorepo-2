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
  INVALID_USER_ID: 'Invalid user ID format',
  USER_NOT_FOUND: 'User not found',
  FETCH_FAILED: 'Failed to fetch messages',
  INVALID_SENDER_ID: 'Invalid sender ID',
  INVALID_RECEIVER_ID: 'Invalid receiver ID',
  MESSAGE_NOT_FOUND: 'Message not found',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_ERROR: 'Validation error'
} as const;

export type ErrorType = typeof ERRORS[keyof typeof ERRORS]; 