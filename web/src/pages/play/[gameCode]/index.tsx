import GameInfo from 'infra/gameInfo/GameInfo';
import { getGameCodeNamespace } from 'infra/game';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default GameInfo;

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const gameCode = params?.gameCode as string;
  const gameNamespace = getGameCodeNamespace(gameCode);

  const namespaces = [
    'GameInfo',
    'GameContributors',
    'GameModePicker',
    'GameModePickerCard',
    'LobbyCarousel',
    'NewRoomModal',
    'GameCardWithOverlay',
    'OccupancySelect',
    'NicknameRequired',
    'NicknamePrompt',
    'About', // Used by GameInstructionsVideo
    gameNamespace,
  ];

  return {
    props: {
      gameCode,
      ...(await serverSideTranslations(locale!, namespaces)),
    },
  };
};
