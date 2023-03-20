import axios from 'axios';
import i18next from 'i18next';
import onChange from 'on-change';
import { string, setLocale } from 'yup';
import { uniqueId } from 'lodash';
import render from './view';
import ru from './locales/ru';
import parse from './parser';

const fulfilHttpRequest = (url) => {
  const allOriginsLink = 'https://allorigins.hexlet.app/get';
  const preparedURL = new URL(allOriginsLink);
  preparedURL.searchParams.set('disableCache', 'true');
  preparedURL.searchParams.set('url', url);
  return axios.get(preparedURL);
};

const getAllOrigins = (url) => fulfilHttpRequest(url)
  .then((response) => Promise.resolve(response.data.contents))
  .catch(() => Promise.reject(new Error('errors.networkError')));

const addPosts = (feedId, items, state) => {
  const posts = items.map((item) => ({
    feedId,
    id: uniqueId(),
    ...item,
  }));
  state.posts = state.posts.concat(posts);
};

const getNewPosts = (state, timeout = 5000) => {
  const promises = state.feeds.map(({ id, link }) => getAllOrigins(link)
    .then((response) => {
      const { posts } = parse(response.data.contents);
      const linksToAddedPosts = state.posts.map((post) => post.link);
      const newPosts = posts.filter((post) => !linksToAddedPosts.includes(post.link));
      if (newPosts.length > 0) {
        addPosts(id, newPosts, state);
      }
      return Promise.resolve();
    }));

  Promise.allSettled(promises).then(() => {
    setTimeout(() => getNewPosts(state), timeout);
  });
};

const app = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru,
      },
    })
    .then((translation) => {
      setLocale({
        mixed: { notOneOf: 'errors.alreadyExists' },
        string: { url: 'errors.invalidUrl' },
      });

      const initialState = {
        form: {
          errors: [],
        },
        feeds: [],
        posts: [],
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        urlInput: document.querySelector('#url-input'),
        feedback: document.querySelector('.feedback'),
        submitButton: document.querySelector('button[type="submit"]'),
        containerPosts: document.querySelector('.posts'),
        containerFeeds: document.querySelector('.feeds'),
      };

      const watchedState = onChange(initialState, render(initialState, elements, translation));

      getNewPosts(watchedState);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url').trim();
        const urlList = watchedState.feeds.map(({ link }) => link);
        const schema = string().url().notOneOf(urlList);

        schema
          .validate(url)
          .then(() => getAllOrigins(url))
          .then((data) => parse(data))
          .then((parsedData) => {
            const feedId = uniqueId();
            const feed = {
              id: feedId,
              title: parsedData.feed.title,
              description: parsedData.feed.description,
              link: url,
            };
            watchedState.feeds.push(feed);

            addPosts(feedId, parsedData.posts, watchedState);
          })
          .catch((error) => {
            watchedState.form.errors = [error, ...watchedState.form.errors];
          });
      });
    });
};

export default app;
