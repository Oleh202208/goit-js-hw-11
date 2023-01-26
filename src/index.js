import { fetchPhotos } from "./js/fetchPhotos";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';


let page = 1;
let gallery = new SimpleLightbox('div.gallery a', {
  captionsData: 'alt',
  captionDelay: 500,
});

const form = document.querySelector('#search-form');
const div = document.querySelector('.gallery');
const input = document.querySelector('input');
const divGuard = document.querySelector('.js-guard');

form.addEventListener('submit', onSubmitForm);
input.addEventListener('input', onInput);

function onSubmitForm(e) {
  e.preventDefault();
  page = 1;
  getData(input.value, page);
}

function onInput(e) {
  if (e.target.value) {
    div.innerHTML = '';
  }
}

async function getData(query, page) {
  try {
    const data = await fetchPhotos(query, page);
    renderImages(data);
    gallery.refresh();
    observer.observe(divGuard);
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

function renderImages({ data: { hits: arrOfImages }, data: { totalHits } }) {
  notifixForMessage(arrOfImages, totalHits);

  const markup = arrOfImages
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `<div class="photo-card">
  <a href="${largeImageURL}" class="gallery__item"><img src="${webformatURL}" alt="${tags}" class="gallery__link"  loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div></a>`;
    })
    .join('');

  div.insertAdjacentHTML('beforeend', markup);
}


function notifixForMessage(arrOfImages, totalHits) {
  if (page === 1 && arrOfImages.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (page > totalHits / 40 && arrOfImages.length !== 0) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  if (page === 1 && arrOfImages.length !== 0) {
    console.log(page);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}

const options = {
  root: null,
  rootMargin: '250px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      getData(input.value, page).then(data => {
        const {
          data: { hits },
        } = data;

        if (page === 13 || hits.length < 40) {
          observer.unobserve(divGuard);
        }
      });
    }
  });
}