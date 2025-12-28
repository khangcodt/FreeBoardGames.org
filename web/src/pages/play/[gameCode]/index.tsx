import GameInfo from 'infra/gameInfo/GameInfo';
import { getAllGames, getGameCodeNamespace } from 'infra/game';
import { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default GameInfo;

export const getStaticPaths: GetStaticPaths = () => {
  const games = getAllGames();
  const paths = games.flatMap((game) => [
    { params: { gameCode: game.code } },
    ...Object.values(game.codes || {}).map((code) => ({ params: { gameCode: code } })),
  ]);

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
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
