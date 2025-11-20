import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
} from "react-native";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  value?: string[];
  onChange: (value: string[]) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const MultiSelect = React.memo<MultiSelectProps>(
  ({
    label,
    options,
    value = [],
    onChange,
    error,
    required,
    placeholder = "선택해주세요",
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const selectedValues = value || [];

    // 모달이 열릴 때는 애니메이션 없이 즉시 표시
    useEffect(() => {
      if (isOpen && !isClosing) {
        slideAnim.setValue(0);
      }
    }, [isOpen, slideAnim]);

    const handleToggle = (optionValue: string) => {
      const currentValue = selectedValues;
      if (currentValue.includes(optionValue)) {
        // 이미 선택된 경우 제거
        onChange(currentValue.filter((v) => v !== optionValue));
      } else {
        // 선택되지 않은 경우 추가
        onChange([...currentValue, optionValue]);
      }
    };

    const handleClose = () => {
      // 이미 닫히는 중이거나 닫혀있으면 무시
      if (isClosing || !isOpen) return;

      setIsClosing(true);
      // 닫을 때만 슬라이드 다운 애니메이션
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start((finished) => {
        if (finished) {
          setIsOpen(false);
          setIsClosing(false);
          slideAnim.setValue(0);
        }
      });
    };

    const getSelectedLabels = () => {
      if (selectedValues.length === 0) {
        return placeholder;
      }
      return selectedValues
        .map((val) => options.find((opt) => opt.value === val)?.label)
        .filter(Boolean)
        .join(", ");
    };

    const selectedLabelsText = getSelectedLabels();

    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <TouchableOpacity
          style={[
            styles.selectButton,
            error && styles.selectButtonError,
            isOpen && styles.selectButtonOpen,
          ]}
          onPress={() => {
            if (!isClosing && !isOpen) {
              setIsOpen(true);
            }
          }}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
        >
          <Text
            style={[
              styles.selectButtonText,
              selectedValues.length === 0 && styles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {selectedLabelsText}
          </Text>
          <Text style={styles.arrow}>{isOpen ? "▲" : "▼"}</Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Modal
          visible={isOpen && !isClosing}
          transparent
          animationType="none"
          onRequestClose={handleClose}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={handleClose}
            />
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1000],
                      }),
                    },
                  ],
                },
              ]}
              pointerEvents="box-none"
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>완료</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.optionsList}>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionItem,
                        isSelected && styles.optionItemSelected,
                      ]}
                      onPress={() => handleToggle(option.value)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected }}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      </View>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

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
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    backgroundColor: "#fff",
  },
  selectButtonOpen: {
    borderColor: "#3498db",
  },
  selectButtonError: {
    borderColor: "#e74c3c",
  },
  selectButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  arrow: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "600",
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionItemSelected: {
    backgroundColor: "#ebf5fb",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxSelected: {
    borderColor: "#3498db",
    backgroundColor: "#3498db",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  optionTextSelected: {
    color: "#3498db",
    fontWeight: "500",
  },
});
