/* VozYControl - mejoras de accesibilidad WCAG 2.2 */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Búsqueda y filtros por categoría (A: información perceptible y operable).
  const searchInput = document.querySelector("#search");
  const categoryButtons = [...document.querySelectorAll("[data-category]")];
  const serviceCards = [...document.querySelectorAll(".service-card")];
  const emptyState = document.querySelector("#empty-state");
  let activeCategory = "todos";

  function filterServices() {
    if (!serviceCards.length) return;
    const term = (searchInput?.value || "").trim().toLocaleLowerCase("es");
    let visible = 0;
    serviceCards.forEach((card) => {
      const matchesCategory = activeCategory === "todos" || card.dataset.category === activeCategory;
      const matchesText = card.textContent.toLocaleLowerCase("es").includes(term);
      card.hidden = !(matchesCategory && matchesText);
      if (!card.hidden) visible += 1;
    });
    if (emptyState) {
      emptyState.hidden = visible !== 0;
      emptyState.textContent = visible
        ? `${visible} servicio(s) encontrado(s).`
        : "No se encontraron servicios. Prueba otra palabra o categoría.";
    }
  }
  searchInput?.addEventListener("input", filterServices);
  categoryButtons.forEach((button) => button.addEventListener("click", () => {
    activeCategory = button.dataset.category || "todos";
    categoryButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    filterServices();
  }));
  filterServices();

  // Pestañas del acceso: flechas, Inicio y Fin (A: teclado; AA: foco visible).
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  function activateTab(tab, moveFocus = false) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.id !== tab.getAttribute("aria-controls"); });
    if (moveFocus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabs[next], true);
    });
  });
  if (tabs.length) activateTab(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);

  // Mensajes comprensibles al seleccionar evidencia.
  const fileInput = document.querySelector("#evidencia");
  const fileName = document.querySelector("#file-name");
  fileInput?.addEventListener("change", () => {
    fileName.textContent = fileInput.files?.[0]?.name || "Ningún archivo seleccionado";
  });

  // Validación de formulario: errores asociados al campo y anunciables.
  const reportForm = document.querySelector("#report-form");
  const successPanel = document.querySelector("#success-panel");
  const requiredFields = [
    { id: "categoria", message: "Selecciona una categoría." },
    { id: "ubicacion", message: "Indica dónde ocurrió el hecho." },
    { id: "descripcion", message: "Describe brevemente lo ocurrido." }
  ];
  function setFieldError(field, message) {
    if (!field) return;
    const wrapper = field.closest(".field");
    const error = wrapper?.querySelector(".field-error");
    const invalid = Boolean(message);
    field.setAttribute("aria-invalid", String(invalid));
    if (error) {
      error.textContent = message || "";
      error.hidden = !invalid;
      if (error.id) field.setAttribute("aria-describedby", error.id);
    }
    wrapper?.classList.toggle("has-error", invalid);
  }
  requiredFields.forEach(({ id, message }) => {
    const field = document.getElementById(id);
    field?.addEventListener("blur", () => setFieldError(field, field.value.trim() ? "" : message));
    field?.addEventListener("input", () => { if (field.value.trim()) setFieldError(field, ""); });
    field?.addEventListener("change", () => { if (field.value.trim()) setFieldError(field, ""); });
  });
  reportForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalid = null;
    requiredFields.forEach(({ id, message }) => {
      const field = document.getElementById(id);
      const invalid = !field?.value.trim();
      setFieldError(field, invalid ? message : "");
      if (invalid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    // Prototipo sin backend: muestra confirmación local, no persiste información.
    reportForm.hidden = true;
    if (successPanel) {
      successPanel.hidden = false;
      successPanel.setAttribute("tabindex", "-1");
      successPanel.focus();
    }
  });

  // Ayuda consistente: enlaces de salto enfocan el contenido de destino.
  document.querySelectorAll(".skip-link").forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));
      target?.setAttribute("tabindex", "-1");
      target?.focus();
    });
  });
});
