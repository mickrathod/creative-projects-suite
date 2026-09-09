import QRCode from 'qrcode';

/**
 * Generate a QR Code as a Data URL
 * @param {string} text - URL or text to encode
 * @param {object} options - QRCode options
 * @returns {Promise<string>} Data URL
 */
export async function generateQRDataUrl(text, options = {}) {
  try {
    const opts = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      width: 256,
      ...options
    };
    return await QRCode.toDataURL(text || window.location.href, opts);
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return '';
  }
}

/**
 * Draw QR Code to a canvas element
 */
export async function renderQRToCanvas(canvas, text, options = {}) {
  if (!canvas) return;
  try {
    const opts = {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      width: 200,
      ...options
    };
    await QRCode.toCanvas(canvas, text || window.location.href, opts);
  } catch (err) {
    console.error('Error drawing QR code to canvas:', err);
  }
}
