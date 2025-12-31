import { getGameCodeNamespace } from 'infra/game';
import { useCurrentGame } from 'infra/game/GameProvider';
import { useTranslation } from './useTranslation';

export const useCurrentGameTranslation = () => {
  const { game } = useCurrentGame();
  const namespace = game?.code && getGameCodeNamespace(game?.code);
  
  // Use the ready flag to ensure translations are loaded
  const { t, ready } = useTranslation(namespace || 'common', { 
    useSuspense: false 
  });

  return { translate: t, namespace, ready };
};
