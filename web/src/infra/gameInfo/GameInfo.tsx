import { Typography, Alert } from '@mui/material';
import { makeTranslationStatusComparator } from 'gamesShared/helpers/translationStatus';
import FreeBoardGamesBar from 'infra/common/components/base/FreeBoardGamesBar';
import { GameCard } from 'infra/common/components/game/GameCard';
import { DesktopView, MobileView } from 'infra/common/device/DesktopMobileView';
import Breadcrumbs from 'infra/common/helpers/Breadcrumbs';
import SEO from 'infra/common/helpers/SEO';
import { getGameDefinition, getAllGames } from 'infra/game';
import { getGameCodeNamespace } from 'infra/game/utils';
import { GameInstructionsText } from 'infra/gameInfo/GameInstructionsText';
import { GameInstructionsVideo } from 'infra/gameInfo/GameInstructionsVideo';
import { GameModePicker } from 'infra/gameInfo/GameModePicker';
import {
  Trans,
  WithCurrentGameTranslation,
  withCurrentGameTranslation,
  withTranslation,
  WithTranslation,
} from 'infra/i18n';
import { play } from 'infra/navigation';
import { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { compose } from 'recompose';
import { GameContributors } from './GameContributors';
const LobbyCarousel = dynamic(() => import('infra/lobby/LobbyCarousel'), { ssr: false });
import css from './GameInfo.module.css';

interface GameInfoInnerProps extends Pick<WithTranslation, 't' | 'i18n'>, WithCurrentGameTranslation {}

interface GameInfoOuterProps {
  gameCode: string;
  asPath: string;
  userAgent?: string;
}

class GameInfo extends React.Component<GameInfoInnerProps & GameInfoOuterProps, {}> {
  render() {
    const { gameCode, t, translate, i18n } = this.props;
    const gameDef = getGameDefinition(gameCode);
    if (!gameDef) {
      return null;
    }
    const { name, instructions, description, descriptionTag } = gameDef;

    const videoInstructions = translate('instructions.videoId', instructions.videoId);
    const gameVideoInstructions = instructions.videoId ? <GameInstructionsVideo videoId={videoInstructions} /> : null;

    const textInstructions = translate('instructions.text', instructions.text);
    const gameTextInstructions = instructions.text ? <GameInstructionsText text={textInstructions} /> : null;

    const isFullyTranslated = makeTranslationStatusComparator(i18n.language);

    return (
      <FreeBoardGamesBar FEATURE_FLAG_readyForDesktopView>
        <SEO
          title={`${t('play', name, { name: translate('name', name) })}, ${translate('description', description)}`}
          description={translate('descriptionTag', descriptionTag)}
        />
        <Breadcrumbs
          itemListElements={[
            {
              position: 1,
              name: t('breadcrumb'),
              item: play()(i18n.language),
            },
            {
              position: 2,
              name: translate('name', name),
              item: this.props.asPath,
            },
          ]}
        />
        <DesktopView>
          <div className={css.RootWrapper} data-testid={'TabletViewDiv'}>
            <div className={css.LeftCol}>
              <Typography variant="h4" component="h1">
                {t('play', name, { name: translate('name', name) })}
              </Typography>
              <GameContributors game={gameDef} />
              <GameModePicker gameDef={gameDef} />
              <LobbyCarousel game={gameDef} />
            </div>
            <div className={css.RightCol}>
              <GameCard game={gameDef} />
              <div style={{ marginTop: '16px' }}>
                <div className={css.InstructionsWrapper}>
                  <Typography variant="body1" component="p">
                    <ReactMarkdown linkTarget="_blank" source={textInstructions} />
                  </Typography>
                </div>
              </div>
              <div style={{ marginTop: '32px' }}>{gameVideoInstructions}</div>
            </div>
          </div>
        </DesktopView>
        <MobileView>
          <GameCard game={gameDef} />
          <div style={{ padding: '8px' }} data-testid={'MobileViewDiv'}>
            <Typography variant="h5" component="h1">
              {t('play', name, { name: translate('name', name) })}
            </Typography>
            <GameContributors game={gameDef} />
            <GameModePicker gameDef={gameDef} />
            <LobbyCarousel game={gameDef} />
            {gameVideoInstructions}
            {gameTextInstructions}
          </div>
        </MobileView>
      </FreeBoardGamesBar>
    );
  }


}

const enhance = compose(withTranslation('GameInfo'), withCurrentGameTranslation);

export default enhance(GameInfo);
