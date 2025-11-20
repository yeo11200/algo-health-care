/**
 * 재사용 가능한 버튼 컴포넌트
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = React.memo<ButtonProps>(
  ({
    title,
    onPress,
    variant = "primary",
    disabled = false,
    loading = false,
    style,
    textStyle,
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          styles[variant],
          (disabled || loading) && styles.disabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={[styles.buttonText, styles[`${variant}Text`], textStyle]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#3498db",
  },
  secondary: {
    backgroundColor: "#95a5a6",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3498db",
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#fff",
  },
  outlineText: {
    color: "#3498db",
  },
});
