import { fetchPhotos } from "./js/fetchPhotos";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const divGallary = document.querySelector('gallery');



form.addEventListener('submit', onSubmitForm);
divGallary.addEventListener('click', onClickCard);