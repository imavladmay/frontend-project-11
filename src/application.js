import { string, setLocale } from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import render from './view';
import ru from './locales/ru';

const app = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  setLocale({
    mixed: { notOneOf: 'errors.alreadyExists' },
    string: { url: 'errors.invalidUrl' },
  });

  const initialState = {
    form: {
      errors: [],
    },
    feeds: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    urlInput: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = onChange(initialState, render(elements, i18nextInstance));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    const schema = string().url().notOneOf(initialState.feeds);

    schema
      .validate(url)
      .then(() => {
        watchedState.feeds.push(url);
      })
      .catch((error) => {
        watchedState.form.errors = [error];
      });
  });
};

export default app;
