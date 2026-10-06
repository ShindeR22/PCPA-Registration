import { createEntryCode } from "./utils.js";

export function initRegistration() {
  const form = document.querySelector("#registration-form");
  const steps = [...document.querySelectorAll(".step")];
  let currentStep = 1;

  function showStep(nextStep) {
    currentStep = nextStep;
    const shell = document.querySelector(".app-shell");
    // shell.classList.toggle("second-poster-visible", currentStep === 2);
    // shell.classList.toggle("pass-visible", currentStep === 3);

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
    document
      .querySelector(".registration-card")
      .scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function setError(field, message) {
    field.classList.toggle("invalid", Boolean(message));
    const error = document.querySelector(`#${field.id}-error`);
    if (error) error.textContent = message;
  }

  document.querySelector("[data-next='1']").addEventListener("click", () => {
    const phone = document.querySelector("#phone");
    const digits = phone.value.replace(/\D/g, "");
    const phoneField = document.querySelector("#phone-field");
    const selectedRoles = [
      ...document.querySelectorAll("input[name='roles']:checked"),
    ];
    const roleError = document.querySelector("#role-error");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      phoneField.classList.add("invalid");
      document.querySelector("#phone-error").textContent =
        "Enter a valid 10-digit Indian mobile number.";
      phone.focus();
      return;
    }
    if (selectedRoles.length === 0) {
      roleError.textContent = "Select at least one role to continue.";
      document
        .querySelector(".role-fieldset")
        .scrollIntoView({ behavior: "smooth", block: "center" });
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

  document
    .querySelector("[data-back='2']")
    .addEventListener("click", () => showStep(1));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstName = document.querySelector("#first-name");
    const lastName = document.querySelector("#last-name");
    const address = document.querySelector("#address");
    const cleanFirstName = firstName.value.trim();
    const cleanLastName = lastName.value.trim();
    const cleanAddress = address.value.trim();

    setError(
      firstName,
      cleanFirstName.length < 2 ? "Please enter your first name." : "",
    );
    setError(
      lastName,
      cleanLastName.length < 2 ? "Please enter your last name." : "",
    );
    setError(
      address,
      cleanAddress.length < 5 ? "Please enter your address." : "",
    );

    if (
      cleanFirstName.length < 2 ||
      cleanLastName.length < 2 ||
      cleanAddress.length < 5
    ) {
      [firstName, lastName, address]
        .find((field) => field.classList.contains("invalid"))
        ?.focus();
      return;
    }

    const entryCode = createEntryCode();
    document.querySelector("#entry-code").textContent = entryCode;
    document.querySelector("#qr-entry-code").textContent = entryCode;
    document.querySelector("#pass-attendee").textContent =
      `${cleanFirstName} ${cleanLastName}`;
    const phoneDigits = document
      .querySelector("#phone")
      .value.replace(/\D/g, "");
    const formattedPhone = `+91 ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`;
    document.querySelector("#pass-phone").textContent = formattedPhone;
    const qrData = encodeURIComponent(entryCode);
    const qrImage = document.querySelector("#pass-qr");
    qrImage.crossOrigin = "anonymous";
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=png&margin=1&data=${qrData}`;
    showStep(3);
  });

  document
    .querySelectorAll("#first-name, #last-name, #address")
    .forEach((field) => {
      field.addEventListener("input", () => setError(field, ""));
    });
}
