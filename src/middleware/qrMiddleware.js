// qrMiddleware.js
import QRCode from "qrcode";

/**
 * generateQRCode
 * @param {Object} user - user object containing uuid + other data
 * @returns {Promise<string>} - Data URL for the QR code
 */
export async function generateQRCode(user) {
  try {
    // Embed whatever user data you want inside the QR
    const payload = {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      memberLevel: user.memberLevel,
      timestamp: Date.now()
    };

    const qrString = JSON.stringify(payload);

    const qrDataUrl = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: "M",
      width: 300
    });

    return qrDataUrl;
  } catch (err) {
    console.error("QR generation error:", err);
    throw err;
  }
}