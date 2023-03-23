export default (data) => {
  const parser = new DOMParser();

  const xmlDocument = parser.parseFromString(data, 'text/xml');
  const errorNode = xmlDocument.querySelector('parsererror');
  if (errorNode) {
    throw new Error('errors.parsingError');
  }

  const channel = xmlDocument.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const feed = { title: feedTitle, description: feedDescription };

  const items = Array.from(xmlDocument.querySelectorAll('item'));
  const posts = items.map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    return { title: postTitle, description: postDescription, link };
  });

  return { feed, posts };
};
