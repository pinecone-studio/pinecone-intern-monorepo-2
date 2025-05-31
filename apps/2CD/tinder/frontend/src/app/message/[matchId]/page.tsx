

import Chat from '../_components/Chat';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    matchId: string;
  };
};

const Page = ({ params }: Props) => {
  const { matchId } = params;

  if (!matchId) return notFound(); 

  return <Chat matchId={matchId} />;
};

export default Page;
