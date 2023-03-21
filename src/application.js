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
        mixed: { notOneOf: 'errors.alreadyExists', required: 'errors.mustNotBeEmpty' },
        string: { url: 'errors.invalidUrl' },
      });

      const initialState = {
        form: {
          errors: [],
        },
        feeds: [],
        posts: [],
        uiState: {
          IDsViewedPosts: new Set(),
          idOfPostRelatedToModal: null,
        },
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        urlInput: document.querySelector('#url-input'),
        feedback: document.querySelector('.feedback'),
        submitButton: document.querySelector('button[type="submit"]'),
        containerPosts: document.querySelector('.posts'),
        containerFeeds: document.querySelector('.feeds'),
        viewPostButton: document.querySelector('button[type="button"]'),
        modal: {
          modalElement: document.querySelector('.modal'),
          title: document.querySelector('.modal-title'),
          description: document.querySelector('.modal-body'),
          fullArticleBtn: document.querySelector('.full-article'),
        },
      };

      const watchedState = onChange(initialState, render(initialState, elements, translation));

      getNewPosts(watchedState);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url').trim();
        const urlList = watchedState.feeds.map(({ link }) => link);
        const schema = string().required().url().notOneOf(urlList);

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

      elements.modal.modalElement.addEventListener('shown.bs.modal', (e) => {
        const id = e.relatedTarget.getAttribute('data-id');
        watchedState.uiState.IDsViewedPosts.add(id);
        watchedState.uiState.idOfPostRelatedToModal = id;
      });

      elements.containerPosts.addEventListener('click', (e) => {
        const { id } = e.target.dataset;
        if (id) {
          watchedState.uiState.IDsViewedPosts.add(id);
        }
      });
    });
};

export default app;
