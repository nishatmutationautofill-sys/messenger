# Web Messenger — Android APK project

এই প্রজেক্টে আপনার দেওয়া `web-messenger(1).html` ফাইলটি Capacitor Android অ্যাপের ভিতরে রাখা হয়েছে। GitHub Actions দিয়ে Android **debug APK** তৈরি হবে।

## GitHub দিয়ে APK বানানোর নিয়ম

1. GitHub-এ নতুন একটি **Public** বা **Private** repository তৈরি করুন।
2. এই ZIP ফাইলটি Extract করে ভিতরের সব ফাইল repository-তে upload/commit করুন। `package.json`, `capacitor.config.json`, `www/` এবং `.github/` যেন repository root-এ থাকে।
3. GitHub repository-তে **Actions** ট্যাব খুলুন।
4. `Build Android APK` workflow নির্বাচন করে **Run workflow** চাপুন। `main`/`master` branch-এ push করলেও workflow চলবে।
5. কাজ শেষ হলে workflow run-এর নিচের **Artifacts** থেকে `Web-Messenger-debug-APK` ডাউনলোড করুন।
6. ZIP artifact Extract করলে `app-debug.apk` পাবেন। Android ফোনে ইনস্টল করার সময় প্রয়োজন হলে “Install unknown apps” অনুমতি দিন।

## অ্যাপের সংযোগ ও কল

- এই HTML-এ থাকা pairing flow ব্যবহার করতে মূল সফটওয়্যারের Messenger → Name & ID থেকে Machine ID ও একবার ব্যবহারযোগ্য ৮ সংখ্যার pairing code নিতে হবে।
- HTML-এর বর্তমান কোড Firestore config `nishatmutationautofill-3bde4` থেকে `serverUrl` পড়ে এবং WebSocket `/ws`-এ যুক্ত হয়। সার্ভার/Firestore config সচল না থাকলে অ্যাপ লগইন বা মেসেজিং করতে পারবে না।
- HTTPS/WSS সার্ভার আবশ্যক। Android WebView-এর ভিতরে microphone/camera permission চাওয়া হলে অনুমতি দিন।
- Stay logged in ব্যবহার করলে pairing session ডিভাইসের WebView local storage-এ থাকে। Logout করলে সেভ করা session সরানো হয়।

## গুরুত্বপূর্ণ সীমাবদ্ধতা

- এটি **debug APK**; Play Store বা বিতরণের জন্য production-signed release APK নয়। Release build-এর জন্য keystore/signing configuration যোগ করতে হবে।
- GitHub build সফল হওয়া মানেই আপনার live chat backend, pairing, file upload, group/private chat বা voice call সার্ভারে end-to-end পরীক্ষা হয়েছে—এমন নয়। সেগুলো কার্যকর হতে বিদ্যমান backend protocol ও server configuration ঠিক থাকতে হবে।
- Android WebView-এ voice call-এর জন্য microphone permission manifest-এ যোগ করা হয়েছে; কিন্তু নির্দিষ্ট Android/WebView ডিভাইসে WebRTC permission prompt আচরণ আলাদাভাবে পরীক্ষা করা প্রয়োজন।
- Firebase/server secret এই repository-তে যোগ করবেন না। Pairing code কাউকে দেবেন না।

## প্রজেক্ট কাঠামো

```text
web-messenger-android/
├── .github/workflows/build-apk.yml
├── scripts/prepare-android.mjs
├── www/index.html
├── capacitor.config.json
├── package.json
└── README.md
```

Android native project GitHub Actions-এ `npx cap add android` দিয়ে তৈরি হয়; ফলে Android Studio project হাতে করে commit করার প্রয়োজন নেই।
