'use client';

type Props = {
  userId: string | null;
  resp: any;
  clickedMessages: any;
  time: string;
};

export const Chatcontent = ({ userId, resp, clickedMessages, time }: Props) => {
  return (
    <>
      <p className={`${userId === resp.senderId ? 'text-white text-lg' : 'text-foreground text-lg'}`}>{resp.content}</p>
      <p className={`${userId === resp.senderId ? 'text-white text-xs' : 'text-[#71717A] text-xs'} ${clickedMessages.includes(resp._id) ? 'block' : 'hidden'}`}>Sent: {time}</p>
    </>
  );
};
