const qrCodePage = (svgMarkup, userId) => `
<main>
  <section class="qr-section">
    <h1>Your Personal QR Code</h1>
    <div class="qr-container">
      
      <!-- Insert SVG directly -->
      <div class="qr-image">${svgMarkup}</div>

      <p class="user-id">User ID: ${userId}</p>
      <p class="qr-instructions">
        Scan this QR code at the gym entrance for quick check-in.
      </p>

      <button onclick="downloadQR()" class="download-btn">
        <i data-lucide="download"></i>
        Download QR Code
      </button>
    </div>
  </section>
</main>

<script>
function downloadQR() {
  const svgEl = document.querySelector('.qr-image').innerHTML;
  const blob = new Blob([svgEl], { type: 'image/svg+xml' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gym-qr-code.svg';
  link.click();
}
</script>
`;

export default qrCodePage;
