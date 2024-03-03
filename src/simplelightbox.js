import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

export const simplelightbox = () => {
  if (lightbox) {
    lightbox.destroy();
  }

  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
};
