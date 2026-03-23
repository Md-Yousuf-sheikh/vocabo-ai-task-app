export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type PostsStackParamList = {
  PostsList: undefined;
  PostDetail: { postId: number };
  Profile: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type AppTabParamList = {
  PostsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
};
