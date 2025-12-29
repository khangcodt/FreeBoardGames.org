import React, { HTMLAttributes, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import { InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'infra/i18n';

interface Props {
  onInputChange: (value: string) => void;
}

function SearchBox({ onInputChange, ...props }: Props & HTMLAttributes<HTMLDivElement>) {
  const [query, setQuery] = useState('');
  const { t } = useTranslation('SearchBox');

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onInputChange(e.target.value);
  };

  const clearSearchQuery = () => {
    const event: any = { target: { value: '' } };
    handleSearchOnChange(event);
  };

  let endAdornment: JSX.Element;

  if (query.length > 0) {
    endAdornment = (
      <Box
        sx={{
          padding: '0px',
          height: '100%',
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          right: '0%',
          bottom: '0%',
        }}
      >
        <InputAdornment position="end">
          <IconButton aria-label="clear search field" onClick={clearSearchQuery} data-testid={'clearSearchField'}>
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      </Box>
    );
  }

  return (
    <Box
      {...props}
      sx={{
        position: 'relative',
        borderRadius: (theme) => theme.shape.borderRadius,
        backgroundColor: 'common.white',
        margin: '0px',
        width: { xs: '100%', sm: 'auto' },
      }}
    >
      <Box
        sx={{
          padding: (theme) => theme.spacing(0, 2),
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SearchIcon data-testid={'SearchIcon'} />
      </Box>

      <OutlinedInput
        fullWidth
        placeholder={t('search')}
        autoComplete="off"
        value={query}
        data-testid={'searchInput'}
        sx={{
          color: 'common.black',
          '& .MuiOutlinedInput-input': {
            padding: '8.5px 14px',
            paddingLeft: 'calc(1em + 32px)',
            transition: (theme) => theme.transitions.create('width'),
            width: '100%',
            '@media (min-width: 900px)': {
              width: '20ch',
            },
          },
        }}
        onChange={handleSearchOnChange}
        inputProps={{ 'aria-label': 'search' }}
        endAdornment={endAdornment}
      />
    </Box>
  );
}

export default SearchBox;
