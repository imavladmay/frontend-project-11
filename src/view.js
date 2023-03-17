const renderPosts = (state, elements, translation) => {
  const firstDiv = document.createElement('div');
  firstDiv.classList.add('card', 'border-0');

  const secondDiv = document.createElement('div');
  secondDiv.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = translation('posts');

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

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

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.href = post.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('data-id', post.id);
    a.textContent = post.title;

    // const button = document.createElement('button');
    // button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    // button.type = 'button';
    // button.setAttribute('data-id', post.id);
    // button.setAttribute('data-bs-toggle', 'modal');
    // button.setAttribute('data-bs-target', '#modal');
    // button.textContent = translate('preview');

    listItem.append(a);
    list.append(listItem);
  });

  elements.containerPosts.append(firstDiv, secondDiv, list);
};

const renderFeeds = (state, elements, translation) => {
  const firstDiv = document.createElement('div');
  firstDiv.classList.add('card', 'border-0');

  const secondDiv = document.createElement('div');
  secondDiv.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = translation('feeds');

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

  elements.containerFeeds.append(firstDiv, secondDiv, list);
};

const renderErrors = (elements, error, translation) => {
  elements.feedback.textContent = '';
  elements.urlInput.classList.add('is-invalid');
  elements.feedback.classList.add('text-danger');
  elements.feedback.textContent = translation(error[0].message);
};

const render = (state, elements, translation) => (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrors(elements, value, translation);
      break;
    case 'feeds':
      renderPosts(state, elements, translation);
      renderFeeds(state, elements, translation);
      elements.form.reset();
      elements.urlInput.focus();
      break;
    default:
      throw new Error(`Unexpected application state: ${path}: ${value}`);
  }
};

export default render;
