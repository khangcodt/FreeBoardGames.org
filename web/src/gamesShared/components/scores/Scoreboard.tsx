import grey from '@mui/material/colors/grey';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { IPlayerInRoom } from 'gamesShared/definitions/player';
import { useTranslation } from 'infra/i18n';
import React from 'react';

export interface IScore {
  playerID: string;
  score: number;
  extraData?: any[];
}

interface IScoreboardProps {
  scoreboard: IScore[];
  players: IPlayerInRoom[];
  playerID: string;
  scoreName?: string;
  extraColumns?: string[];
}

export function Scoreboard(props: IScoreboardProps) {
  const { t } = useTranslation('Scoreboard');

  return (
    <div className="scoreboard">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('rank')}</TableCell>
            <TableCell>{t('player')}</TableCell>
            {props.extraColumns && props.extraColumns.map((text) => <TableCell key={text}>{text}</TableCell>)}
            <TableCell>{props.scoreName || t('score')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.scoreboard.map((score, i) => {
            let style = {};
            if (score.playerID.toString() === props.playerID) {
              style = {
                background: grey[200],
              };
            }
            const name = props.players.find((player) => player.playerID.toString() === score.playerID).name;
            return (
              <TableRow key={score.playerID} style={style}>
                <TableCell>#{i + 1}</TableCell>
                <TableCell>{name}</TableCell>
                {score.extraData &&
                  score.extraData.map((val) => <TableCell key={props.extraColumns[i] + i}>{val}</TableCell>)}
                <TableCell>{score.score}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
