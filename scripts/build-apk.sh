#!/usr/bin/env bash
set -e

echo "=========================================="
echo "CIE Connect - Android APK Local Build Tool"
echo "=========================================="

cd /home/ubuntu/cie-connect

echo "[1/3] Generating native Android project via Expo Prebuild..."
npx expo prebuild --platform android --clean

echo "[2/3] Building debug APK with Gradle..."
cd android
./gradlew assembleDebug

echo "[3/3] APK Build Complete!"
echo "------------------------------------------"
echo "Your APK is located at:"
echo "/home/ubuntu/cie-connect/android/app/build/outputs/apk/debug/app-debug.apk"
echo "=========================================="
