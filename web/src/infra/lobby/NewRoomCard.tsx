import css from './NewRoomCard.module.css';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import { useTranslation } from 'infra/i18n/hooks/useTranslation';

interface NewRoomCardProps {
  newRoomModal: () => void;
}

export const NewRoomCard = ({ newRoomModal }: NewRoomCardProps) => {
  const { t } = useTranslation('LobbyCarousel');
  return (
    <div className={css.CardWrapper} data-testid={`newRoom`} onClick={newRoomModal}>
      <div className={css.InnerWrapper}>
        <AddIcon fontSize="large" />
        <Typography component="div" variant="subtitle1">
          {t('new_room')}
        </Typography>
      </div>
    </div>
  );
};
