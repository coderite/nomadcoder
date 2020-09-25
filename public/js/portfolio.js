(function () {
  document.querySelector('.container').style.display = 'none';
  console.log('waiting for page to load');
  window.addEventListener('load', () => {
    document.querySelector('.container').style.display = 'grid';
    document.querySelector('.load-container').style.display = 'none';
    console.log('page loaded');
  });

  /*
  check if hero image has loaded
   */
  const heroImageUrl = getComputedStyle(document.querySelector('.hero'))
    .backgroundImage.slice(4, -1)
    .replace(/"/g, '');
  let heroImage = new Image();
  heroImage.src = heroImageUrl;
  console.log('hero image url found ' + heroImageUrl);
  heroImage.addEventListener('load', () => {
    if (heroImage.complete) {
      console.log('hero image loaded');
    }
  });

  const images = document.querySelectorAll('img');
  console.log('number of images: ' + images.length);
  images.forEach((image) => {
    image.addEventListener('load', () => {
      console.log('loaded: ' + image.getAttribute('src'));
    });
  });
})();
