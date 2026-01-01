import { Home } from 'infra/home/Home';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getAllGames, getGameCodeNamespace } from 'infra/game';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const namespaces = [
    'Home',
    'Header',
    'LobbyCarousel',
    'GamesList',
    'GameCard',
    'SearchBox',
    ...getAllGames().map((g) => getGameCodeNamespace(g.code)),
  ];

  return {
    props: {
      ...(await serverSideTranslations(locale!, namespaces)),
    },
  };
}

export default Home;
