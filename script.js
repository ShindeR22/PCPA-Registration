const form = document.querySelector("#registration-form");
const steps = [...document.querySelectorAll(".step")];
let currentStep = 1;

function showStep(nextStep) {
  currentStep = nextStep;
  document.querySelector(".app-shell").classList.toggle("pass-visible", currentStep === 3);
  steps.forEach((step) => {
    const active = Number(step.dataset.step) === currentStep;
    step.hidden = !active;
    step.classList.toggle("active", active);
  });
  document.querySelectorAll("[data-indicator]").forEach((indicator) => {
    const number = Number(indicator.dataset.indicator);
    indicator.classList.toggle("current", number === currentStep);
    indicator.classList.toggle("completed", number < currentStep);
  });
  document.querySelector(".registration-card").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function setError(field, message) {
  field.classList.toggle("invalid", Boolean(message));
  const error = document.querySelector(`#${field.id}-error`);
  if (error) error.textContent = message;
}

function createEntryCode() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `PCPA-26-${suffix}`;
}

document.querySelector("[data-next='1']").addEventListener("click", () => {
  const phone = document.querySelector("#phone");
  const digits = phone.value.replace(/\D/g, "");
  const phoneField = document.querySelector("#phone-field");
  const selectedRoles = [...document.querySelectorAll("input[name='roles']:checked")];
  const roleError = document.querySelector("#role-error");
  if (!/^[6-9]\d{9}$/.test(digits)) {
    phoneField.classList.add("invalid");
    document.querySelector("#phone-error").textContent = "Enter a valid 10-digit Indian mobile number.";
    phone.focus();
    return;
  }
  if (selectedRoles.length === 0) {
    roleError.textContent = "Select at least one role to continue.";
    document.querySelector(".role-fieldset").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  roleError.textContent = "";
  phoneField.classList.remove("invalid");
  document.querySelector("#phone-error").textContent = "";
  showStep(2);
});

document.querySelectorAll("input[name='roles']").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    document.querySelector("#role-error").textContent = "";
  });
});

document.querySelector("#phone").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
  document.querySelector("#phone-field").classList.remove("invalid");
  document.querySelector("#phone-error").textContent = "";
});

document.querySelector("[data-back='2']").addEventListener("click", () => showStep(1));
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const firstName = document.querySelector("#first-name");
  const lastName = document.querySelector("#last-name");
  const address = document.querySelector("#address");
  const cleanFirstName = firstName.value.trim();
  const cleanLastName = lastName.value.trim();
  const cleanAddress = address.value.trim();

  setError(firstName, cleanFirstName.length < 2 ? "Please enter your first name." : "");
  setError(lastName, cleanLastName.length < 2 ? "Please enter your last name." : "");
  setError(address, cleanAddress.length < 5 ? "Please enter your address." : "");

  if (cleanFirstName.length < 2 || cleanLastName.length < 2 || cleanAddress.length < 5) {
    [firstName, lastName, address].find((field) => field.classList.contains("invalid"))?.focus();
    return;
  }

  const entryCode = createEntryCode();
  document.querySelector("#entry-code").textContent = entryCode;
  document.querySelector("#pass-attendee").textContent = `${cleanFirstName} ${cleanLastName}`;
  const phoneDigits = document.querySelector("#phone").value.replace(/\D/g, "");
  const formattedPhone = `+91 ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`;
  document.querySelector("#pass-phone").textContent = formattedPhone;
  const qrData = encodeURIComponent(`PCPA-ENTRY:${entryCode}`);
  const qrImage = document.querySelector("#pass-qr");
  qrImage.crossOrigin = "anonymous";
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=png&margin=1&data=${qrData}`;
  showStep(3);
});

document.querySelectorAll("#first-name, #last-name, #address").forEach((field) => {
  field.addEventListener("input", () => setError(field, ""));
});

async function downloadPass(format) {
  const qrImage = document.querySelector("#pass-qr");
  try {
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
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(112, 112, 43, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#e1b83f";
    context.lineWidth = 4;
    context.stroke();
    context.strokeStyle = "#17365e";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(112, 108, 18, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(112, 108, 8, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = "#17365e";
    context.textAlign = "center";
    context.font = "700 12px Arial, sans-serif";
    context.fillText("PCPA", 112, 151);

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
    context.fillStyle = "#8a9ab0";
    context.font = "17px Arial, sans-serif";
    context.fillText("Visitor Entry Pass", 450, 1130);

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

document.querySelectorAll("[data-download-format]").forEach((button) => {
  button.addEventListener("click", () => downloadPass(button.dataset.downloadFormat));
});
