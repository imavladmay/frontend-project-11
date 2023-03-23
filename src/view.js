const renderPosts = (state, elements, translation) => {
  elements.containerPosts.innerHTML = '';

  const firstDiv = document.createElement('div');
  firstDiv.classList.add('card', 'border-0');
  elements.containerPosts.append(firstDiv);

  const secondDiv = document.createElement('div');
  secondDiv.classList.add('card-body');
  firstDiv.append(secondDiv);

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = translation('posts');
  secondDiv.append(h2);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  firstDiv.append(list);

  state.posts.forEach((post) => {
    const listItem = document.createElement('li');
    listItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    list.append(listItem);

    const a = document.createElement('a');
    a.href = post.link;
    a.classList.add(state.uiState.idsViewedPosts.has(post.id) ? 'link-secondary' : 'fw-bold');
    a.setAttribute('data-id', post.id);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = post.title;

    const itemButton = document.createElement('button');
    itemButton.setAttribute('type', 'button');
    itemButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    itemButton.setAttribute('data-id', post.id);
    itemButton.setAttribute('data-bs-toggle', 'modal');
    itemButton.setAttribute('data-bs-target', '#modal');
    itemButton.textContent = translation('viewing');
    listItem.append(a, itemButton);
  });
};

const renderFeeds = (state, elements, translation) => {
  elements.containerFeeds.innerHTML = '';

  const firstDiv = document.createElement('div');
  firstDiv.classList.add('card', 'border-0');

  const secondDiv = document.createElement('div');
  secondDiv.classList.add('card-body');
  firstDiv.append(secondDiv);

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = translation('feeds');
  secondDiv.append(h2);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach((feed) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;

    listItem.append(h3, p);
    list.append(listItem);
  });

  elements.containerFeeds.append(firstDiv, list);
  elements.feedback.textContent = '';
  elements.urlInput.classList.remove('is-invalid');
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.feedback.textContent = translation('validUrl');
  elements.form.reset();
  elements.urlInput.focus();
};

const renderErrors = (elements, error, translation) => {
  elements.feedback.textContent = '';
  elements.urlInput.classList.add('is-invalid');
  elements.feedback.classList.add('text-danger');
  elements.feedback.textContent = translation(error.message);
};

const renderModalWindow = (state, elements, postId) => {
  const post = state.posts.find(({ id }) => id === postId);
  elements.modal.title.textContent = post.title;
  elements.modal.description.textContent = post.description;
  elements.modal.fullArticleBtn.href = post.link;
};

const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'filling':
      elements.submitButton.disabled = false;
      break;
    case 'sending':
      elements.submitButton.disabled = true;
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const render = (state, elements, translation) => (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrors(elements, value, translation);
      break;
    case 'posts':
      renderPosts(state, elements, translation);
      break;
    case 'feeds':
      renderFeeds(state, elements, translation);
      break;
    case 'uiState.idOfPostRelatedToModal':
      renderModalWindow(state, elements, value);
      break;
    case 'uiState.idsViewedPosts':
      renderPosts(state, elements, translation);
      break;
    case 'form.processState':
      handleProcessState(elements, value);
      break;
    default:
      throw new Error(`Unexpected application state: ${path}: ${value}`);
  }
};

export default render;
