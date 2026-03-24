# Vocabo AI Task App

## 1) Project Overview
Vocabo AI Task App is a React Native application built with Expo and TypeScript using a feature-oriented architecture. It demonstrates a production-style mobile flow with authentication, feed listing, post details, likes/comments interactions, reusable UI primitives, and cached data access.

The codebase is organized for maintainability: screens and feature logic are separated, external services are abstracted, and shared modules are centralized for reuse.

## 2) Tech Stack
- Expo
- React Native
- TypeScript
- Firebase (Auth + project configuration)
- React Navigation
- React Native Reanimated
- AsyncStorage (cache persistence)

## 3) Architecture Explanation
### Feature-based folder structure diagram
```text
src/
  app/                  # App bootstrap and navigation composition
  components/           # Reusable UI building blocks
  features/
    auth/               # Auth screens/components specific to auth feature
    posts/              # Post list/detail screens and feature-level UI
    profile/            # Profile feature UI
  hooks/                # Reusable app hooks (auth, posts, post detail, etc.)
  services/
    api/                # API client and posts service
    auth/               # Auth service abstraction
    firebase/           # Firebase app/auth config
  theme/                # Colors, spacing, typography, reusable theme tokens
  types/                # Shared TypeScript domain contracts
  utils/                # Reusable helpers/constants
  firebase/             # Native firebase config files (platform files)
```

### Separation of concerns: UI / Hooks / Services
- UI layers (`components`, feature screens) are focused on presentation and user interaction.
- Hooks (`useAuth`, `usePosts`, `usePostDetail`, `useLikeComment`) orchestrate state, loading, and side-effects for UI.
- Services (`services/*`) encapsulate network, Firebase auth, and persistence details so hooks/screens stay framework-friendly and testable.

### How caching works
- The cache layer uses `AsyncStorage` through `services/cache.service.ts`.
- `setCache` stores payloads with an `expiresAt` timestamp (TTL-based invalidation).
- `getCache` returns cached data when valid; expired entries are removed automatically.
- Features that fetch posts can use this mechanism to reduce repeated network requests and improve perceived performance.

### How Firebase is abstracted
- Firebase app config is isolated in `services/firebase/firebase.config.ts`, reading credentials from `EXPO_PUBLIC_*` environment variables.
- Authentication operations are centralized in `services/auth/auth.service.ts` (login, register, auth-state subscription, logout, Google sign-in).
- Hooks and feature screens consume service functions rather than calling Firebase SDK methods directly, keeping Firebase dependencies localized.

## 4) Setup Instructions
### Prerequisites
- Node.js (LTS recommended)
- npm
- Expo-compatible local setup (`npx expo`)
- Android Studio and/or Xcode for device/simulator builds
- Firebase project with Authentication enabled

### Firebase setup steps
1. Create a Firebase project in the Firebase Console.
2. Enable `Authentication > Sign-in method > Email/Password`.
3. Register the Android/iOS apps in Firebase (if using native runs/builds).
4. Keep platform config files available:
   - Android: `google-services.json`
   - iOS: `GoogleService-Info.plist`
5. (Optional for Google sign-in) Configure web client ID and add it to environment variables.

### `.env` configuration
Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
```

### Install and run
```bash
npm install
npm run start
```

Useful alternatives:
```bash
npm run android
npm run ios
```

## 5) APK Build Instructions (`eas build`)
1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Authenticate with Expo:
   ```bash
   eas login
   ```
3. Configure EAS for the project:
   ```bash
   eas build:configure
   ```
4. Create an Android build:
   ```bash
   eas build -p android --profile preview
   ```
5. Download the generated artifact from the Expo build link.

## 6) AI Usage Transparency
- AI assistance was used for drafting repetitive boilerplate, suggesting architecture shape, and accelerating documentation scaffolding.
- Every AI-generated or AI-assisted output was manually reviewed, integrated, and adjusted to match project requirements and actual runtime behavior.
- Final implementation understanding was validated by reading the relevant files/services, checking integration boundaries, and running the app workflow.

## Suggested Git Commit Sequence (Conventional Commits)
- `chore: init expo project with typescript template`
- `chore: setup folder structure and theme system`
- `feat: add reusable UI components (Button, Input, Card, Avatar)`
- `feat: add firebase auth service abstraction`
- `feat: add API client and posts service with caching`
- `feat: add custom hooks (useAuth, usePosts, useLikeComment)`
- `feat: setup react navigation with auth flow`
- `feat: implement login and register screens`
- `feat: implement posts list screen with skeleton loading`
- `feat: implement post detail with like and comment system`
- `feat: add profile screen with logout`
- `chore: add error boundary and utility helpers`
- `docs: add README with architecture explanation`
