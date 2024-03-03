import axios from 'axios';
import Notiflix from 'notiflix';
import { simplelightbox } from './simplelightbox.js';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-form input');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', event => {
  try {
    event.preventDefault();
    if (input.value.trim('') === '') {
      Notiflix.Notify.warning('Please fill the field with at least one word');
      return;
    }
    const list = onClick();
  } catch (error) {
    console.log(error.message);
    Notiflix.Notify.failure('Sorry, technical issues!');
  }
});

async function onClick() {
  try {
    const options = {
      key: '42678686-e89dbeb1c053e72710a9523f7',
      q: input.value.trim(''),
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    };
    const url = `https://pixabay.com/api/?key=${options.key}&q=${options.q}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}`;
    const data = await axios.get(url, options);
    const list = data.data.hits;

    renderGallery(list);
    simplelightbox();
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function renderGallery(list) {
  const picsGallery = list
    .map(
      pic => `<div class="photo-card">
      <a class="link" class="thumbnail" href="${pic.largeImageURL}"><img src="${pic.webformatURL}" alt="${pic.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes: ${pic.likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${pic.views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${pic.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${pic.downloads}</b>
      </p>
    </div>
  </div>
  `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', picsGallery);
}
