import React, { useCallback, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { intakeSchema, HealthProfile } from "./intake.schema";
import { Input } from "@/libs/ui/Input";
import { TextArea } from "@/libs/ui/TextArea";
import { GenderRadio } from "@/libs/ui/GenderRadio";
import { BooleanRadio } from "@/libs/ui/BooleanRadio";
import { MultiSelect, MultiSelectOption } from "@/libs/ui/MultiSelect";
import { Button } from "@/libs/ui/Button";
import type { RootStackParamList } from "@/navigation/types";

type IntakeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Intake"
>;

type IntakeScreenRouteProp = RouteProp<RootStackParamList, "Intake">;

export const IntakeScreen = React.memo(() => {
  const route = useRoute<IntakeScreenRouteProp>();
  const navigation = useNavigation<IntakeScreenNavigationProp>();
  const initialData = route.params?.initialData;

  const [ageInputError, setAgeInputError] = useState<string | undefined>();
  const [weightInputError, setWeightInputError] = useState<
    string | undefined
  >();

  // 선택 옵션들 - useMemo로 메모이제이션
  const selectOptions = useMemo(
    () => ({
      healthConcerns: [
        { value: "피로", label: "피로" },
        { value: "소화불량", label: "소화불량" },
        { value: "수면장애", label: "수면장애" },
        { value: "스트레스", label: "스트레스" },
        { value: "관절통", label: "관절통" },
        { value: "두통", label: "두통" },
        { value: "면역력저하", label: "면역력 저하" },
        { value: "피부건조", label: "피부 건조" },
        { value: "탈모", label: "탈모" },
        { value: "기타", label: "기타" },
      ] as MultiSelectOption[],
      lifestyle: [
        { value: "운동_정기적", label: "운동 정기적" },
        { value: "운동_가끔", label: "운동 가끔" },
        { value: "운동_안함", label: "운동 안 함" },
        { value: "수면_양호", label: "수면 질 양호" },
        { value: "수면_보통", label: "수면 질 보통" },
        { value: "수면_나쁨", label: "수면 질 나쁨" },
        { value: "스트레스_높음", label: "스트레스 높음" },
        { value: "스트레스_보통", label: "스트레스 보통" },
        { value: "스트레스_낮음", label: "스트레스 낮음" },
        { value: "야근_자주", label: "야근 자주" },
        { value: "야근_가끔", label: "야근 가끔" },
        { value: "야근_안함", label: "야근 안 함" },
      ] as MultiSelectOption[],
    }),
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HealthProfile>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      age: initialData?.age,
      gender: initialData?.gender,
      weight: initialData?.weight,
      medications: initialData?.medications || "",
      concerns: initialData?.concerns || [],
      lifestyle: initialData?.lifestyle || [],
      smoking: initialData?.smoking,
    },
  });

  // initialData가 변경되면 폼을 업데이트
  React.useEffect(() => {
    // route.params에 initialData가 명시적으로 전달된 경우만 처리
    // (뒤로가기로 돌아온 경우 route.params가 변경되지 않으므로 처리하지 않음)
    if (route.params !== undefined) {
      if (route.params.initialData) {
        // initialData가 있으면 폼을 채움
        reset({
          age: route.params.initialData.age,
          gender: route.params.initialData.gender,
          weight: route.params.initialData.weight,
          medications: route.params.initialData.medications || "",
          concerns: route.params.initialData.concerns || [],
          lifestyle: route.params.initialData.lifestyle || [],
          smoking: route.params.initialData.smoking,
        });
      } else if (route.params.initialData === undefined) {
        // initialData가 명시적으로 undefined로 전달된 경우 폼 초기화
        // ("처음으로" 버튼으로 온 경우)
        reset({
          age: undefined,
          gender: undefined,
          weight: undefined,
          medications: "",
          concerns: [],
          lifestyle: [],
          smoking: undefined,
        });
      }
    }
    // route.params가 undefined인 경우는 뒤로가기로 돌아온 경우이므로
    // 기존 폼 데이터를 유지 (아무것도 하지 않음)
  }, [route.params, reset]);

  /**
   * 숫자만 입력 가능한지 검증하는 함수
   */
  const isNumericInput = (text: string): boolean => {
    // 빈 문자열은 허용 (입력 중일 수 있음)
    if (text === "") return true;
    // 숫자와 소수점만 허용
    return /^[0-9]*\.?[0-9]*$/.test(text);
  };

  const onSubmit = useCallback(
    (data: HealthProfile) => {
      navigation.navigate("RecommendationPending", { profile: data });
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>건강 정보 입력</Text>
            <Text style={styles.subtitle}>
              맞춤형 영양제 추천을 위해 정보를 입력해주세요
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="나이"
                  placeholder="예: 29"
                  keyboardType="number-pad"
                  value={value?.toString()}
                  onChangeText={(text) => {
                    // 숫자가 아닌 문자가 포함되어 있는지 검증
                    if (!isNumericInput(text)) {
                      setAgeInputError("숫자만 입력 가능합니다");
                      return;
                    }
                    setAgeInputError(undefined);

                    // 빈 문자열이면 undefined로 설정
                    if (text === "") {
                      onChange(undefined);
                      return;
                    }

                    const numValue = parseInt(text, 10);
                    if (!isNaN(numValue)) {
                      onChange(numValue);
                    }
                  }}
                  onBlur={onBlur}
                  error={ageInputError || errors.age?.message}
                  required
                />
              )}
            />

            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <GenderRadio
                  value={value}
                  onChange={onChange}
                  error={errors.gender?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="weight"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="체중 (kg)"
                  placeholder="예: 70"
                  keyboardType="decimal-pad"
                  value={value?.toString()}
                  onChangeText={(text) => {
                    // 숫자가 아닌 문자가 포함되어 있는지 검증
                    if (!isNumericInput(text)) {
                      setWeightInputError("숫자만 입력 가능합니다");
                      return;
                    }
                    setWeightInputError(undefined);

                    // 빈 문자열이면 undefined로 설정
                    if (text === "") {
                      onChange(undefined);
                      return;
                    }

                    const numValue = parseFloat(text);
                    if (!isNaN(numValue)) {
                      onChange(numValue);
                    }
                  }}
                  onBlur={onBlur}
                  error={weightInputError || errors.weight?.message}
                  required
                />
              )}
            />

            <Controller
              control={control}
              name="smoking"
              render={({ field: { onChange, value } }) => (
                <BooleanRadio
                  label="흡연 여부"
                  value={value}
                  onChange={onChange}
                  error={errors.smoking?.message}
                  required
                  trueLabel="흡연"
                  falseLabel="비흡연"
                />
              )}
            />

            <Controller
              control={control}
              name="medications"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextArea
                  label="복용 중인 약물"
                  placeholder="예: 마그네슘, 오메가3 (없으면 '없음' 입력)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.medications?.message}
                  required
                />
              )}
            />

            <Controller
              control={control}
              name="concerns"
              render={({ field: { onChange, value } }) => (
                <MultiSelect
                  label="건강 고민"
                  options={selectOptions.healthConcerns}
                  value={value}
                  onChange={onChange}
                  error={errors.concerns?.message}
                  required
                />
              )}
            />

            <Controller
              control={control}
              name="lifestyle"
              render={({ field: { onChange, value } }) => (
                <MultiSelect
                  label="생활 패턴"
                  options={selectOptions.lifestyle}
                  value={value}
                  onChange={onChange}
                  error={errors.lifestyle?.message}
                  required
                />
              )}
            />

            <Button
              title="추천 받기"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              loading={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

IntakeScreen.displayName = "IntakeScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardView: {
    flex: 1,
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
  form: {
    flex: 1,
  },
  submitButton: {
    marginTop: 8,
  },
});
