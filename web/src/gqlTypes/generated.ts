export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Lobby = {
  __typename?: 'Lobby';
  rooms: Array<Room>;
};

export type Match = {
  __typename?: 'Match';
  bgioMatchId: Scalars['String']['output'];
  bgioPlayerId?: Maybe<Scalars['String']['output']>;
  bgioSecret?: Maybe<Scalars['String']['output']>;
  bgioServerUrl: Scalars['String']['output'];
  gameCode: Scalars['String']['output'];
  id?: Maybe<Scalars['Int']['output']>;
  playerMemberships: Array<MatchMembership>;
};

export type MatchMembership = {
  __typename?: 'MatchMembership';
  user: User;
};

export type Message = {
  __typename?: 'Message';
  channelId: Scalars['String']['output'];
  channelType: Scalars['String']['output'];
  isoTimestamp: Scalars['String']['output'];
  message: Scalars['String']['output'];
  userId: Scalars['Float']['output'];
  userNickname: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  joinRoom: Room;
  leaveRoom: Scalars['Boolean']['output'];
  moveUserUp: Scalars['Boolean']['output'];
  newRoom: NewRoom;
  newUser: NewUser;
  nextRoom: Scalars['String']['output'];
  removeFromRoom: Scalars['Boolean']['output'];
  sendMessage: Scalars['Boolean']['output'];
  shuffleUsers: Scalars['Boolean']['output'];
  startMatch: Scalars['String']['output'];
  updateRoom: Scalars['Boolean']['output'];
  updateUser: Scalars['Boolean']['output'];
};


export type MutationjoinRoomArgs = {
  roomId: Scalars['String']['input'];
};


export type MutationleaveRoomArgs = {
  roomId: Scalars['String']['input'];
};


export type MutationmoveUserUpArgs = {
  roomId: Scalars['String']['input'];
  userIdToBeMovedUp: Scalars['Int']['input'];
};


export type MutationnewRoomArgs = {
  room: NewRoomInput;
};


export type MutationnewUserArgs = {
  user: NewUserInput;
};


export type MutationnextRoomArgs = {
  matchId: Scalars['String']['input'];
};


export type MutationremoveFromRoomArgs = {
  roomId: Scalars['String']['input'];
  userIdToBeRemoved: Scalars['Int']['input'];
};


export type MutationsendMessageArgs = {
  message: SendMessageInput;
};


export type MutationshuffleUsersArgs = {
  roomId: Scalars['String']['input'];
};


export type MutationstartMatchArgs = {
  roomId: Scalars['String']['input'];
  setupData: Scalars['String']['input'];
  shuffleUsers: Scalars['Boolean']['input'];
};


export type MutationupdateRoomArgs = {
  room: UpdateRoomInput;
};


export type MutationupdateUserArgs = {
  user: NewUserInput;
};

export type NewRoom = {
  __typename?: 'NewRoom';
  roomId: Scalars['String']['output'];
};

export type NewRoomInput = {
  capacity: Scalars['Float']['input'];
  gameCode: Scalars['String']['input'];
  isPublic: Scalars['Boolean']['input'];
};

export type NewUser = {
  __typename?: 'NewUser';
  jwtToken: Scalars['String']['output'];
};

export type NewUserInput = {
  nickname: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  lobby: Lobby;
  match: Match;
  user: User;
};


export type QuerymatchArgs = {
  id: Scalars['String']['input'];
};

export type Room = {
  __typename?: 'Room';
  capacity: Scalars['Float']['output'];
  gameCode: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  isPublic: Scalars['Boolean']['output'];
  matchId?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['Float']['output']>;
  userMemberships: Array<RoomMembership>;
};

export type RoomMembership = {
  __typename?: 'RoomMembership';
  isCreator: Scalars['Boolean']['output'];
  position: Scalars['Float']['output'];
  user: User;
};

export type SendMessageInput = {
  channelId: Scalars['String']['input'];
  channelType: Scalars['String']['input'];
  message: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  chatMutated: Message;
  lobbyMutated: Lobby;
  roomMutated: Room;
};


export type SubscriptionchatMutatedArgs = {
  channelId: Scalars['String']['input'];
  channelType: Scalars['String']['input'];
};


export type SubscriptionroomMutatedArgs = {
  roomId: Scalars['String']['input'];
};

export type UpdateRoomInput = {
  capacity: Scalars['Float']['input'];
  gameCode: Scalars['String']['input'];
  roomId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['Int']['output']>;
  nickname: Scalars['String']['output'];
};

export type ChatMutatedSubscriptionVariables = Exact<{
  channelType: Scalars['String']['input'];
  channelId: Scalars['String']['input'];
}>;


export type ChatMutatedSubscription = { __typename?: 'Subscription', chatMutated: { __typename?: 'Message', userId: number, userNickname: string, isoTimestamp: string, message: string } };

export type ValidateTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type ValidateTokenQuery = { __typename?: 'Query', lobby: { __typename?: 'Lobby', rooms: Array<{ __typename?: 'Room', id?: string | null }> } };

export type NewUserMutationVariables = Exact<{
  user: NewUserInput;
}>;


export type NewUserMutation = { __typename?: 'Mutation', newUser: { __typename?: 'NewUser', jwtToken: string } };

export type GetMatchQueryVariables = Exact<{
  matchId: Scalars['String']['input'];
}>;


export type GetMatchQuery = { __typename?: 'Query', match: { __typename?: 'Match', gameCode: string, bgioServerUrl: string, bgioMatchId: string, bgioSecret?: string | null, bgioPlayerId?: string | null, playerMemberships: Array<{ __typename?: 'MatchMembership', user: { __typename?: 'User', id?: number | null, nickname: string } }> } };

export type StartMatchMutationVariables = Exact<{
  roomId: Scalars['String']['input'];
  shuffleUsers: Scalars['Boolean']['input'];
  setupData: Scalars['String']['input'];
}>;


export type StartMatchMutation = { __typename?: 'Mutation', startMatch: string };

export type NewRoomMutationVariables = Exact<{
  room: NewRoomInput;
}>;


export type NewRoomMutation = { __typename?: 'Mutation', newRoom: { __typename?: 'NewRoom', roomId: string } };

export type UpdateUserMutationVariables = Exact<{
  user: NewUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: boolean };

export type UpdateRoomMutationVariables = Exact<{
  room: UpdateRoomInput;
}>;


export type UpdateRoomMutation = { __typename?: 'Mutation', updateRoom: boolean };

export type JoinRoomMutationVariables = Exact<{
  roomId: Scalars['String']['input'];
}>;


export type JoinRoomMutation = { __typename?: 'Mutation', joinRoom: { __typename?: 'Room', gameCode: string, capacity: number, isPublic: boolean, matchId?: string | null, userId?: number | null, userMemberships: Array<{ __typename?: 'RoomMembership', isCreator: boolean, position: number, user: { __typename?: 'User', id?: number | null, nickname: string } }> } };

export type LeaveRoomMutationVariables = Exact<{
  roomId: Scalars['String']['input'];
}>;


export type LeaveRoomMutation = { __typename?: 'Mutation', leaveRoom: boolean };

export type RemoveUserFromRoomMutationVariables = Exact<{
  roomId: Scalars['String']['input'];
  userIdToBeRemoved: Scalars['Int']['input'];
}>;


export type RemoveUserFromRoomMutation = { __typename?: 'Mutation', removeFromRoom: boolean };

export type MoveUserUpMutationVariables = Exact<{
  roomId: Scalars['String']['input'];
  userIdToBeMovedUp: Scalars['Int']['input'];
}>;


export type MoveUserUpMutation = { __typename?: 'Mutation', moveUserUp: boolean };

export type ShuffleUsersMutationVariables = Exact<{
  roomId: Scalars['String']['input'];
}>;


export type ShuffleUsersMutation = { __typename?: 'Mutation', shuffleUsers: boolean };

export type NextRoomMutationVariables = Exact<{
  matchId: Scalars['String']['input'];
}>;


export type NextRoomMutation = { __typename?: 'Mutation', nextRoom: string };

export type GetLobbyQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLobbyQuery = { __typename?: 'Query', lobby: { __typename?: 'Lobby', rooms: Array<{ __typename?: 'Room', id?: string | null, gameCode: string, capacity: number, userMemberships: Array<{ __typename?: 'RoomMembership', isCreator: boolean, position: number }> }> } };

export type SendMessageMutationVariables = Exact<{
  channelType: Scalars['String']['input'];
  channelId: Scalars['String']['input'];
  message: Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: boolean };

export type SubscribeToLobbySubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToLobbySubscription = { __typename?: 'Subscription', lobbyMutated: { __typename?: 'Lobby', rooms: Array<{ __typename?: 'Room', id?: string | null, gameCode: string, capacity: number, userMemberships: Array<{ __typename?: 'RoomMembership', isCreator: boolean, position: number }> }> } };

export type RoomMutatedSubscriptionVariables = Exact<{
  roomId: Scalars['String']['input'];
}>;


export type RoomMutatedSubscription = { __typename?: 'Subscription', roomMutated: { __typename?: 'Room', gameCode: string, capacity: number, isPublic: boolean, matchId?: string | null, userId?: number | null, userMemberships: Array<{ __typename?: 'RoomMembership', isCreator: boolean, position: number, user: { __typename?: 'User', id?: number | null, nickname: string } }> } };
