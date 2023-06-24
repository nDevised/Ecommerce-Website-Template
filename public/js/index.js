// Assuming you have the following variables defined:
var imageCount = 3; // The total number of images in the directory
var captions = { // JSON object containing the image names and corresponding captions
  0: "First Image Caption",
  1: "Second Image Caption",
  2: "THird Image Caption"
  // Add more image captions here...
};

// Assuming you have a reference to the parent container element
var slideshowContainer = document.querySelector('.slideshow-container');

// Iterate over the image files and generate the slideshow elements
for (var i = 0; i < imageCount; i++) {
  var imageNumber = i + 1;
  var imageName = i + '.webp';
  var caption = captions[imageNumber - 1] || '';

  // Create the slideshow element
  var slide = document.createElement('div');
  slide.className = 'mySlides fade';

  // Create the number text element
  var numberText = document.createElement('div');
  numberText.className = 'numbertext';
  numberText.textContent = imageNumber + ' / ' + imageCount;

  // Create the image element
  var image = document.createElement('img');
  image.src = '/images/banner/' + imageName;
  image.style.width = '100%';

  // Create the caption text element
  var captionText = document.createElement('div');
  captionText.className = 'text';
  captionText.textContent = caption;

  // Append the elements to the slide
  slide.appendChild(numberText);
  slide.appendChild(image);
  slide.appendChild(captionText);

  // Append the slide to the slideshow container
  slideshowContainer.appendChild(slide);
}

let slideIndex = 1;
showSlides(slideIndex);

// Switch the slide every 5 seconds


// Next/previous controls
function incrementSlide() {
  showSlides(slideIndex += 1);
}


// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}