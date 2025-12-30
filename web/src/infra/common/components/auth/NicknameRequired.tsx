import React, { ReactNode } from 'react';
import { NicknamePrompt } from './NicknamePrompt';
import { LobbyService } from '../../services/LobbyService';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import FreeBoardGamesBar from 'infra/common/components/base/FreeBoardGamesBar';
import { ReduxState, ReduxUserState } from 'infra/common/redux/definitions';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'infra/i18n';
import { gql } from '@apollo/client';

interface InnerProps extends WithTranslation {
  dispatch: Dispatch;
  user: ReduxUserState;
}

interface OutterProps {
  onSuccess?: (...args: any) => void;
  handleClickaway?: () => void;
  children: ReactNode;
  renderAsPopup?: boolean;
  skipFbgBar?: boolean;
}

interface State {
  errorText: string;
}

export class NicknameRequired extends React.Component<InnerProps & OutterProps, State> {
  state = { errorText: undefined };

  async componentDidMount() {
    // Check if user has tokens in localStorage
    const hasTokens = LobbyService.getUserToken() && LobbyService.getNickname();
    
    if (hasTokens) {
      // Validate the token by making a test query
      try {
        await this._validateToken();
        // Token is valid, sync user state
        this.props.dispatch(LobbyService.getSyncUserAction());
      } catch (error) {
        // Token is invalid, clear it and show nickname prompt
        console.log('Invalid authentication token detected. Clearing localStorage.');
        LobbyService.invalidateUserAuth();
        this.props.dispatch(LobbyService.getSyncUserAction());
      }
    } else {
      // No tokens, just sync the state
      this.props.dispatch(LobbyService.getSyncUserAction());
    }
  }

  async _validateToken() {
    // Make a lightweight GraphQL query to validate the token
    const client = LobbyService.getClient();
    await client.query({
      query: gql`
        query ValidateToken {
          lobby {
            rooms {
              id
            }
          }
        }
      `,
      fetchPolicy: 'network-only', // Don't use cache, always hit the server
    });
  }

  render() {
    const nickname: string = this.props.user.nickname;
    if (nickname) {
      return this.props.children;
    }
    const prompt = (
      <NicknamePrompt
        nickname={nickname}
        setNickname={this._setNickname}
        errorText={this.state.errorText}
        onChange={() => this.setState({ errorText: undefined })}
      />
    );
    if (this.props.renderAsPopup) {
      return (
        <React.Fragment>
          {prompt}
          {this.props.children}
        </React.Fragment>
      );
    } else if (this.props.skipFbgBar) {
      return prompt;
    } else {
      return <FreeBoardGamesBar>{prompt}</FreeBoardGamesBar>;
    }
  }

  _setNickname = async (nickname: string) => {
    try {
      await LobbyService.newUser(nickname);
      this.props.dispatch(LobbyService.getSyncUserAction());
    } catch (e) {
      const errorText = e.response?.body?.message || this.props.t('unknown_error');
      this.setState({ errorText });
    }
    if (this.props.onSuccess) this.props.onSuccess();
  };
}

/* istanbul ignore next */
const mapStateToProps = function (state: ReduxState) {
  return {
    user: { ...state.user },
  };
};

const enhance = compose<InnerProps, OutterProps>(connect(mapStateToProps), withTranslation('NicknameRequired'));

export default enhance(NicknameRequired);
