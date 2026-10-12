# Web Messenger Android — Feature Expanded

এই রিপোজিটরি Capacitor-ভিত্তিক Android অ্যাপ শেল। এতে বর্তমান মেসেঞ্জার HTML/JS বজায় রেখে মোবাইল-ফার্স্ট UI enhancement, in-chat message search, dark/light theme, settings panel এবং Android DownloadManager hook রাখা হয়েছে।

## GitHub build
1. এই ফোল্ডারের **ভেতরের সব ফাইল** রিপোজিটরির root-এ আপলোড করুন।
2. নিশ্চিত করুন `www/index.html`, `package.json`, `capacitor.config.json`, `scripts/prepare-android.mjs` এবং `.github/workflows/main.yml` root-relative সঠিক অবস্থানে আছে।
3. Actions → Build Android APK → Run workflow।
4. `Web-Messenger-debug-APK` artifact ডাউনলোড করুন।

## অন্তর্ভুক্ত UI ফিচার
- WhatsApp-inspired mobile layout এবং safe-area handling (মূল CSS-এ)
- বর্তমান লোড হওয়া কথোপকথনের live message search (Ctrl/Cmd+F-ও কাজ করে)
- persistent dark/light theme preference
- settings panel এবং notification permission request
- Android WebView download listener/DownloadManager
- Capacitor Local Notifications, Push Notifications, Filesystem ও Share plugin dependencies

## গুরুত্বপূর্ণ সীমাবদ্ধতা
এটি এখনও HTML UI-কে Android WebView-তে চালায়; সম্পূর্ণ Kotlin/Jetpack Compose native messenger নয়। Plugin dependency যোগ করলেই push notification বা call system নিজে থেকে কার্যকর হয় না। নির্ভরযোগ্য background push-এর জন্য Firebase project, FCM configuration, Android notification channel এবং backend push sender লাগবে। WebRTC calling-এর জন্য signaling server, STUN/TURN এবং lifecycle/audio routing বাস্তব ডিভাইসে পরীক্ষা করা দরকার। Call UI/logic বিদ্যমান server protocol-এর ওপর নির্ভরশীল।

## ফাইল ডাউনলোড
`prepare-android.mjs` Android WebView-এর download listener যুক্ত করে এবং DownloadManager ব্যবহার করে Downloads-এ ফাইল রাখে। সার্ভার যদি authentication cookie/header ছাড়া ফাইল না দেয়, server-side download endpoint-ও সংশোধন করতে হবে।

## Release APK
Workflow বর্তমানে unsigned/debug APK তৈরি করে। Play Store বা সাধারণ distribution-এর জন্য Android signing key এবং আলাদা release workflow প্রয়োজন। Secrets কখনো source code-এ রাখবেন না।


## Version 3 mobile/native UX improvements

- Added Capacitor App, Keyboard, StatusBar and SplashScreen packages and configuration.
- Improved safe-area handling, touch interactions, small-screen layout, input sizing and reduced-motion behavior.
- Existing chat protocol and server API remain the source of truth for messages, file access and calls.
- DownloadManager support requires the server file URL to return an accessible file response; authenticated/expired URLs may need server-side changes.
- Push notifications while the app is closed require Firebase Cloud Messaging credentials plus backend push delivery. Merely installing the plugin does not enable server push.
- Voice/video calling in background or incoming calls when the app is killed require native call integration and server signaling; this build does not claim WhatsApp-level background call parity.

Build: GitHub Actions → Build Android APK → Run workflow. Output is a debug APK for testing, not a signed release.

## Version 4 feature additions
- Export currently rendered/loaded chat messages to a UTF-8 TXT file.
- Test local notification action using the Capacitor Local Notifications plugin on Android; browser fallback uses the Web Notification API where supported.
- Share action using the platform share sheet when available, with clipboard fallback.
- These tools operate on currently loaded messages only. They do not export the full server archive or create background push delivery by themselves.

## V5 UI and server profile changes
- Removed the in-app username editor and in-app one-time pairing-code generator from the profile panel.
- Username display now uses the username/name fields provided by the server's `welcome` response or live app state; the app does not ask the user to invent a username.
- The sign-in pairing screen remains because the existing backend authentication protocol requires Machine ID + one-time pairing code for a new login. A saved session can resume without entering a new code when Stay logged in is enabled.
- Added a modern green/teal mobile-first visual layer while keeping the existing chat UI and message interaction handlers in place.
- Backend must include the account username in the `welcome` response (for example `username` or `displayName`) for the server-authoritative name to show accurately. If the backend omits it, the client can only show the fallback label.

## V6 messenger-parity additions (client-side only)
- Reply (context menu or swipe right on a message), Forward and Star (starred list is stored locally on the device).
- Replies/forwards are encoded as plain text prefixes, so the existing server protocol is unchanged; other clients see them as plain text.
- NOT possible without server.js changes: typing indicator, read receipts (blue ticks), reactions, edit message, last seen/online status, voice messages, video calls, background push. See the reply notes for the protocol additions needed.

## V7 (needs the patched server.js)
- Typing indicator (DM + groups), delivered (✓✓ grey) and read (✓✓ blue) receipts for private chats.
- Requires the updated server.js; with the old server these packets are simply ignored and the app behaves as in v6.
