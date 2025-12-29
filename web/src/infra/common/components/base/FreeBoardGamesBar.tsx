import React, { useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'infra/i18n';
import { home } from 'infra/navigation';
import { nextI18Next } from 'infra/i18n/config';
import LanguageIcon from '@mui/icons-material/Language';

const FbgLogo = require('./media/fbg_logo_white_48.png');

type FBGBarProps = {
  FEATURE_FLAG_readyForDesktopView?: boolean;
  toolbarContent?: React.ReactNode;
  children?: React.ReactNode;
};

const handleLanguageChange = (event) => {
  window.location.href = `/${event.target.value}`;
};

function LanguageSelect() {
  const { i18n } = nextI18Next.useTranslation();
  return (
    <div style={{ marginLeft: 'auto' }}>
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        renderValue={() => <LanguageIcon />}
        sx={{
          color: 'white',
          '&:before, &:after': {
            display: 'none',
          },
          '& .MuiSelect-icon': {
            fill: 'white',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="pt">Português</MenuItem>
        <MenuItem value="de">Deutsch</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
        <MenuItem value="it">Italiano</MenuItem>
      </Select>
    </div>
  );
}

const FreeBoardGamesBar: React.FC<FBGBarProps> = (props) => {
  const maxWidth = props.FEATURE_FLAG_readyForDesktopView ? '1200px' : '500px';
  useEffect(() => {
    document.body.style.backgroundColor = 'white';
  }, []);
  return (
    <>
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <AppBar position="sticky">
          <Toolbar>
            <Link href={() => home()} style={{ textDecoration: 'none' }}>
              <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <img style={{ marginRight: '8px' }} width="48" height="48" src={FbgLogo} alt="FbG" />
                <Typography component="h1" variant="h6" style={{ color: 'white' }}>
                  FreeBoardGames.org
                </Typography>
              </span>
            </Link>
            {props.toolbarContent ?? <LanguageSelect />}
          </Toolbar>
        </AppBar>
      </div>
      <div
        style={{
          maxWidth,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        data-testid={'childrenDiv'}
      >
        {props.children}
      </div>
    </>
  );
};

export default FreeBoardGamesBar;
