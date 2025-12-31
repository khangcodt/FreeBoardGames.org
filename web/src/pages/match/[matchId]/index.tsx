import { LoadingMessage } from 'infra/common/components/alert/LoadingMessage';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { getAllGames, getGameCodeNamespace } from 'infra/game';

const GameMatch = dynamic(() => import('infra/game/Match'), {
  ssr: false,
  loading: LoadingMessage,
});

const Match: NextPage = () => {
  return <GameMatch />;
};

Match.getInitialProps = async ({ query }) => {
  const matchId = query.matchId as string;
  
  // Get all game namespaces since we can't determine the game server-side
  const allGames = getAllGames();
  const gameNamespaces = allGames.map(game => getGameCodeNamespace(game.code));
  
  return {
    matchId,
    namespacesRequired: [
      'Match',
      'Chat',
      'LoadingMessage',
      'MessagePage',
      'NicknameRequired',
      'NicknamePrompt',
      'Game',
      'ConnectionLost',
      ...gameNamespaces,
    ],
  };
};

export default Match;
