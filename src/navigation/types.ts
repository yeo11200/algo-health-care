import { HealthProfile } from "@/features/intake/intake.types";

import { LLMRecommendation } from "@/libs/api/llm.types";

export type RootStackParamList = {
  Intake:
    | {
        // 이전 입력 데이터를 전달하여 폼을 채울 수 있음
        initialData?: HealthProfile;
      }
    | undefined;
  RecommendationPending: {
    profile: HealthProfile;
  };
  Recommendation: {
    profile: HealthProfile;
    recommendation: LLMRecommendation;
  };
  Error: {
    error: string;
    retryScreen?: "Intake" | "RecommendationPending";
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
