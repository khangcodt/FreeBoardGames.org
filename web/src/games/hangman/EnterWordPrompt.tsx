import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import { withCurrentGameTranslation, WithCurrentGameTranslation } from 'infra/i18n';
import { compose } from 'recompose';
import { MAX_WORD_LENGTH } from './constants';
import { isValidWord } from './util';

interface IEnterWordPromptInnerProps extends WithCurrentGameTranslation {}
interface IEnterWordPromptProps {
  setSecret: (word: string, hint: string) => void;
  title: string;
}

interface IEnterWordPromptState {
  wordTextField: string;
  hintTextField: string;
}

export class EnterWordPromptInternal extends React.Component<
  IEnterWordPromptProps & IEnterWordPromptInnerProps,
  IEnterWordPromptState
> {
  wordInput: HTMLDivElement;
  state = {
    wordTextField: '',
    hintTextField: '',
  };

  render() {
    return (
      <div>
        <Card
          style={{
            marginTop: '16px',
            whiteSpace: 'nowrap',
            width: '250px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
          }}
        >
          <Typography style={{ paddingTop: '16px' }} variant="h6" component="h3" noWrap={true}>
            {this.props.title}
          </Typography>
          <CardContent>
            <div>
              <TextField
                autoFocus={true}
                inputRef={(input) => (this.wordInput = input)}
                type="text"
                label={this.props.translate('EnterWordPrompt.max_chars', { MAX_WORD_LENGTH })}
                fullWidth
                onChange={this._onWordChange}
                onKeyPress={this._setEnterWordOnEnterButton}
                style={{ margin: '8px', width: '90%' }}
                data-test-id="wordTextField"
                value={this.state.wordTextField}
              />
            </div>
            <div>
              <TextField
                type="text"
                label={this.props.translate('EnterWordPrompt.hint_max_chars', { MAX_CHARS: 120 })}
                fullWidth
                maxRows={4}
                onChange={this._onHintChange}
                onKeyPress={this._setEnterWordOnEnterButton}
                style={{ margin: '8px', width: '90%' }}
                data-test-id="hintTextField"
                value={this.state.hintTextField}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '16px' }}
              onClick={this._onClick}
              disabled={!this._wordisValid()}
              data-test-id="playButton"
            >
              {this.props.translate('EnterWordPrompt.play')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  _setEnterWordOnEnterButton = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && this._wordisValid()) {
      this._onClick();
    }
  };

  _wordisValid = () => {
    const name = this.state.wordTextField;
    const hint = this.state.hintTextField;
    return name && name.length > 0 && name.length <= MAX_WORD_LENGTH && hint.length <= 120 && isValidWord(name);
  };

  _onClick = () => {
    if (this._wordisValid()) {
      this.setState({
        wordTextField: '',
        hintTextField: '',
      });
      this.props.setSecret(this.state.wordTextField, this.state.hintTextField);
      this.wordInput.focus();
    }
  };

  _onWordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const wordTextField = event.target.value!;
    this.setState((oldState) => {
      return { ...oldState, wordTextField };
    });
  };

  _onHintChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hintTextField = event.target.value!;
    this.setState((oldState) => {
      return { ...oldState, hintTextField };
    });
  };
}

const enhance = compose<IEnterWordPromptInnerProps, IEnterWordPromptProps>(withCurrentGameTranslation);
export const EnterWordPrompt = enhance(EnterWordPromptInternal);
