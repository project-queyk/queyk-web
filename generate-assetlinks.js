import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let fingerprint = process.env.SHA256_FINGERPRINT;

if (!fingerprint) {
  const envPath = path.join(__dirname, ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const match = envContent.match(/SHA256_FINGERPRINT=(.+)/);
    if (match) {
      fingerprint = match[1].trim();
    }
  }
}

if (!fingerprint) {
  console.error("SHA256_FINGERPRINT environment variable is not set");
  process.exit(1);
}

const assetlinks = [
  {
    relation: [
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds",
    ],
    target: {
      namespace: "android_app",
      package_name: "com.luiscabantac.Queyk",
      sha256_cert_fingerprints: [fingerprint],
    },
  },
];

const dir = path.join(__dirname, "public", ".well-known");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(
  path.join(dir, "assetlinks.json"),
  JSON.stringify(assetlinks, null, 2),
);
