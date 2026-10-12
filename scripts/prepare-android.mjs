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
  "android.permission.CAMERA"
];
for (const permission of permissions) {
  const tag = `<uses-permission android:name="${permission}" />`;
  if (!xml.includes(`android:name="${permission}"`)) {
    xml = xml.replace(/<application\b/, `${tag}\n    <application`);
  }
}
fs.writeFileSync(manifest, xml);
console.log("Added internet, microphone and camera permissions to Android manifest.");
