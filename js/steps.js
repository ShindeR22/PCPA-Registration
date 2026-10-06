const stepFiles = [
  "./partials/step-1.html",
  "./partials/step-2.html",
  "./partials/step-3.html",
];

export async function loadSteps() {
  const stepMarkup = await Promise.all(
    stepFiles.map(async (file) => {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Could not load ${file}: ${response.status}`);
      }
      return response.text();
    }),
  );

  document.querySelector("#registration-steps").innerHTML = stepMarkup.join("\n");
}
