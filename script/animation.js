/*
 * Preload all images
 */

// get image url for the section with frame index
const getImageUrl = (section, index) =>
    section <= 0
        ? `./assets/images/Sequence_01/sh_010.00001.png`
        : `./assets/images/Sequence_${section.toString().padStart(2, "0")}/sh_${section
            .toString()
            .padStart(2, "0")}0.${index.toString().padStart(5, "0")}.png`;

// Preload the images
for (let s = 1; s <= 4; s++) {
    for (let i = 1; i <= 30; i++) {
        const img = new Image();
        img.src = getImageUrl(s, i);
    }
}
/*
 * Update the canvas
 */
window.addEventListener("resize", () => updateCanvas());
const updateCanvas = () => {
  const width = window.innerWidth;
  canvas.width = width
  canvas.height = width * (9 / 16);

  const availablePadding = window.innerHeight - canvas.height

  canvas.style.marginTop = (availablePadding / 2) + "px";
  canvas.style.marginBottom = (availablePadding / 2) + "px";

}

updateCanvas()

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
* make the canvas fit to image aspect ratio 
* this can be even solved using 'aspect-ratio' css property
*/          
const width = window.innerWidth;
canvas.width = width
canvas.height =  width * (1080/1920) ; // find the required height from the original aspect ratio
// find the difference between canvas height and screen height
const availablePadding  = window.innerHeight - canvas.height
canvas.style.marginTop = (availablePadding/2)+"px";
canvas.style.marginBottom = (availablePadding/2)+"px";

img.onload = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
};

var scrollingSpeed = 2000;

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
    sectionsColor: ["#492432","blue","red","green","#f38294","#492432","blue","red","green","#f38294",],
    scrollingSpeed: scrollingSpeed,
    onLeave: (origin, destination, direction) => {
        animateInterSection(origin.index, destination.index, direction);

        const leftHalfDestination = $("#leftHalf", destination.item)[0];
        const rightHalfDestination = $("#rightHalf", destination.item)[0];

        const animateFromLeft = [
            {
                x: "0",
                opacity: 0,
            },
            {
                x: 0,
                opacity: 1,
            },
        ];
        const animateFromRight = [
            {
                x: "0",
                opacity: 0,
            },
            {
                x: 0,
                opacity: 1,
            },
        ];
        const animateFromBottom = [
            {
                y: "0",
                opacity: 0,
            },
            {
                y: 0,
                opacity: 0,
            },
        ];
        const animateFromTop = [
            {
                y: "0",
                opacity: 0,
            },
            {
                y: 0,
                opacity: 0,
            },
        ];
        const tl = new TimelineMax({
            delay: scrollingSpeed / 1000 ,
        });
        tl.fromTo(rightHalfDestination, 1, ...animateFromRight)
            .fromTo(leftHalfDestination, 1, ...animateFromLeft);
    },
});
