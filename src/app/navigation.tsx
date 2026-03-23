import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen, PostDetailScreen, PostsListScreen, ProfileScreen, RegisterScreen } from "@features";
import { useAuth } from "@hooks";
import { ErrorBoundary } from "@utils";
import type { AuthStackParamList, PostsStackParamList, RootStackParamList } from "@types";
import { LoadingSpinner } from "@components";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const PostsStack = createNativeStackNavigator<PostsStackParamList>();

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const PostsStackNavigator = () => (
  <PostsStack.Navigator screenOptions={{ headerShown: false }}>
    <PostsStack.Screen name="PostsList" component={PostsListScreen} />
    <PostsStack.Screen name="PostDetail" component={PostDetailScreen} />
    <PostsStack.Screen name="Profile" component={ProfileScreen} />
  </PostsStack.Navigator>
);

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner message="Checking auth..." />;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen
            name="AppStack"
            children={() => (
              <ErrorBoundary>
                <PostsStackNavigator />
              </ErrorBoundary>
            )}
          />
        ) : (
          <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
