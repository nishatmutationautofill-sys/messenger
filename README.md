# Web Messenger Android

Capacitor-based Android app project built around the supplied Web Messenger client. The Android package includes native Android download handling through `DownloadManager`, microphone/camera/internet permissions, and a GitHub Actions workflow that builds a debug APK.

## Build on GitHub

1. Upload the contents of this directory to the **root** of your GitHub repository (not inside `.github/workflows`).
2. Ensure `www/index.html`, `package.json`, `capacitor.config.json`, `scripts/prepare-android.mjs`, and `.github/workflows/main.yml` are at the paths shown in the repository tree.
3. Open **Actions → Build Android APK → Run workflow**.
4. Download the `Web-Messenger-debug-APK` artifact and extract `app-debug.apk`.

## Important behavior and requirements

- This is an Android hybrid app: the existing messenger client runs inside Android's WebView, with native Android download handling. It is not a complete Kotlin-native UI rewrite.
- File downloads use Android's `DownloadManager` when the app triggers a direct download link. The server must allow `/f/<file-id>?dl=1` to be downloaded by the authenticated client; if the server requires custom upload/auth headers, its download endpoint must support an authorized download URL or a native authenticated download implementation.
- Foreground chat and WebRTC calling depend on the existing WebSocket/backend signaling server and HTTPS/TLS configuration.
- True background incoming-message/call notifications require Firebase Cloud Messaging (FCM), Firebase app configuration, and backend code to send push notifications. Those cannot be enabled just by changing the Android UI/workflow; do not expect WhatsApp-like background push notifications until these are configured.
- Android 13+ notification permission is declared. Runtime notification prompting and FCM delivery must be implemented/configured for actual push notifications.
- Test microphone, camera, calls, file downloads, reconnect, and Android background behavior on a real device. Build success alone does not verify backend behavior.
- GitHub Actions creates a **debug APK**, not a Play Store release-signed APK.
