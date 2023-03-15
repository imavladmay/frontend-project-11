const render = (elements, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'form.errors':
      elements.feedback.textContent = '';
      elements.urlInput.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = i18nextInstance.t(value[0].message);
      break;
    case 'feeds':
      elements.feedback.textContent = '';
      elements.urlInput.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18nextInstance.t('validUrl');
      elements.form.reset();
      elements.urlInput.focus();
      break;
    default:
      throw new Error(`Unexpected application state: ${path}: ${value}`);
  }
};

export default render;
