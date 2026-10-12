import fs from "node:fs";
import path from "node:path";

const manifest = path.resolve("android/app/src/main/AndroidManifest.xml");
if (!fs.existsSync(manifest)) {
  console.error("AndroidManifest.xml not found. Run `npx cap add android` first.");
  process.exit(1);
}
let xml = fs.readFileSync(manifest, "utf8");
const permissions = [
  "android.permission.INTERNET",
  "android.permission.RECORD_AUDIO",
  "android.permission.MODIFY_AUDIO_SETTINGS",
  "android.permission.CAMERA",
  "android.permission.POST_NOTIFICATIONS",
  "android.permission.VIBRATE",
  "android.permission.WAKE_LOCK"
];
for (const permission of permissions) {
  const tag = `<uses-permission android:name="${permission}" />`;
  if (!xml.includes(`android:name="${permission}"`)) {
    xml = xml.replace(/<application\b/, `${tag}\n    <application`);
  }
}
fs.writeFileSync(manifest, xml);

// Capacitor WebView does not automatically handle HTML download links on Android.
// Add a native DownloadManager listener so file attachments can be saved to Downloads.
const javaRoot = path.resolve("android/app/src/main/java");
function findMainActivity(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      const found = findMainActivity(full);
      if (found) return found;
    } else if (ent.name === "MainActivity.java") return full;
  }
  return null;
}
const mainActivity = fs.existsSync(javaRoot) ? findMainActivity(javaRoot) : null;
if (!mainActivity) {
  console.error("MainActivity.java not found; Android download listener was not installed.");
  process.exit(1);
}
let java = fs.readFileSync(mainActivity, "utf8");
const imports = [
  "import android.app.DownloadManager;",
  "import android.content.Context;",
  "import android.net.Uri;",
  "import android.os.Environment;",
  "import android.webkit.CookieManager;",
  "import android.webkit.URLUtil;",
  "import android.webkit.WebView;",
  "import android.webkit.DownloadListener;"
];
for (const imp of imports) {
  if (!java.includes(imp)) java = java.replace(/^(package [^;]+;\s*)/m, `$1\n${imp}`);
}
if (!java.includes("setDownloadListener")) {
  const hook = `
        WebView webView = getBridge().getWebView();
        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
            try {
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                String cookies = CookieManager.getInstance().getCookie(url);
                if (cookies != null) request.addRequestHeader("Cookie", cookies);
                if (userAgent != null) request.addRequestHeader("User-Agent", userAgent);
                request.setMimeType(mimeType);
                request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimeType));
                request.setDescription("Downloading attachment…");
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, URLUtil.guessFileName(url, contentDisposition, mimeType));
                DownloadManager manager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                manager.enqueue(request);
            } catch (Exception e) {
                android.util.Log.e("WebMessenger", "Download failed", e);
            }
        });
`;
  if (!java.includes("onCreate(")) {
    java = java.replace(/public class MainActivity extends BridgeActivity\s*\{/, match => match + `\n    @Override\n    public void onCreate(android.os.Bundle savedInstanceState) {\n        super.onCreate(savedInstanceState);${hook}    }\n`);
  } else {
    java = java.replace(/super\.onCreate\(savedInstanceState\);/, match => match + hook);
  }
}
fs.writeFileSync(mainActivity, java);
console.log("Added internet, microphone, camera permissions and native Android download support.");
