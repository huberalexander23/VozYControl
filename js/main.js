"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("vozycontrol-theme");
  if (savedTheme === "dark" || savedTheme === "light") document.documentElement.dataset.theme = savedTheme;

  const themeHost = document.querySelector(".topbar-inner, .auth-brand, .dashboard-header-inner, .subpage-header");
  if (themeHost) {
    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "theme-toggle";
    const updateThemeButton = () => {
      const dark = document.documentElement.dataset.theme === "dark";
      themeButton.setAttribute("aria-pressed", String(dark));
      themeButton.setAttribute("aria-label", dark ? "Activar modo claro" : "Activar modo oscuro");
      themeButton.textContent = dark ? "☀ Claro" : "☾ Oscuro";
    };
    updateThemeButton();
    themeHost.append(themeButton);
    themeButton.addEventListener("click", () => {
      const dark = document.documentElement.dataset.theme !== "dark";
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      localStorage.setItem("vozycontrol-theme", dark ? "dark" : "light");
      updateThemeButton();
    });
  }

  const searchForm = document.querySelector("#service-search");
  searchForm?.addEventListener("submit", (event) => event.preventDefault());
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
      emptyState.textContent = visible ? `${visible} servicio(s) encontrado(s).` : "No se encontraron servicios. Prueba otra palabra o categoría.";
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
  if (tabs.length) activateTab(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
  document.querySelector("#switch-register")?.addEventListener("click", () => {
    const registerTab = document.querySelector("#tab-register");
    if (registerTab) activateTab(registerTab, true);
  });

  const fileInput = document.querySelector("#evidencia");
  const fileName = document.querySelector("#file-name");
  fileInput?.addEventListener("change", () => {
    if (fileName) fileName.textContent = fileInput.files?.[0]?.name || "Ningún archivo seleccionado";
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
      return false;
    }
    return true;
  }

  function showAuthMessage(form, message) {
    const status = form.querySelector('[role="status"]');
    if (!status) return;
    status.hidden = false;
    status.textContent = message;
  }

  async function sendAuthForm(form, endpoint) {
    if (!validateAccessForm(form)) return;
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    const body = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "No fue posible completar la operación.");
      window.location.replace("panel.html");
    } catch (error) {
      showAuthMessage(form, error.message || "No se pudo conectar con el servidor.");
    } finally {
      if (button) button.disabled = false;
    }
  }

  const loginForm = document.querySelector("#login-form");
  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    sendAuthForm(loginForm, "/api/auth/login");
  });
  const registerForm = document.querySelector("#register-form");
  registerForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    sendAuthForm(registerForm, "/api/auth/registro");
  });

  const authError = new URLSearchParams(window.location.search).get("error");
  if (authError === "google" && loginForm) showAuthMessage(loginForm, "No se pudo iniciar sesión con Google. Verifica la configuración OAuth e inténtalo nuevamente.");

  const publicHome = Boolean(document.querySelector("#service-list"));
  if (publicHome) {
    fetch("/api/auth/perfil", { credentials: "same-origin" })
      .then(async (response) => response.ok ? (await response.json()).usuario : null)
      .then((user) => {
        if (!user) return;
        const loginLink = document.querySelector(".header-icon-link");
        if (loginLink) { loginLink.href = "panel.html"; loginLink.setAttribute("aria-label", "Ir a mi panel"); }
        const banner = document.querySelector(".info-banner");
        if (banner) {
          const heading = banner.querySelector("strong");
          const copy = banner.querySelector("p");
          const action = banner.querySelector("a");
          if (heading) heading.textContent = `Sesión iniciada como ${user.nombre}`;
          if (copy) copy.textContent = user.rol === "admin" ? "Accede a tu panel para gestionar los reportes ciudadanos." : "Ya puedes consultar y gestionar tus reportes.";
          if (action) { action.href = "panel.html"; action.textContent = user.rol === "admin" ? "Abrir administración" : "Mi panel"; }
        }
        const tabs = [...document.querySelectorAll(".tabbar .tab")];
        if (tabs.length === 4) {
          tabs[0].href = "panel.html";
          tabs[2].href = "reportar.html";
          tabs[3].href = "perfil.html";
        }
      })
      .catch(() => {});
  }

  const protectedPage = Boolean(document.querySelector("#report-list, #report-form, #profile-name"));
  const sessionPromise = protectedPage
    ? fetch("/api/auth/perfil", { credentials: "same-origin" })
        .then(async (response) => {
          if (!response.ok) {
            window.location.replace("login.html");
            return null;
          }
          const result = await response.json();
          const user = result.usuario;
          ["#dashboard-name", "#profile-name"].forEach((selector) => {
            const element = document.querySelector(selector);
            if (element) element.textContent = user.nombre;
          });
          const reportsHeading = document.querySelector("#reports-heading");
          if (reportsHeading && user.rol === "admin") reportsHeading.textContent = "Gestión de reportes";
          const emailElement = document.querySelector("#profile-email");
          if (emailElement) emailElement.textContent = user.email;
          const avatar = document.querySelector(".profile-avatar");
          if (avatar) avatar.textContent = user.nombre.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
          return user;
        })
        .catch(() => {
          window.location.replace("login.html");
          return null;
        })
    : Promise.resolve(null);

  document.querySelectorAll("[data-auth-logout]").forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
      } finally {
        window.location.replace("index.html");
      }
    });
  });

  const reportList = document.querySelector("#report-list");
  if (reportList) {
    sessionPromise.then(async (user) => {
      if (!user) return null;
      const response = await fetch("/api/reportes", { credentials: "same-origin" });
      if (response.status === 401) {
        window.location.replace("login.html");
        return null;
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "No se pudieron cargar los reportes.");
      return { reports: result.reports || [], user };
    })
      .then((data) => {
        if (!data) return;
        const { reports, user } = data;
        const active = reports.filter((report) => report.status !== "Resuelto").length;
        const resolved = reports.filter((report) => report.status === "Resuelto").length;
        const activeCount = document.querySelector("#active-count");
        const resolvedCount = document.querySelector("#resolved-count");
        if (activeCount) activeCount.textContent = active;
        if (resolvedCount) resolvedCount.textContent = resolved;
        reportList.replaceChildren();

        if (!reports.length) {
          const empty = document.createElement("p");
          empty.className = "service-desc";
          empty.textContent = "Todavía no tienes reportes registrados.";
          reportList.append(empty);
          return;
        }

        reports.forEach((report) => {
          const row = document.createElement("article");
          row.className = "report-row";
          const content = document.createElement("div");
          const title = document.createElement("h3");
          title.className = "report-title";
          title.textContent = report.description.length > 82 ? `${report.description.slice(0, 79)}...` : report.description;
          const date = document.createElement("p");
          date.className = "report-date";
          const created = report.createdAt ? new Date(report.createdAt).toLocaleDateString("es-CO") : "";
          date.textContent = [created, report.category, report.location].filter(Boolean).join(" · ");
          content.append(title, date);
          const badge = document.createElement("span");
          badge.className = "badge " + (report.status === "Resuelto" ? "badge-done" : report.status === "En curso" ? "badge-progress" : "badge-pending");
          badge.textContent = report.status || "Pendiente";
          row.append(content, badge);

          if (user.rol === "admin") {
            const actions = document.createElement("div");
            actions.className = "admin-report-actions";
            const statusSelect = document.createElement("select");
            statusSelect.setAttribute("aria-label", "Cambiar estado del reporte");
            ["Pendiente", "En curso", "Resuelto"].forEach((status) => {
              const option = document.createElement("option");
              option.value = status;
              option.textContent = status;
              statusSelect.append(option);
            });
            statusSelect.value = report.status || "Pendiente";
            const saveButton = document.createElement("button");
            saveButton.type = "button";
            saveButton.className = "btn btn-secondary";
            saveButton.textContent = "Guardar estado";
            saveButton.addEventListener("click", async () => {
              saveButton.disabled = true;
              try {
                const response = await fetch(`/api/reportes/${encodeURIComponent(report._id)}/estado`, {
                  method: "PATCH",
                  credentials: "same-origin",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status: statusSelect.value })
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || "No se pudo actualizar el estado.");
                badge.textContent = result.report.status;
                badge.className = "badge " + (result.report.status === "Resuelto" ? "badge-done" : result.report.status === "En curso" ? "badge-progress" : "badge-pending");
                saveButton.textContent = "Actualizado";
              } catch (error) {
                saveButton.textContent = error.message;
              } finally {
                saveButton.disabled = false;
              }
            });
            actions.append(statusSelect, saveButton);
            row.append(actions);
          }
          reportList.append(row);
        });
      })
      .catch((error) => {
        reportList.replaceChildren();
        const message = document.createElement("p");
        message.className = "service-desc";
        message.textContent = error.message;
        reportList.append(message);
      });
  }

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
    const user = await sessionPromise;
    if (!user) {
      window.location.replace("login.html");
      return;
    }
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
    if (submitButton) submitButton.disabled = true;
    if (reportStatus) {
      reportStatus.hidden = false;
      reportStatus.textContent = "Guardando reporte...";
    }

    try {
      const response = await fetch("/api/reportes", {
        method: "POST",
        credentials: "same-origin",
        body: formData
      });
      const result = await response.json();
      if (response.status === 401) {
        window.location.replace("login.html");
        return;
      }
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
