import React, { useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import { SupplementCard } from "@/libs/ui/SupplementCard";
import { Button } from "@/libs/ui/Button";
import type { RootStackParamList } from "@/navigation/types";

type RecommendationScreenRouteProp = RouteProp<
  RootStackParamList,
  "Recommendation"
>;

type RecommendationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Recommendation"
>;

export const RecommendationScreen = React.memo(() => {
  const route = useRoute<RecommendationScreenRouteProp>();
  const navigation = useNavigation<RecommendationScreenNavigationProp>();
  const { recommendation, profile } = route.params;

  // "다시 입력하기" - 이전 데이터를 전달하여 폼을 채움 (사용자가 수정 가능)
  const handleRetry = useCallback(() => {
    navigation.navigate("Intake", {
      initialData: profile,
    });
  }, [navigation, profile]);

  // "처음으로" - 데이터를 초기화하고 빈 폼으로 시작
  const handleGoToIntake = useCallback(() => {
    navigation.navigate("Intake", {
      initialData: undefined, // 명시적으로 undefined를 전달하여 데이터 초기화
    });
  }, [navigation]);

  // 빈 supplements 배열 처리
  if (!recommendation.supplements || recommendation.supplements.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>추천 결과가 없습니다</Text>
          <Text style={styles.emptyText}>
            관련 영양제를 찾지 못했습니다. 다시 시도해주세요.
          </Text>
          <Button
            title="다시 입력하기"
            onPress={handleRetry}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>맞춤형 영양제 추천</Text>
          <Text style={styles.subtitle}>
            입력하신 건강 정보를 바탕으로 추천드립니다
          </Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>종합 요약</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{recommendation.summary}</Text>
          </View>
        </View>

        <View style={styles.supplementsSection}>
          <Text style={styles.sectionTitle}>
            추천 영양제 ({recommendation.supplements.length}개)
          </Text>
          {recommendation.supplements.map((supplement, index) => (
            <SupplementCard
              key={`${supplement.name}-${index}`}
              supplement={supplement}
              index={index}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            title="다시 입력하기"
            onPress={handleRetry}
            variant="secondary"
            style={styles.retryButton}
          />

          <Button
            title="처음으로"
            onPress={handleGoToIntake}
            variant="primary"
            style={styles.retryButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

RecommendationScreen.displayName = "RecommendationScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  supplementsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  footer: {
    marginTop: 8,
  },
  retryButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
});
