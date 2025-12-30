import { LoadingMessage } from 'infra/common/components/alert/LoadingMessage';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { LobbyService } from 'infra/common/services/LobbyService';
import { getGameCodeNamespace } from 'infra/game';

const GameMatch = dynamic(() => import('infra/game/Match'), {
  ssr: false,
  loading: LoadingMessage,
});

const Match: NextPage = () => {
  return <GameMatch />;
};

Match.getInitialProps = async ({ query }) => {
  const matchId = query.matchId as string;
  
  // Fetch match data server-side to determine the game code
  let gameNamespace: string | undefined;
  try {
    // Use a no-op dispatch since we're just fetching data during SSR
    const noopDispatch = () => {};
    const matchData = await LobbyService.getMatch(noopDispatch as any, matchId);
    if (matchData?.match?.gameCode) {
      gameNamespace = getGameCodeNamespace(matchData.match.gameCode);
    }
  } catch (error) {
    // If we can't fetch the match, continue without the game namespace
    // The error will be handled by the Match component
    console.error('Failed to fetch match for i18n:', error);
  }

  const namespaces = [
    'Match',
    'Chat',
    'LoadingMessage',
    'MessagePage',
    'NicknameRequired',
    'NicknamePrompt',
    'Game',
    'ConnectionLost',
  ];

  // Add the game-specific namespace if we successfully fetched it
  if (gameNamespace) {
    namespaces.push(gameNamespace);
  }

  return {
    matchId,
    namespacesRequired: namespaces,
  };
};

export default Match;
