import axios from 'axios';
import Notiflix from 'notiflix';
import { simplelightbox } from './simplelightbox.js';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-form input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.disabled = true;

loadMoreBtn.addEventListener('click', async () => {
  try {
    if (input.value.trim('') === '') {
      gallery.innerHTML = '';
      loadMoreBtn.disabled = true;

      return;
    } else if (input.value.trim('') !== queryTags) {
      gallery.innerHTML = '';
      onClick();

      return;
    } else if (input.value.trim('') === queryTags) {
      const options = {
        key: '42678686-e89dbeb1c053e72710a9523f7',
        q: queryTags,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: currentPage,
      };
      let elementsLeft = Math.abs(
        totalHits - (currentPage - 1) * options.per_page
      );

      if (elementsLeft < options.per_page) {
        options.per_page = elementsLeft;
        const url = `https://pixabay.com/api/?key=${options.key}&q=${options.q}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&per_page=${options.per_page}&page=${options.page}`;
        const data = await axios.get(url, options);
        const list = data.data.hits;

        renderGallery(list);
        simplelightbox();
        loadMoreBtn.disabled = true;
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );

        return;
      }

      const url = `https://pixabay.com/api/?key=${options.key}&q=${options.q}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&per_page=${options.per_page}&page=${options.page}`;
      const data = await axios.get(url, options);
      const list = data.data.hits;
      renderGallery(list);
      simplelightbox();
      currentPage += 1;
    }
  } catch (error) {
    Notiflix.Notify.failure('Sorry, no workee workee');
    console.log(error);
  }
});

form.addEventListener('submit', event => {
  try {
    event.preventDefault();
    if (input.value.trim('') === '') {
      Notiflix.Notify.warning('Please fill the field with at least one word');
      return;
    } else if (input.value.trim('') !== queryTags) {
      gallery.innerHTML = '';
      onClick();
    } else {
      onClick();
    }
  } catch (error) {
    console.log(error.message);
    Notiflix.Notify.failure('Sorry, technical issues!');
  }
});
let queryTags = '';
let currentPage = 1;
let totalHits;

async function onClick() {
  try {
    console.log(input.value.trim(''));
    console.log(queryTags);
    currentPage = 1;
    const options = {
      key: '42678686-e89dbeb1c053e72710a9523f7',
      q: input.value.trim(''),
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
    };
    queryTags = input.value.trim('');
    const url = `https://pixabay.com/api/?key=${options.key}&q=${options.q}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&per_page=${options.per_page}`;
    const data = await axios.get(url, options);
    const list = data.data.hits;
    totalHits = data.data.totalHits;
    if (data.data.hits.length === 0) {
      input.value = '';
      Notiflix.Notify.failure('No matching images. Sorry...');
    }

    renderGallery(list);
    simplelightbox();
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    currentPage += 1;
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  loadMoreBtn.disabled = false;
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
