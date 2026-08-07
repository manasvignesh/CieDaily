# CIE Connect - Android APK Build & Installation Guide

This guide explains how to build the standalone Android APK for **CIE Connect** so you can install and test it directly on your Android phone.

## Prerequisites
- Node.js (v18+) and pnpm
- Android SDK / Build Tools (or EAS CLI for cloud builds)

---

### Option 1: Fast Cloud Build via EAS (Recommended & Easiest)
You can build the APK instantly in the cloud using Expo Application Services (EAS) without needing a heavy local Android SDK installation:

1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Configure your EAS project:
   ```bash
   eas build:configure
   ```
4. Build the Android APK:
   ```bash
   eas build --platform android --profile preview
   ```
5. Once complete, EAS will provide a direct download link and QR code to install the APK directly on your Android device!

---

### Option 2: Local Gradle Build
If you have Android Studio / Android SDK installed locally:

1. Run the included prebuild script:
   ```bash
   bash scripts/build-apk.sh
   ```
2. The compiled debug APK will be generated at:
   `/home/ubuntu/cie-connect/android/app/build/outputs/apk/debug/app-debug.apk`
3. Transfer `app-debug.apk` to your phone and install it.
