# Vocabo AI Task App

## Project Overview
This is a React Native Expo application built with TypeScript and a feature-based architecture.
It demonstrates a modular social feed flow with Firebase authentication, posts listing, post details, likes/comments persistence, reusable UI primitives, caching, and typed navigation.

## Tech Stack
- Expo
- React Native
- TypeScript (strict mode)
- Firebase Auth
- React Navigation (native stack + bottom tabs)
- React Native Reanimated
- AsyncStorage

## Architecture Explanation
### Feature-Based Structure
```text
src/
  app/            # Navigation and app-level composition
  features/       # Domain features (auth, posts, profile)
  components/     # Reusable UI components
  hooks/          # Reusable stateful logic
  services/       # API, auth, cache abstractions
  theme/          # Design tokens and theme object
  types/          # Shared TypeScript contracts
  utils/          # Pure helpers and app utilities
```

### Separation Of Concerns
- UI components handle rendering only.
- Hooks encapsulate UI-facing logic and local state.
- Services isolate external dependencies (Firebase, network, cache).
- Types and utils stay framework-agnostic to maximize reuse.

### Caching Strategy
- `cache.service` stores API payloads in AsyncStorage with TTL.
- `usePosts` and `usePostDetail` read cache first, then fallback to API.
- Expired cache entries are automatically invalidated.

### Firebase Abstraction
- `firebase.config.ts` initializes app/auth from environment variables.
- `auth.service.ts` centralizes login/register/logout/auth subscription.
- Hooks (`useAuth`, `useLogin`, `useRegister`) consume the service layer instead of Firebase directly.

## Setup Instructions
### Prerequisites
- Node.js LTS
- npm
- Xcode (iOS) and/or Android Studio (Android)
- Expo CLI support via `npx expo`

### Firebase Setup
1. Create a Firebase project.
2. Enable Email/Password authentication.
3. Add app credentials to Expo public env variables.
4. Download and place platform config files as needed by Firebase.

### Environment Configuration
Create `.env` (or use Expo env injection) with:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

### Install And Run
```bash
npm install
npm run start
```
or
```bash
npm run android
npm run ios
```

## APK Build Instructions
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

## AI Usage Transparency
- AI assistance was used to scaffold architecture, generate repetitive boilerplate, and draft reusable component/service patterns.
- All generated code was manually reviewed, adapted, and validated for strict TypeScript, architecture consistency, and runtime integration.
- Final structure and implementation decisions were verified against project requirements.

## Suggested Commit Sequence
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
