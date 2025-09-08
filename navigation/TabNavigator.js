import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import LibraryScreen from "../screens/LibraryScreen";
import SettingScreen from "../screens/SettingScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Dark tab bar to match screens
        tabBarStyle: {
          backgroundColor: "#0A0D1A",
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#6C5CE7", // highlight color
        tabBarInactiveTintColor: "#aaa",
        headerStyle: {
          backgroundColor: "#10183dff",
          shadowColor: "transparent",
        },
        headerTintColor: "#ce3030ff",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Library") {
            iconName = focused ? "musical-notes" : "musical-notes-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return (
            <Animatable.View
              animation={focused ? "rubberBand" : "fadeIn"}
              duration={600}
              easing="ease-in-out"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Ionicons name={iconName} size={size} color={color} />
            </Animatable.View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* <Tab.Screen name="Search" component={SearchScreen} /> */}
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
