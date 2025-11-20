import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Supplement } from "@/libs/api/llm.types";

interface SupplementCardProps {
  supplement: Supplement;
  index: number;
}

export const SupplementCard = React.memo<SupplementCardProps>(
  ({ supplement, index }) => {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <Text style={styles.name}>{supplement.name}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.dosageSection}>
            <Text style={styles.dosageLabel}>💊 1일 섭취 용량</Text>
            <Text style={styles.dosage}>{supplement.dosage}</Text>
          </View>
          <View style={styles.reasonSection}>
            <Text style={styles.label}>추천 이유</Text>
            <Text style={styles.reason}>{supplement.reason}</Text>
          </View>
          {supplement.caution && (
            <View style={styles.cautionSection}>
              <Text style={styles.cautionLabel}>⚠️ 주의사항</Text>
              <Text style={styles.caution}>{supplement.caution}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
);

SupplementCard.displayName = "SupplementCard";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  numberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  content: {
    marginLeft: 44, // numberBadge width + marginRight
  },
  dosageSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dosageLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3498db",
    marginBottom: 4,
  },
  dosage: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3498db",
  },
  reasonSection: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  reason: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  cautionSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cautionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e67e22",
    marginBottom: 4,
  },
  caution: {
    fontSize: 14,
    color: "#e67e22",
    lineHeight: 20,
  },
});
