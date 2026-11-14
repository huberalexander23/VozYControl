"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("vozycontrol-theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    document.documentElement.dataset.theme = savedTheme;
  }
  const themeHost = document.querySelector(
    ".topbar-inner, .auth-brand, .dashboard-header-inner, .subpage-header"
  );
  if (themeHost) {
    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "theme-toggle";
    themeButton.setAttribute("aria-pressed", String(document.documentElement.dataset.theme === "dark"));
    themeButton.setAttribute("aria-label", document.documentElement.dataset.theme === "dark" ? "Activar modo claro" : "Activar modo oscuro");
    themeButton.textContent = document.documentElement.dataset.theme === "dark" ? "☀ Claro" : "☾ Oscuro";
    themeHost.append(themeButton);
    themeButton.addEventListener("click", () => {
      const isDark = document.documentElement.dataset.theme !== "dark";
      document.documentElement.dataset.theme = isDark ? "dark" : "light";
      localStorage.setItem("vozycontrol-theme", isDark ? "dark" : "light");
      themeButton.setAttribute("aria-pressed", String(isDark));
      themeButton.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
      themeButton.textContent = isDark ? "☀ Claro" : "☾ Oscuro";
    });
  }

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
  if (tabs.length) {
    activateTab(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
  }
  document.querySelector("#switch-register")?.addEventListener("click", () => {
    const registerTab = document.querySelector("#tab-register");
    if (registerTab) { activateTab(registerTab, true); }
  });

  const fileInput = document.querySelector("#evidencia");
  const fileName = document.querySelector("#file-name");
  fileInput?.addEventListener("change", () => {
    fileName.textContent = fileInput.files?.[0]?.name || "Ningún archivo seleccionado";
  });

  function validateAccessForm(form) {
    const controls = [...form.querySelectorAll("input[required]")];
    let firstInvalid = null;
    controls.forEach((field) => {
      const valid = field.checkValidity();
      field.setAttribute("aria-invalid", String(!valid));
      if (!valid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      const status = form.querySelector('[role="status"]');
      if (status) status.textContent = "Revisa los campos: completa la información y utiliza un correo válido.";
      return false;
    }
    return true;
  }

  ["login-form", "register-form"].forEach((formId) => {
    const form = document.getElementById(formId);
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateAccessForm(form)) return;
      const name = form.querySelector('[name="name"]')?.value.trim();
      if (name) sessionStorage.setItem("vozycontrol-demo-name", name);
      else if (!sessionStorage.getItem("vozycontrol-demo-name")) sessionStorage.setItem("vozycontrol-demo-name", "María Fernández");
      const status = form.querySelector('[role="status"]');
      if (status) status.textContent = "Datos revisados para la demostración. Abriendo el panel de ejemplo; no se creó una cuenta ni se inició sesión real.";
      window.location.href = "panel.html";
    });
  });

  document.querySelectorAll("[data-demo-logout]").forEach((link) => {
    link.addEventListener("click", () => sessionStorage.removeItem("vozycontrol-demo-name"));
  });

  const demoName = sessionStorage.getItem("vozycontrol-demo-name");
  ["#dashboard-name", "#profile-name"].forEach((selector) => {
    const nameTarget = document.querySelector(selector);
    if (nameTarget && demoName) nameTarget.textContent = demoName;
  });

  const reportForm = document.querySelector("#report-form");
  const successPanel = document.querySelector("#success-panel");
  const reportStatus = document.querySelector("#report-status");
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
    }
    wrapper?.classList.toggle("has-error", invalid);
  }

  requiredFields.forEach(({ id, message }) => {
    const field = document.getElementById(id);
    field?.addEventListener("blur", () => setFieldError(field, field.value.trim() ? "" : message));
    field?.addEventListener("input", () => {
      if (field.value.trim()) setFieldError(field, "");
    });
    field?.addEventListener("change", () => {
      if (field.value.trim()) setFieldError(field, "");
    });
  });

  reportForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    let firstInvalid = null;
    requiredFields.forEach(({ id, message }) => {
      const field = document.getElementById(id);
      const invalid = !field?.value.trim();
      setFieldError(field, invalid ? message : "");
      if (invalid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const submitButton = reportForm.querySelector('button[type="submit"]');
    const formData = new FormData(reportForm);
    formData.set("reporterName", sessionStorage.getItem("vozycontrol-demo-name") || "Usuario");
    if (submitButton) submitButton.disabled = true;
    if (reportStatus) {
      reportStatus.hidden = false;
      reportStatus.textContent = "Guardando reporte...";
    }

    try {
      const response = await fetch("/api/reportes", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "No se pudo guardar el reporte.");

      reportForm.hidden = true;
      if (reportStatus) reportStatus.hidden = true;
      if (successPanel) {
        successPanel.hidden = false;
        const message = successPanel.querySelector("#success-message");
        if (message) message.textContent = `Tu reporte quedó guardado. Número de registro: ${result.report._id}.`;
        successPanel.focus();
      }
    } catch (error) {
      if (reportStatus) {
        reportStatus.hidden = false;
        reportStatus.textContent = error.message || "No fue posible guardar el reporte. Intenta nuevamente.";
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  document.querySelectorAll(".skip-link").forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));
      target?.setAttribute("tabindex", "-1");
      target?.focus();
    });
  });
});
