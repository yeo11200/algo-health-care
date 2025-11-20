import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import { getRecommendation } from "@/libs/api/llmClient";
import { LLMRecommendation, LLMError } from "@/libs/api/llm.types";
import type { RootStackParamList } from "@/navigation/types";

type RecommendationPendingScreenRouteProp = RouteProp<
  RootStackParamList,
  "RecommendationPending"
>;

type RecommendationPendingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RecommendationPending"
>;

export const RecommendationPendingScreen = React.memo(() => {
  const route = useRoute<RecommendationPendingScreenRouteProp>();
  const navigation = useNavigation<RecommendationPendingScreenNavigationProp>();
  const { profile } = route.params;

  const [error, setError] = useState<LLMError | null>(null);

  useEffect(() => {
    let isMounted = true; // 컴포넌트가 마운트되어 있는지 추적
    const abortController = new AbortController();

    const fetchRecommendation = async () => {
      try {
        const recommendation: LLMRecommendation =
          await getRecommendation(profile);

        // 컴포넌트가 언마운트되었거나 취소된 경우 처리하지 않음
        if (!isMounted || abortController.signal.aborted) {
          return;
        }

        // 성공 시 Recommendation 화면으로 이동
        navigation.replace("Recommendation", {
          profile,
          recommendation,
        });
      } catch (err) {
        // 컴포넌트가 언마운트되었거나 취소된 경우 처리하지 않음
        if (!isMounted || abortController.signal.aborted) {
          return;
        }

        // 에러 발생 시 Error 화면으로 이동
        const llmError = err as LLMError;
        setError(llmError);
        navigation.replace("Error", {
          error: llmError.message,
          retryScreen: "Intake",
        });
      }
    };

    fetchRecommendation();

    // 클린업 함수: 컴포넌트 언마운트 시 취소
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [profile, navigation]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.text}>영양제 추천을 생성하고 있습니다...</Text>
        {error && (
          <Text style={styles.errorText}>
            오류가 발생했습니다: {error.message}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
});

RecommendationPendingScreen.displayName = "RecommendationPendingScreen";

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
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
    color: "#e74c3c",
    textAlign: "center",
  },
});
