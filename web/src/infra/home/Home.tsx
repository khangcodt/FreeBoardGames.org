import FreeBoardGamesBar from 'infra/common/components/base/FreeBoardGamesBar';
import { GamesList } from 'infra/common/components/game/GamesList';
import SEO from 'infra/common/helpers/SEO';
import Header from 'infra/home/Header';
import { Link, withTranslation, WithTranslation } from 'infra/i18n';
import LobbyCarousel from 'infra/lobby/LobbyCarousel';
import { about } from 'infra/navigation';
import React from 'react';

interface HomeInternalInnerProps extends Pick<WithTranslation, 't'> {}

interface HomeInternalOutterProps {}

export class HomeInternal extends React.Component<HomeInternalInnerProps & HomeInternalOutterProps, {}> {
  render() {
    const { t } = this.props;

    return (
      <FreeBoardGamesBar FEATURE_FLAG_readyForDesktopView>
        <SEO title={t('title')} description={t('description')} />
        <Header />
        <GamesList />
        {this.maybeRenderGamesInDevelopment()}
        <LobbyCarousel />
        <p style={{ fontSize: '14px', textAlign: 'center' }}>
          <Link href={() => about()}>
            {t('about')}
          </Link>
        </p>
      </FreeBoardGamesBar>
    );
  }

  maybeRenderGamesInDevelopment() {
    const isProdChannel = process.env.NODE_ENV === 'production';
    if (isProdChannel) {
      return;
    }
    return <GamesList showDevOnly={true} />;
  }
}

export const Home = withTranslation('Home')(HomeInternal);
