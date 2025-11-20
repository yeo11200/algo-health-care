import OpenAI from "openai";
import { HealthProfile } from "@/features/intake/intake.types";
import { LLMRecommendation, LLMError } from "./llm.types";
import { buildPrompt } from "./llm.prompt";
import { parseLLMResponse } from "./llm.parser";

/**
 * 환경 변수에서 API 설정을 가져옵니다.
 */
const getApiConfig = () => {
  const apiKey = process.env.EXPO_PUBLIC_LLM_API_KEY || "";
  const model = process.env.EXPO_PUBLIC_LLM_MODEL || "gpt-4";
  const useMock = process.env.EXPO_PUBLIC_USE_MOCK_API === "true";

  return { apiKey, model, useMock };
};

/**
 * Mock 추천 응답을 반환합니다.
 * 개발 및 테스트 목적으로 사용됩니다.
 * 실제 LLM 응답 형식을 기반으로 작성되었습니다.
 */
function getMockRecommendation(profile: HealthProfile): LLMRecommendation {
  // 프로필 정보에 따라 다른 Mock 응답 생성
  const supplements = [];

  // 피로감 관련
  if (
    (profile.concerns &&
      (profile.concerns.includes("피로") ||
        profile.concerns.includes("피로감"))) ||
    (profile.lifestyle &&
      (profile.lifestyle.includes("수면") ||
        profile.lifestyle.includes("피로")))
  ) {
    supplements.push({
      name: "멜라토닌",
      dosage: "0.5-3 mg",
      reason:
        "수면-각성 주기를 조절하고 수면의 질을 개선하는 데 도움; 피로감의 주요 원인인 만성 수면 부족에 대응하기 위해 취침 30~60분 전에 0.5–3 mg 복용이 일반적입니다.",
      caution:
        "일부 약물과 상호작용 가능성(예: 혈압약, 항응고제) 및 특정 질환이 있는 경우 의사와 상담; 운전이나 기계 조작 시 주의; 임신·수유 중인 경우 주의.",
    });

    supplements.push({
      name: "비타민 D3",
      dosage: "1000-2000 IU",
      reason:
        "햇빛 노출이 부족한 생활에서 피로감과 근육/정서적 기분 저하를 완화하는 데 도움이 될 수 있으며, 일반적으로 1000–2000 IU를 매일 시작합니다.",
      caution:
        "장기간 고용량 복용 시 혈청 칼슘 수치를 확인하는 것이 좋고, 고칼슘혈증 증상에 주의; 특정 약물과의 상호작용 가능.",
    });

    supplements.push({
      name: "비타민 B12",
      dosage: "1000-2500 mcg",
      reason:
        "에너지 대사 지원 및 피로 감소에 도움; 특히 흡수가 잘 되지 않는 경우나 비건/저단백 식이일 때 보충이 유용할 수 있습니다.",
      caution:
        "일부 약물과의 상호작용 가능성(예: 메트포르민, 위산억제제) 및 드물게 알레르기 반응 가능.",
    });

    supplements.push({
      name: "오메가-3 (EPA+DHA)",
      dosage: "1000-2000 mg",
      reason:
        "뇌 건강 및 기분 개선에 도움을 줄 수 있으며 전반적인 피로 완화에도 기여할 수 있습니다; 식사와 함께 섭취하는 것이 흡수를 돕습니다.",
      caution:
        "혈액 응고제 복용 시 주의; 어패류 알레르기가 있는 경우 피해야 함.",
    });
  }

  // 소화 관련
  if (
    profile.concerns &&
    (profile.concerns.includes("소화") || profile.concerns.includes("소화불량"))
  ) {
    supplements.push({
      name: "프로바이오틱스",
      dosage: "100억-500억 CFU",
      reason: "소화 기능 개선과 장 건강에 도움됩니다.",
    });
  }

  // 스트레스 관련
  if (
    profile.lifestyle &&
    (profile.lifestyle.includes("스트레스_높음") ||
      profile.lifestyle.includes("스트레스"))
  ) {
    supplements.push({
      name: "L-테아닌",
      dosage: "100-200 mg",
      reason: "스트레스 감소와 수면 질 개선에 도움됩니다.",
      caution: "카페인과 함께 섭취 시 주의하세요.",
    });
  }

  // 흡연 관련
  if (profile.smoking) {
    supplements.push({
      name: "비타민 C",
      dosage: "500-1000 mg",
      reason:
        "흡연 시 산화 스트레스가 증가하므로 항산화제인 비타민 C 보충이 도움이 될 수 있습니다. 흡연자는 비흡연자보다 비타민 C 필요량이 높습니다.",
      caution:
        "고용량 복용 시 설사나 위장 장애가 발생할 수 있으므로 적절한 용량을 유지하세요.",
    });

    supplements.push({
      name: "N-아세틸시스테인 (NAC)",
      dosage: "600-1200 mg",
      reason:
        "흡연으로 인한 폐 손상과 점액 분비 개선에 도움을 줄 수 있으며, 항산화 효과가 있습니다.",
      caution:
        "일부 약물과 상호작용 가능성이 있으므로 의사와 상담 후 복용하세요.",
    });
  }

  // 기본 추천 (조건에 맞는 추천이 없을 경우)
  if (supplements.length === 0) {
    supplements.push({
      name: "종합 비타민",
      dosage: "1정 (제조사 권장량)",
      reason: "기본적인 영양소 보충을 위해 추천합니다.",
    });
  }

  // Summary 생성
  const genderText =
    profile.gender === "male"
      ? "남성"
      : profile.gender === "female"
        ? "여성"
        : "기타";

  let summary = `나이 ${profile.age}세, ${genderText}을 고려한 맞춤형 영양제 추천입니다.`;

  if (supplements.length > 1) {
    const concernsText =
      profile.concerns && profile.concerns.length > 0
        ? profile.concerns.join(", ")
        : "일반적인 건강 관리";
    const lifestyleText =
      profile.lifestyle && profile.lifestyle.length > 0
        ? profile.lifestyle.join(", ")
        : "일반적인 생활 패턴";

    summary = `${concernsText}와 ${lifestyleText}을 고려하여 수면 개선과 에너지 대사를 지원하는 보충제를 제안합니다.`;
    if (profile.smoking) {
      summary += ` 흡연 여부를 고려하여 항산화제를 포함했습니다.`;
    }
    if (profile.medications) {
      summary += ` 현재 ${profile.medications}을 복용 중이므로 총 섭취량 관리가 필요하며, 시작 전 의료 전문가와 상담하는 것을 권합니다.`;
    }
  }

  return {
    supplements,
    summary,
  };
}

/**
 * OpenAI API를 호출합니다.
 * OpenAI 공식 라이브러리를 사용합니다.
 * 10분 이상 멈추는 문제를 해결하기 위해 타임아웃과 재시도 로직을 포함합니다.
 */
async function callOpenAIAPI(
  prompt: string,
  apiKey: string,
  model: string,
  retryCount: number = 0
): Promise<string> {
  const MAX_RETRIES = 2;
  const TIMEOUT_MS = 60000; // 60초 타임아웃 (10분 문제 대응)

  const openai = new OpenAI({
    apiKey,
    timeout: TIMEOUT_MS,
    maxRetries: 0, // 수동 재시도 로직 사용
  });

  // 모델에 따라 지원하는 파라미터가 다를 수 있으므로
  // 최소한의 필수 파라미터만 사용
  // reasoning 모델의 경우 reasoning_tokens + completion_tokens를 모두 포함해야 하므로
  // 충분한 토큰을 할당해야 함
  // reasoning 모델(gpt-5-nano 등)은 reasoning에 토큰을 많이 사용하므로 충분히 설정
  //
  // ⚠️ 중요: reasoning 모델은 reasoning_tokens와 completion_tokens를 합쳐서
  // max_completion_tokens 한도 내에서 사용합니다.
  // reasoning에 토큰을 많이 사용하면 실제 응답(content)을 생성할 토큰이 부족해질 수 있습니다.
  // 따라서 reasoning 모델의 경우 더 많은 토큰을 할당해야 합니다.
  const maxTokens =
    model.includes("nano") ||
    model.includes("o1") ||
    model.includes("reasoning")
      ? 10000 // reasoning 모델: reasoning(최대 4000) + 실제 응답(최소 2000)을 위한 충분한 여유
      : 2000; // 일반 모델: 일반적인 응답

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_completion_tokens: maxTokens,
    });

    const content = completion.choices[0]?.message?.content || "";
    const finishReason = completion.choices[0]?.finish_reason;

    if (!content) {
      // 재시도 로직: 응답이 비어있고 재시도 횟수가 남아있으면 재시도
      // 단, finish_reason이 "length"이고 reasoning 토큰이 너무 많으면
      // 재시도해도 같은 문제가 발생할 수 있으므로 에러를 던집니다
      if (retryCount < MAX_RETRIES && finishReason !== "length") {
        console.log(`재시도 중... (${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        ); // 지수 백오프
        return callOpenAIAPI(prompt, apiKey, model, retryCount + 1);
      }

      // finish_reason이 "length"인 경우 더 구체적인 에러 메시지
      if (finishReason === "length") {
        throw new Error(
          "API 응답이 토큰 한도에 도달하여 비어있습니다. " +
            "reasoning 모델이 모든 토큰을 reasoning에 사용했을 수 있습니다. " +
            "max_completion_tokens를 늘리거나 일반 모델을 사용하세요."
        );
      }

      throw new Error("API 응답이 비어있습니다. 재시도 횟수를 초과했습니다.");
    }

    return content;
  } catch (error) {
    // 타임아웃이나 네트워크 에러 시 재시도
    if (
      retryCount < MAX_RETRIES &&
      ((error instanceof Error && error.message.includes("timeout")) ||
        (error instanceof OpenAI.APIError && error.status === 408))
    ) {
      console.log(
        `타임아웃 발생. 재시도 중... (${retryCount + 1}/${MAX_RETRIES})`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 * (retryCount + 1))
      ); // 지수 백오프
      return callOpenAIAPI(prompt, apiKey, model, retryCount + 1);
    }

    throw error;
  }
}

/**
 * LLM API를 호출하여 추천을 받습니다.
 *
 * @param profile - 사용자의 건강 정보
 * @param useMock - Mock 응답 사용 여부 (기본값: 환경 변수 또는 false)
 * @returns LLMRecommendation 객체
 * @throws LLMError - API 호출 실패 시
 */
export async function getRecommendation(
  profile: HealthProfile,
  useMock?: boolean
): Promise<LLMRecommendation> {
  const config = getApiConfig();
  const shouldUseMock = useMock ?? config.useMock;

  // Mock 모드
  if (shouldUseMock || !config.apiKey) {
    return getMockRecommendation(profile);
  }

  try {
    const prompt = buildPrompt(profile);
    const rawResponse = await callOpenAIAPI(
      prompt,
      config.apiKey,
      config.model,
      0 // 재시도 횟수 초기값
    );

    // 응답 파싱 및 검증
    return parseLLMResponse(rawResponse);
  } catch (error) {
    // 에러 타입 분류
    if (error instanceof OpenAI.APIError) {
      // OpenAI API 에러
      if (error.status === 408 || error.message.includes("timeout")) {
        throw {
          type: "timeout",
          message: "API 호출 시간이 초과되었습니다. 다시 시도해주세요.",
        } as LLMError;
      }

      // 할당량 초과 에러 (429)
      if (error.status === 429) {
        throw {
          type: "api",
          message:
            "API 사용량 한도를 초과했습니다. OpenAI 계정의 결제 정보와 사용량을 확인해주세요.\n\n개발 중에는 Mock 모드를 사용하세요: EXPO_PUBLIC_USE_MOCK_API=true",
        } as LLMError;
      }

      if (error.status) {
        // 에러 메시지가 너무 길면 간단하게 표시
        const errorMessage =
          error.message.length > 200
            ? `API 오류 (${error.status}): ${error.message.substring(0, 200)}...`
            : `API 오류 (${error.status}): ${error.message}`;

        throw {
          type: "api",
          message: errorMessage,
        } as LLMError;
      }
    }

    // 네트워크 에러
    if (error instanceof Error) {
      if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        throw {
          type: "network",
          message: "네트워크 연결을 확인해주세요.",
        } as LLMError;
      }
    }

    // 기타 에러
    throw {
      type: "parse",
      message:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    } as LLMError;
  }
}
