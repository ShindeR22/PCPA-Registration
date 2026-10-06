async function downloadPass(format) {
  const qrImage = document.querySelector("#pass-qr");
  try {
    const logoImage = new Image();
    logoImage.src = new URL("../logos/Logo%20pcmc.png", import.meta.url).href;
    if (!logoImage.complete) {
      await new Promise((resolve, reject) => {
        logoImage.addEventListener("load", resolve, { once: true });
        logoImage.addEventListener("error", reject, { once: true });
      });
    }
    if (!logoImage.naturalWidth) throw new Error("Association logo did not load");

    const shutterCloudLogo = new Image();
    shutterCloudLogo.src = new URL("../logos/shuttercloud-logo.png", import.meta.url).href;
    if (!shutterCloudLogo.complete) {
      await new Promise((resolve, reject) => {
        shutterCloudLogo.addEventListener("load", resolve, { once: true });
        shutterCloudLogo.addEventListener("error", reject, { once: true });
      });
    }
    if (!shutterCloudLogo.naturalWidth) throw new Error("ShutterCloud logo did not load");

    if (!qrImage.complete) {
      await new Promise((resolve, reject) => {
        qrImage.addEventListener("load", resolve, { once: true });
        qrImage.addEventListener("error", reject, { once: true });
      });
    }
    if (!qrImage.naturalWidth) throw new Error("QR image did not load");

    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1200;
    const context = canvas.getContext("2d");
    const navy = "#102c54";
    context.fillStyle = "#f1f5fa";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.fillRect(38, 38, 824, 1124);

    context.fillStyle = navy;
    context.fillRect(38, 38, 824, 205);
    context.drawImage(logoImage, 48, 63, 150, 100);

    context.fillStyle = "#bcd0e9";
    context.font = "600 18px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText("PIMPRI CHINCHWAD PHOTOGRAPHER ASSOCIATION", 450, 93, 540);
    context.fillStyle = "#ffffff";
    context.font = "700 39px Arial, sans-serif";
    context.fillText("PHOTO & VIDEO EXHIBITION", 450, 164);
    context.fillStyle = "#54a4ff";
    context.fillRect(310, 197, 280, 6);

    context.fillStyle = "#17365e";
    context.font = "700 31px Arial, sans-serif";
    context.fillText("VISITOR ENTRY PASS", 450, 301);
    context.drawImage(qrImage, 305, 340, 290, 290);

    context.textAlign = "center";
    context.fillStyle = "#8291a5";
    context.font = "700 20px Arial, sans-serif";
    context.fillText("ENTRY CODE", 450, 694);
    context.fillStyle = navy;
    context.font = "700 43px Arial, sans-serif";
    context.fillText(document.querySelector("#entry-code").textContent, 450, 751);

    context.fillStyle = "#8291a5";
    context.font = "700 19px Arial, sans-serif";
    context.fillText("PASS HOLDER", 450, 819);
    context.fillStyle = "#263c5d";
    context.font = "600 34px Arial, sans-serif";
    context.fillText(document.querySelector("#pass-attendee").textContent, 450, 870, 740);

    context.fillStyle = "#8291a5";
    context.font = "700 18px Arial, sans-serif";
    context.fillText("PHONE NUMBER", 450, 914);
    context.fillStyle = "#263c5d";
    context.font = "600 25px Arial, sans-serif";
    context.fillText(document.querySelector("#pass-phone").textContent, 450, 950);
    context.fillStyle = "#4d6687";
    context.font = "600 22px Arial, sans-serif";
    context.fillText("1 November 2026", 450, 1000);
    context.strokeStyle = "#d8e3ef";
    context.setLineDash([10, 9]);
    context.beginPath();
    context.moveTo(90, 1032);
    context.lineTo(810, 1032);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = "#627792";
    context.font = "20px Arial, sans-serif";
    context.fillText("Present this QR code at the entrance for check-in.", 450, 1082);
    const poweredLabel = "POWERED BY";
    const brandName = "Shutter";
    const brandSuffix = "Cloud";
    const footerGap = 8;
    context.fillStyle = "#8a9ab0";
    context.font = "600 16px Arial, sans-serif";
    const poweredWidth = context.measureText(poweredLabel).width;
    context.fillStyle = "#233d65";
    context.font = "700 19px Arial, sans-serif";
    const brandWidth =
      context.measureText(brandName).width + context.measureText(brandSuffix).width;
    const logoWidth = 30;
    const logoGap = 6;
    let footerX = 450 - (poweredWidth + footerGap + logoGap + logoWidth + footerGap + brandWidth) / 2;
    context.textAlign = "left";
    context.font = "600 16px Arial, sans-serif";
    context.fillText(poweredLabel, footerX, 1130);
    footerX += poweredWidth + footerGap;
    context.drawImage(shutterCloudLogo, footerX, 1110, logoWidth, 21);
    footerX += logoWidth + logoGap;
    context.font = "700 19px Arial, sans-serif";
    context.fillText(brandName, footerX, 1130);
    footerX += context.measureText(brandName).width;
    context.fillStyle = "#3285df";
    context.fillText(brandSuffix, footerX, 1130);

    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const extension = format === "jpeg" ? "jpg" : "png";
    canvas.toBlob((blob) => {
      if (!blob) {
        alert("Could not create the pass image. Please try again.");
        return;
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${document.querySelector("#entry-code").textContent}.${extension}`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }, mimeType, 0.94);
  } catch (error) {
    alert("The QR code could not be loaded. Please check your internet connection and try again.");
  }
}

export function initPassDownload() {
  document.querySelectorAll("[data-download-format]").forEach((button) => {
    button.addEventListener("click", () => downloadPass(button.dataset.downloadFormat));
  });
}
