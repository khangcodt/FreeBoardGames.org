import { LoadingMessage } from 'infra/common/components/alert/LoadingMessage';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { getAllGames, getGameCodeNamespace } from 'infra/game';

const DynamicRoom = dynamic(() => import('infra/room/Room'), {
  ssr: false,
  loading: LoadingMessage,
});

const Room: NextPage = () => {
  return <DynamicRoom />;
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // Get all game namespaces since rooms can be for any game
  const allGames = getAllGames();
  const gameNamespaces = allGames.map(game => getGameCodeNamespace(game.code));
  
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'Chat',
        'ChatInput',
        'CustomizationBar',
        'GameCard',
        'GameCardWithOverlay',
        'GameSharing',
        'ListPlayers',
        'LoadingMessage',
        'MessagePage',
        'NicknamePrompt',
        'NicknameRequired',
        'QrCodePopup',
        'Room',
        'SearchBox',
        'StartMatchButton',
        ...gameNamespaces,
      ])),
    },
  };
};

export default Room;
