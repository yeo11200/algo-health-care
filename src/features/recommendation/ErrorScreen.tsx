import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import { Button } from "@/libs/ui/Button";
import type { RootStackParamList } from "@/navigation/types";

type ErrorScreenRouteProp = RouteProp<RootStackParamList, "Error">;

type ErrorScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Error"
>;

export const ErrorScreen = React.memo(() => {
  const route = useRoute<ErrorScreenRouteProp>();
  const navigation = useNavigation<ErrorScreenNavigationProp>();
  const { error, retryScreen } = route.params;

  const handleRetry = useCallback(() => {
    if (retryScreen === "RecommendationPending") {
      // RecommendationPending으로 돌아가려면 profile이 필요하므로
      // 일단 Intake로 이동
      navigation.navigate("Intake");
    } else {
      navigation.navigate("Intake");
    }
  }, [retryScreen, navigation]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>
        <Text style={styles.title}>오류가 발생했습니다</Text>
        <Text style={styles.message}>{error}</Text>
        {error.includes("할당량") || error.includes("quota") ? (
          <Text style={styles.hint}>
            💡 개발 중에는 Mock 모드를 사용하세요{"\n"}
            .env 파일에 EXPO_PUBLIC_USE_MOCK_API=true 추가
          </Text>
        ) : null}
        <View style={styles.buttonContainer}>
          <Button
            title="다시 시도"
            onPress={handleRetry}
            style={styles.button}
          />
          <Button
            title="처음으로"
            onPress={() => navigation.navigate("Intake")}
            style={styles.button}
            variant="outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
});

ErrorScreen.displayName = "ErrorScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  hint: {
    fontSize: 14,
    color: "#3498db",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    width: "100%",
  },
});
