/**
 * Boolean 선택 라디오 버튼 컴포넌트
 * 흡연 여부 등 yes/no 선택에 사용
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface BooleanRadioProps {
  label: string;
  value?: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  required?: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export const BooleanRadio = React.memo<BooleanRadioProps>(
  ({
    label,
    value,
    onChange,
    error,
    required = false,
    trueLabel = "예",
    falseLabel = "아니오",
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.option,
              value === true && styles.optionSelected,
              error && styles.optionError,
            ]}
            onPress={() => onChange(true)}
            accessibilityRole="radio"
            accessibilityState={{ selected: value === true }}
          >
            <View
              style={[
                styles.radioCircle,
                value === true && styles.radioCircleSelected,
              ]}
            />
            <Text
              style={[
                styles.optionText,
                value === true && styles.optionTextSelected,
              ]}
            >
              {trueLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              value === false && styles.optionSelected,
              error && styles.optionError,
            ]}
            onPress={() => onChange(false)}
            accessibilityRole="radio"
            accessibilityState={{ selected: value === false }}
          >
            <View
              style={[
                styles.radioCircle,
                value === false && styles.radioCircleSelected,
              ]}
            />
            <Text
              style={[
                styles.optionText,
                value === false && styles.optionTextSelected,
              ]}
            >
              {falseLabel}
            </Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

BooleanRadio.displayName = "BooleanRadio";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  required: {
    color: "#e74c3c",
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    backgroundColor: "#fff",
  },
  optionSelected: {
    borderColor: "#3498db",
    backgroundColor: "#ebf5fb",
  },
  optionError: {
    borderColor: "#e74c3c",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: "#3498db",
    backgroundColor: "#3498db",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextSelected: {
    color: "#3498db",
    fontWeight: "600",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: 4,
  },
});
