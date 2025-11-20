## 문제 정의 및 기능 구성 근거

### 문제 정의

사용자 개개인의 건강 상태, 생활 습관, 복용 약물은 상이함에도 불구하고, 일반적인 영양제 추천 서비스는 포괄적이고 일률적입니다. 이는 사용자가 실제로 필요하지 않은 제품을 구매하게 만들거나, 특정 상태에 적합하지 않은 영양제를 섭취하게 하는 위험이 있습니다.

### 해결 방안

본 프로젝트는 사용자의 건강 정보를 직접 입력받고, LLM을 활용하여 맞춤형 영양제 조합과 그 추천 근거를 제공하는 모바일 애플리케이션을 구현합니다. 사용자는 스스로 건강 상태를 입력하고, 앱은 LLM으로부터 구조화된 영양제 추천 결과를 제공합니다.

### 기능 구성 근거

1. **건강 정보 입력 화면**: 사용자의 나이, 성별, 체중, 복용 약물, 건강 고민, 생활 패턴을 체계적으로 수집하여 개인화된 추천의 기반을 마련합니다.

2. **LLM 기반 추천 시스템**: 일반적인 규칙 기반 추천이 아닌 LLM을 활용하여 사용자의 복합적인 건강 상태를 종합적으로 분석하고 맞춤형 추천을 제공합니다.

3. **구조화된 응답 파싱**: LLM의 자유 형식 응답을 JSON으로 구조화하여 파싱하고 검증함으로써 안정적이고 일관된 사용자 경험을 보장합니다.

4. **에러 처리 및 재시도**: 네트워크 오류, API 할당량 초과, 파싱 실패 등 다양한 에러 상황에 대한 명확한 안내와 재시도 기능을 제공합니다.

## 기술 스택 및 환경 정보

### 프론트엔드

- **React Native**: 0.76.5
- **Expo**: ~52.0.0
- **TypeScript**: ~5.3.3
- **React**: 18.3.1

### 상태 관리 및 폼

- **React Hook Form**: ^7.53.0
- **@hookform/resolvers**: ^3.9.0

### 검증

- **Zod**: ^3.23.8

### 네비게이션

- **@react-navigation/native**: ^6.1.0
- **@react-navigation/native-stack**: ^6.11.0

### API 통신

- **OpenAI**: ^6.9.1 (공식 라이브러리)

### 테스팅

- **Jest**: ^29.7.0
- **jest-expo**: ~52.0.0
- **@testing-library/react-native**: ^12.4.0
- **ts-jest**: ^29.2.5

### 개발 환경

- **Node.js**: 22.x (nvm 사용)
- **npm**: 패키지 관리자
- **TypeScript**: Strict 모드 활성화

### 빌드 환경

- **Android**: Android Studio, Gradle, JDK
- **iOS**: Xcode, CocoaPods (macOS만)

## 프로젝트 구조

```
algo/
├── src/
│   ├── features/              # 기능별 모듈
│   │   ├── intake/            # 건강 정보 입력 기능
│   │   │   ├── IntakeScreen.tsx
│   │   │   ├── intake.schema.ts
│   │   │   └── intake.types.ts
│   │   └── recommendation/    # 추천 결과 기능
│   │       ├── RecommendationScreen.tsx
│   │       ├── RecommendationPendingScreen.tsx
│   │       └── ErrorScreen.tsx
│   ├── libs/                  # 공통 라이브러리
│   │   ├── api/               # API 관련
│   │   │   ├── llmClient.ts
│   │   │   ├── llm.prompt.ts
│   │   │   ├── llm.parser.ts
│   │   │   ├── llm.schema.ts
│   │   │   └── llm.types.ts
│   │   └── ui/                # UI 컴포넌트
│   │       ├── Input.tsx
│   │       ├── TextArea.tsx
│   │       ├── Button.tsx
│   │       ├── GenderRadio.tsx
│   │       ├── BooleanRadio.tsx
│   │       ├── MultiSelect.tsx
│   │       └── SupplementCard.tsx
│   ├── navigation/            # 네비게이션 설정
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   └── tests/                 # 테스트 파일
│       ├── llm.parser.test.ts
│       └── intake.schema.test.ts
├── scripts/                   # 빌드 스크립트
│   └── setup-android.js
├── App.tsx                    # 앱 진입점
├── index.js                   # Expo 진입점
├── package.json
├── tsconfig.json
├── app.json                   # Expo 설정
```

### 디렉토리 구조 설명

- **features/**: 기능별로 분리된 모듈. 각 기능은 독립적으로 관리되며, 스키마, 타입, 화면 컴포넌트를 포함합니다.
- **libs/api/**: LLM API 호출, 프롬프트 생성, 응답 파싱 및 검증 로직을 담당합니다.
- **libs/ui/**: 재사용 가능한 UI 컴포넌트들로, React.memo를 활용하여 성능을 최적화했습니다.
- **navigation/**: React Navigation을 사용한 화면 간 이동 및 타입 안전한 파라미터 전달을 관리합니다.
- **tests/**: 단위 테스트 파일들로, 주요 비즈니스 로직의 검증을 담당합니다.

## 빌드 및 실행 방법

### 사전 요구사항

- Node.js 22.x (nvm 사용 권장)
- npm 또는 yarn
- Android 빌드: Android Studio, Android SDK, JDK
- iOS 빌드: macOS, Xcode, CocoaPods

### 설치

```bash
# Node.js 버전 설정
nvm use 22

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# Expo 개발 서버 시작
npm start

# 또는 특정 플랫폼으로 실행
npm run android  # Android 에뮬레이터/기기
npm run ios      # iOS 시뮬레이터 (macOS만)
```

### 빌드

#### Android

```bash
# Release APK 빌드
npm run build:android

# 빌드 결과물 위치
# android/app/build/outputs/apk/release/app-release.apk
```

빌드 프로세스:

1. `expo prebuild --platform android` - 네이티브 프로젝트 생성
2. `scripts/setup-android.js` - Android SDK 경로 자동 설정
3. `gradlew assembleRelease` - Release APK 빌드

#### iOS (macOS만)

```bash
# iOS Archive 빌드
npm run build:ios
```

빌드 프로세스:

1. `expo prebuild --platform ios` - 네이티브 프로젝트 생성
2. `xcodebuild` - Archive 생성

**참고**:

- `build:android`와 `build:ios` 명령어는 자동으로 `prebuild`를 실행하고 필요한 설정을 수행합니다.
- Android SDK 경로는 `expo prebuild` 후 자동으로 `android/local.properties`에 설정됩니다.
- Android SDK가 기본 위치(`~/Library/Android/sdk` 또는 `~/Android/Sdk`)에 없으면 `ANDROID_HOME` 환경 변수를 설정하세요:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
  export ANDROID_HOME=$HOME/Android/Sdk           # Linux
  export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
  ```

## API 키 설정 방법

### OpenAI API 키 설정

1. `.env` 파일을 프로젝트 루트에 생성합니다:

```bash
EXPO_PUBLIC_OPENAI_API_KEY=your_api_key_here
EXPO_PUBLIC_OPENAI_MODEL=gpt-4o-mini
EXPO_PUBLIC_USE_MOCK_API=false
```

2. 환경 변수 설명:
   - `EXPO_PUBLIC_OPENAI_API_KEY`: OpenAI API 키 (필수)
   - `EXPO_PUBLIC_OPENAI_MODEL`: 사용할 모델명 (기본값: `gpt-4o-mini`)
   - `EXPO_PUBLIC_USE_MOCK_API`: Mock 모드 사용 여부 (기본값: `false`)

3. **중요**: Expo에서는 클라이언트 측에서 접근 가능한 환경 변수는 반드시 `EXPO_PUBLIC_` 접두사를 사용해야 합니다.

### Mock 모드 사용

개발 중이거나 API 키가 없는 경우 Mock 모드를 사용할 수 있습니다:

```bash
EXPO_PUBLIC_USE_MOCK_API=true
```

Mock 모드에서는 실제 API 호출 없이 미리 정의된 추천 결과를 반환합니다.

### API 키 보안

- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 프로덕션 배포 시에는 EAS Secrets 또는 다른 안전한 방법으로 환경 변수를 관리하세요.

## 테스트

### 테스트 실행

```bash
# 모든 테스트 실행
npm test

# Watch 모드
npm test -- --watch

# 커버리지 확인
npm test -- --coverage
```

### 단위 테스트

#### 1. LLM 응답 파서 테스트 (`src/tests/llm.parser.test.ts`)

LLM 응답의 JSON 파싱 및 검증 로직을 테스트합니다:

- 정상적인 JSON 응답 파싱
- 마크다운 코드 블록이 포함된 응답 처리
- 주변 텍스트가 포함된 응답에서 JSON 추출
- 잘못된 JSON 형식에 대한 fallback 처리
- 빈 supplements 배열 처리
- 필수 필드 누락 처리

#### 2. 입력 검증 스키마 테스트 (`src/tests/intake.schema.test.ts`)

사용자 입력 데이터의 유효성 검증을 테스트합니다:

- 정상적인 입력 검증
- 나이 필드 검증 (음수, 0, 범위 초과, 소수점, 누락)
- 성별 필드 검증 (유효하지 않은 값, 누락)
- 체중 필드 검증 (음수, 범위 초과, 누락)
- 문자열 필드 길이 제한 (500자)
- 타입 불일치 검증

### 테스트 커버리지

주요 비즈니스 로직에 대한 테스트 커버리지를 유지합니다:

- LLM 응답 파싱: 100%
- 입력 검증: 100%
- 에러 처리: 주요 시나리오 커버
