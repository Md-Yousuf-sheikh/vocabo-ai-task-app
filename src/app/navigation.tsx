import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useEffect } from "react";
import { LoginScreen, PostDetailScreen, PostsListScreen, ProfileScreen, RegisterScreen } from "@features";
import { useAuth } from "@hooks";
import { ErrorBoundary } from "@utils";
import { colors } from "@theme";
import type { AppTabParamList, AuthStackParamList, PostsStackParamList, ProfileStackParamList, RootStackParamList } from "@types";
import { LoadingSpinner } from "@components";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const PostsStack = createNativeStackNavigator<PostsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

const AnimatedTabIcon = ({ name, focused }: { name: keyof typeof Ionicons.glyphMap; focused: boolean }) => {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1);
  }, [focused, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={style}>
      <Ionicons name={name} size={22} color={focused ? colors.primary : colors.textSecondary} />
    </Animated.View>
  );
};

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const PostsStackNavigator = () => (
  <PostsStack.Navigator>
    <PostsStack.Screen name="PostsList" component={PostsListScreen} options={{ title: "Posts" }} />
    <PostsStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: "Post detail" }} />
  </PostsStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      tabBarLabelStyle: { color: colors.textSecondary }
    }}
  >
    <Tab.Screen
      name="PostsTab"
      component={PostsStackNavigator}
      options={{
        title: "Posts",
        tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} name="list" />
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStackNavigator}
      options={{
        title: "Profile",
        tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} name="person" />
      }}
    />
  </Tab.Navigator>
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
                <AppTabs />
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
