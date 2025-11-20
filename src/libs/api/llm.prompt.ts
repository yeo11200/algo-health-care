import { HealthProfile } from "@/features/intake/intake.types";

/**
 * HealthProfile을 기반으로 LLM 프롬프트를 생성합니다.
 *
 * @param profile - 사용자의 건강 정보
 * @returns LLM에 전달할 프롬프트 문자열
 */
export function buildPrompt(profile: HealthProfile): string {
  // 프롬프트를 간결하게 만들어 reasoning 모델의 토큰 사용을 줄입니다
  return `건강 정보 기반 영양제 추천.

사용자: ${profile.age}세 ${profile.gender === "male" ? "남성" : profile.gender === "female" ? "여성" : "기타"}, ${profile.weight}kg, ${profile.smoking ? "흡연" : "비흡연"}
약물: ${profile.medications || "없음"}
고민: ${profile.concerns && profile.concerns.length > 0 ? profile.concerns.join(", ") : "없음"}
생활: ${profile.lifestyle && profile.lifestyle.length > 0 ? profile.lifestyle.join(", ") : "없음"}

JSON 형식으로만 출력:
{
  "supplements": [{"name": "한국어명", "reason": "이유", "dosage": "1일 기준 섭취 용량 (예: 400 IU, 300 mg)", "caution": "주의사항(선택)"}],
  "summary": "요약"
}

규칙:
1. JSON만 출력 (설명 없음)
2. supplements 최소 1개
3. name은 한국어 (예: "멜라토닌", "비타민 D3")
4. dosage는 1일 기준 섭취 용량을 명시 (예: "400 IU", "300 mg", "1000-2000 IU")`;
}

/**
 * 프롬프트 템플릿 타입 정의
 */
export interface PromptTemplate {
  build(profile: HealthProfile): string;
}
