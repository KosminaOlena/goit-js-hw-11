import fetchImages from './fetchGallery';
import './sass/common.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-btn')
let page;
let query = '';
const perPage = 40;

searchForm.addEventListener('submit', onSearchImages);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchImages(e)
{
    e.preventDefault();
    page = 1;
    query = e.currentTarget.searchQuery.value.trim(); 
    gallery.innerHTML = '';
    loadMoreBtn.classList.add('is-hidden');

    if (query === '') {
        Notiflix.Notify.failure('Enter what we will be looking for.');
        return;
    } else {
        fetchImages(query, page, perPage)
        .then(({ data }) => {
            if (Number(data.totalHits) === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            } else if (data.totalHits > perPage)
            {
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
                renderMarkup(data.hits); 
                simpleLightBox = new SimpleLightbox('.gallery a').refresh();
                loadMoreBtn.classList.remove('is-hidden');
            } else {
                Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
                 renderMarkup(data.hits); 
                simpleLightBox = new SimpleLightbox('.gallery a').refresh();  
            }
        })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
    }
    
    
}
function onLoadMore(e) {
    loadMoreBtn.classList.add('is-hidden');
    simpleLightBox.destroy();
    page += 1;
    fetchImages(query, page, perPage)
        .then(({ data }) => {
            const currentTotal = Number(data.totalHits) - (page - 1) * perPage;
            if (currentTotal <= perPage) {
                Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
            } else {
                Notiflix.Notify.success(`Hooray! We found ${currentTotal} images.`);
                loadMoreBtn.classList.remove('is-hidden');
            } 
                renderMarkup(data.hits);
                simpleLightBox = new SimpleLightbox('.gallery a').refresh();       
        })
        .catch(error => console.log(error));
}

function renderMarkup(data) {
    const markup = data.map(data => {
        const { largeImageURL, webformatURL, tags, likes, views, comments, downloads } = data;
        return `<div class="photo-card">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
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
</div>
`
    }).join('');
    gallery.insertAdjacentHTML('beforeend', markup);
}


