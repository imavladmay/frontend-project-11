import { string } from 'yup';
import onChange from 'on-change';
import render from './view';

const app = () => {
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

  const watchedState = onChange(initialState, render(elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    const schema = string()
      .url('Ссылка должна быть валидным URL')
      .notOneOf(initialState.feeds, 'RSS уже существует');

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
