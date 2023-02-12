import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import throttle from "lodash.throttle";
import "simplelightbox/dist/simple-lightbox.min.css"
import fetchImages from './fetchImages';

const refs = {
    formEl: document.querySelector('.search-form'),
    loadMoreBtn: document.querySelector('.load-more'),
    galleryEl: document.querySelector('.gallery')
}

const queryImage = {
    qeury: '',
    page: 1,
}

refs.formEl.addEventListener('submit', onFormSubmit)
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick)

async function onFormSubmit(e){
  e.preventDefault();
  refs.loadMoreBtn.classList.remove("hidden")
  queryImage.page = 1;
  queryImage.qeury = e.currentTarget.elements.searchQuery.value.trim();
    refs.galleryEl.innerHTML = "";

    if (queryImage.qeury === "") {
        refs.galleryEl.innerHTML = "";
        refs.loadMoreBtn.classList.add("hidden")
        Notiflix.Notify.info("Sorry, we don can give you all images on WWW. Pleas, write somesing")
        return
    }

    // fetchImages.fetchImages(queryImage).then(res => {
    //     if(res.length === 0) {
    //     refs.galleryEl.innerHTML = "";
    //     refs.loadMoreBtn.classList.add("hidden")
    //     Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.")
    //     return
    //     }
    // })
  const res = await fetchImages.fetchImages(queryImage)
    if(res.length === 0) {
      refs.galleryEl.innerHTML = "";
      refs.loadMoreBtn.classList.add("hidden")
      Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.")
      return
      }
  

    console.log(queryImage)
    onLoadMoreClick()
}


async function onLoadMoreClick() {
    refs.loadMoreBtn.disabled = true;
    refs.loadMoreBtn.textContent = "Loading..."
  

    // fetchImages.fetchImages(queryImage).then(res => {
    //   queryImage.page += 1;
    //   markupImages(res);
    //   console.log(res)
    //   gallery.refresh()
    //   refs.loadMoreBtn.disabled = false;
    //   refs.loadMoreBtn.textContent = "Load more";
    //   if (res.length < 40) {
    //     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    //     refs.loadMoreBtn.classList.add('hidden');
    //   }
    // })
  
  const res = await fetchImages.fetchImages(queryImage)
        queryImage.page += 1;
      markupImages(res);
      console.log(res)
      gallery.refresh()
      refs.loadMoreBtn.disabled = false;
      refs.loadMoreBtn.textContent = "Load more";
  if (res.length < 40) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.classList.add('hidden');
  }


}


function markupImages(images) {
    const markup = images.map(image => `<div class="photo-card">
   <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="400px" height="244px" style="object-fit:cover;"/></a>
   <div class="info">
     <p class="info-item">
       <b>Likes <br>${image.likes}</b>
     </p>
     <p class="info-item">
       <b>Views <br>${image.views}</b>
     </p>
     <p class="info-item">
       <b>Comments <br>${image.comments}</b>
     </p>
     <p class="info-item">
       <b>Downloads <br>${image.downloads}</b>
     </p>
   </div>
 </div>`).join('');
    refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}


var gallery = new SimpleLightbox('.gallery a', {
    captionPosition: 'outside',
    captionDelay: 250,
})



// function checkPosition() {
//   // Нам потребуется знать высоту документа и высоту экрана:
//   const height = document.body.offsetHeight
//   const screenHeight = window.innerHeight

//   // Они могут отличаться: если на странице много контента,
//   // высота документа будет больше высоты экрана (отсюда и скролл).

//   // Записываем, сколько пикселей пользователь уже проскроллил:
//   const scrolled = window.scrollY

//   // Обозначим порог, по приближении к которому
//   // будем вызывать какое-то действие.
//   // В нашем случае — четверть экрана до конца страницы:
//   const threshold = height - screenHeight / 4

//   // Отслеживаем, где находится низ экрана относительно страницы:
//   const position = scrolled + screenHeight

//     if (position >= threshold) {
//         console.log("red line")
//         fetchImages.fetchImages(queryImage).then(res => {
//         queryImage.page += 1;
//         markupImages(res);
//         console.log(res)
//         gallery.refresh()
//         refs.loadMoreBtn.disabled = false;
//         refs.loadMoreBtn.textContent = "Load more";
//     }).catch(error => {
//         Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
//         refs.loadMoreBtn.classList.add('hidden');
//     })
//     // Если мы пересекли полосу-порог, вызываем нужное действие.
//   }
// }

//  window.addEventListener('scroll', throttle(checkPosition, 500))
//  window.addEventListener('resize', throttle(checkPosition, 500))    