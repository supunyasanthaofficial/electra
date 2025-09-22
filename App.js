import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";

import TabNavigator from "./navigation/TabNavigator";
import PlayerScreen from "./screens/PlayerScreen";

import ContactSupport from "./screens/ContactSupport";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import TermsAnddCondition from "./screens/TermsAnddCondition";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen name="ContactSupport" component={ContactSupport} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAnddCondition}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
