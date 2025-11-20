import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type GenderOption = "male" | "female" | "other";

interface GenderRadioProps {
  value?: GenderOption;
  onChange: (value: GenderOption) => void;
  error?: string;
}

const GENDER_OPTIONS: { value: GenderOption; label: string }[] = [
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
];

export const GenderRadio = React.memo<GenderRadioProps>(
  ({ value, onChange, error }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          성별 <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.optionsContainer}>
          {GENDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                value === option.value && styles.optionSelected,
                error && styles.optionError,
              ]}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: value === option.value }}
            >
              <View
                style={[
                  styles.radioCircle,
                  value === option.value && styles.radioCircleSelected,
                ]}
              />
              <Text
                style={[
                  styles.optionText,
                  value === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

GenderRadio.displayName = "GenderRadio";

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
