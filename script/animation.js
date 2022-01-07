/*
 * Preload all images
 */

// get image url for the section with frame index
const getImageUrl = (section, index) => {
  if (section <= 0 || section == 4) return `./assets/images/Sequence_01/sh_010.00001.png`;
  if (section > 4) section = section - 1

  return `./assets/images/Sequence_${section.toString().padStart(2, "0")}/sh_${section
    .toString()
    .padStart(2, "0")}0.${index.toString().padStart(5, "0")}.png`;
}


// Preload the images
for (let s = 1; s <= 5; s++) {
  for (let i = 1; i <= 30; i++) {
    const img = new Image();
    img.src = getImageUrl(s, i);
  }
}

/*
 * Initialize some useful methods from fullpage plugin
 */
var $ = fp_utils.$,
  addClass = fp_utils.addClass,
  removeClass = fp_utils.removeClass;

/*
 * declare some dom variables
 */
const canvas = $("#anican")[0];
const context = canvas.getContext("2d");
const img = new Image();


/*
 * Update the canvas
 */
window.addEventListener("resize", () => updateCanvas());
const updateCanvas = () => {
  const width = window.innerWidth;
  canvas.width = width
  canvas.height = width * (9 / 16);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  const availablePadding = window.innerHeight - canvas.height

  canvas.style.marginTop = (availablePadding / 2) + "px";
  canvas.style.marginBottom = (availablePadding / 2) + "px";

}

updateCanvas()

img.onload = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
};

var scrollingSpeed = 2500;

/*
 * Add Entry animation
 */
function animateInterSection(originIndex, destinationIndex, direction) {
  // Generate the imagesList
  var imagesList = [];
  if (direction === "up") {
    // if the direction is upwards images from 15-1 will be taken from origin and 30-16 from destination
    for (var i = 15; i > 0; i--) {
      imagesList.push(getImageUrl(originIndex, i));
    }
    for (var i = 30; i > 15; i--) {
      imagesList.push(getImageUrl(destinationIndex, i));
    }
  } else if (direction === "down") {
    // if the direction is downwards images from 16-30 will be taken from origin and 1-15 from destination
    for (var i = 16; i < 31; i++) {
      imagesList.push(getImageUrl(originIndex, i));
    }
    for (var i = 1; i < 16; i++) {
      imagesList.push(getImageUrl(destinationIndex, i));
    }
  }

  var index = 0;
  var interval = setInterval(function () {
    index++;
    if (index < 30) {
      img.src = imagesList[index];
    } else if (index > 30) {
      clearInterval(interval);
    }
  }, scrollingSpeed / 30);
}

/*
 * Initialize the fullPage plugin
 */
new fullpage("#fullpage", {
  touchWrapper: document,
  // sectionsColor: ['#52afef', '#349234', 'red', 'blue', 'green', 'cyan', 'magenta', '#52afef', '#349234', 'red', 'blue', 'green', 'cyan', 'magenta', '#52afef', '#349234', 'red', 'blue', 'green', 'cyan', 'magenta',],
  scrollingSpeed: scrollingSpeed,
  // easingcss3: "steps(2, jump-none)",
  onLeave: (origin, destination, direction) => {
    animateInterSection(origin.index, destination.index, direction);

    // Animate the content
    const leftHalfOrigin = $("#leftHalf", origin.item)[0];
    const rightHalfOrigin = $("#rightHalf", origin.item)[0];
    const leftHalfDestination = $("#leftHalf", destination.item)[0];
    const rightHalfDestination = $("#rightHalf", destination.item)[0];

    var duration = scrollingSpeed / 1000 / 2;
    var tl = gsap.timeline();
    tl.fromTo(rightHalfOrigin, { opacity: 1 }, { x: "100", opacity: 0, duration: duration });
    tl.fromTo(rightHalfDestination, { x: "100", opacity: 0 }, { x: "0", opacity: 1, duration: duration });

    var tr = gsap.timeline();
    tr.fromTo(leftHalfOrigin, { opacity: 1 }, { x: "-100", opacity: 0, duration: duration });
    tr.fromTo(leftHalfDestination, { x: "-100", opacity: 0 }, { x: "0", opacity: 1, duration: duration });
    // content animation ends here

  },
});
