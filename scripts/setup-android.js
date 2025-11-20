#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Android SDK 경로 찾기
const sdkPath =
  process.env.ANDROID_HOME ||
  (os.platform() === 'darwin'
    ? path.join(os.homedir(), 'Library/Android/sdk')
    : path.join(os.homedir(), 'Android/Sdk'));

if (!fs.existsSync(sdkPath)) {
  console.error('❌ Android SDK not found at:', sdkPath);
  console.error('Please set ANDROID_HOME environment variable or install Android Studio.');
  process.exit(1);
}

// android 디렉토리 확인
const androidDir = path.join(__dirname, '..', 'android');
if (!fs.existsSync(androidDir)) {
  console.warn('⚠️  android directory not found. Run "expo prebuild --platform android" first.');
  process.exit(0); // 에러 없이 종료 (prebuild가 아직 실행되지 않은 경우)
}

// local.properties 파일 생성 또는 업데이트
const localPropsPath = path.join(androidDir, 'local.properties');
const sdkDir = sdkPath.replace(/\\/g, '/'); // Windows 경로 처리
const content = `sdk.dir=${sdkDir}\n`;

// 기존 파일이 있고 내용이 같으면 스킵
if (fs.existsSync(localPropsPath)) {
  const existingContent = fs.readFileSync(localPropsPath, 'utf8');
  if (existingContent === content) {
    // 이미 올바른 설정이 있으면 스킵
    return;
  }
}

fs.writeFileSync(localPropsPath, content);
console.log('✅ Updated android/local.properties');
console.log('   SDK path:', sdkPath);

