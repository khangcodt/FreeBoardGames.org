import { Home } from 'infra/home/Home';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getAllGames, getGameCodeNamespace } from 'infra/game';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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
