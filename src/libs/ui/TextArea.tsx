import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from "react-native";

interface TextAreaProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export const TextArea = React.memo<TextAreaProps>(
  ({ label, error, required, ...textInputProps }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        <TextInput
          style={[styles.textArea, error && styles.inputError]}
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          {...textInputProps}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

TextArea.displayName = "TextArea";

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
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 100,
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: 4,
  },
});
