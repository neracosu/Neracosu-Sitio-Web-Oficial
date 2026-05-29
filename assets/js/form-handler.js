/**
 * Form Handler - Validation, submission via Fetch, WhatsApp link builder
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Generate CSRF token
    generateCSRFToken();

    // Real-time validation
    const fields = {
      name: { el: document.getElementById('contact-name'), errorEl: document.getElementById('name-error') },
      email: { el: document.getElementById('contact-email'), errorEl: document.getElementById('email-error') },
      whatsapp: { el: document.getElementById('contact-whatsapp'), errorEl: document.getElementById('whatsapp-error') },
      project: { el: document.getElementById('contact-project'), errorEl: document.getElementById('project-error') },
      message: { el: document.getElementById('contact-message'), errorEl: document.getElementById('message-error') }
    };

    // Validate on blur
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (field.el) {
        field.el.addEventListener('blur', () => validateField(key, fields));
        field.el.addEventListener('input', () => {
          if (field.el.classList.contains('is-error')) {
            validateField(key, fields);
          }
        });
      }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate all required fields
      let isValid = true;
      ['name', 'email', 'project', 'message'].forEach(key => {
        if (!validateField(key, fields)) isValid = false;
      });

      if (!isValid) return;

      const submitBtn = document.getElementById('contact-submit');
      const statusEl = document.getElementById('form-status');

      // Loading state
      submitBtn.classList.add('btn--loading');
      submitBtn.disabled = true;
      statusEl.className = 'form__status';
      statusEl.textContent = '';

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          statusEl.className = 'form__status is-success';
          statusEl.textContent = 'Mensaje enviado correctamente. Te contactare pronto!';
          form.reset();
          generateCSRFToken();
        } else {
          statusEl.className = 'form__status is-error';
          statusEl.textContent = result.message || 'Error al enviar el mensaje. Intenta de nuevo.';
        }
      } catch (err) {
        statusEl.className = 'form__status is-error';
        statusEl.textContent = 'Error de conexion. Intenta de nuevo o escribeme por WhatsApp.';
      } finally {
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;
      }
    });

    // WhatsApp link builder - update WhatsApp button based on form data
    const waBtn = document.querySelector('.btn--whatsapp');
    if (waBtn) {
      form.addEventListener('input', () => {
        const name = fields.name.el?.value || '';
        const project = fields.project.el?.value || '';
        const message = fields.message.el?.value || '';

        let waMessage = 'Hola Neri!';
        if (name) waMessage += ` Soy ${name}.`;
        if (project) waMessage += ` Me interesa: ${project}.`;
        if (message) waMessage += ` ${message}`;

        waBtn.href = `https://wa.me/584222707095?text=${encodeURIComponent(waMessage)}`;
      });
    }
  });

  function validateField(key, fields) {
    const field = fields[key];
    if (!field?.el) return true;

    const value = field.el.value.trim();
    let error = '';

    switch (key) {
      case 'name':
        if (!value) error = 'El nombre es requerido.';
        else if (value.length < 2) error = 'El nombre es muy corto.';
        else if (value.length > 100) error = 'El nombre es muy largo.';
        break;

      case 'email':
        if (!value) error = 'El email es requerido.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Ingresa un email valido.';
        break;

      case 'whatsapp':
        if (value && !/^[\+]?[\d\s\-\(\)]{7,20}$/.test(value)) error = 'Numero de telefono invalido.';
        break;

      case 'project':
        if (!value) error = 'Selecciona un tipo de proyecto.';
        break;

      case 'message':
        if (!value) error = 'Cuentame sobre tu proyecto.';
        else if (value.length < 10) error = 'Describe un poco mas tu proyecto.';
        else if (value.length > 2000) error = 'El mensaje es muy largo (max 2000 caracteres).';
        break;
    }

    if (field.errorEl) field.errorEl.textContent = error;

    if (error) {
      field.el.classList.add('is-error');
      return false;
    } else {
      field.el.classList.remove('is-error');
      return true;
    }
  }

  function generateCSRFToken() {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const tokenInput = document.getElementById('csrf_token');
    if (tokenInput) tokenInput.value = token;

    // Store in session via a quick request
    fetch('/assets/php/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `action=set_csrf&csrf_token=${token}`
    }).catch(() => {}); // Silent fail
  }

})();
