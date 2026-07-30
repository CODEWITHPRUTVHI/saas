import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = Buffer.from(
  (process.env.ENCRYPTION_KEY || "drox_super_secret_encryption_32b!").padEnd(32, "0").slice(0, 32)
);

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  authTag: string;
}

export function encryptToken(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return JSON.stringify({
    ciphertext: encrypted,
    iv: iv.toString("hex"),
    authTag,
  });
}

export function decryptToken(encryptedString: string): string {
  try {
    const { ciphertext, iv, authTag }: EncryptedData = JSON.parse(encryptedString);
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      ENCRYPTION_KEY,
      Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(ciphertext, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    // Fallback for legacy plain text mock tokens
    return encryptedString;
  }
}
