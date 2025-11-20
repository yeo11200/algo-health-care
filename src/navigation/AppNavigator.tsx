import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IntakeScreen } from "@/features/intake/IntakeScreen";
import { RecommendationPendingScreen } from "@/features/recommendation/RecommendationPendingScreen";
import { RecommendationScreen } from "@/features/recommendation/RecommendationScreen";
import { ErrorScreen } from "@/features/recommendation/ErrorScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Intake"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#3498db",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Intake"
          component={IntakeScreen}
          options={{ title: "건강 정보 입력" }}
        />
        <Stack.Screen
          name="RecommendationPending"
          component={RecommendationPendingScreen}
          options={{ title: "추천 생성 중...", headerBackVisible: false }}
        />
        <Stack.Screen
          name="Recommendation"
          component={RecommendationScreen}
          options={{ title: "영양제 추천" }}
        />
        <Stack.Screen
          name="Error"
          component={ErrorScreen}
          options={{ title: "오류" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
