// Find the closest ancestor of el with class cls

function findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}
var loader = document.querySelector(".loader");
var animationOn = false;

// //on vérifie s'il y a un form nouveau message
// var newMsg = document.querySelector(".message-form__d__new");

// //on ajoute un eventlistener sur l'animation
// newMsg.addEventListener('animationstart', function(e){
//     animationOn = true;
// });

// newMsg.addEventListener('animationend', function(e){
//     animationOn = false;
//     loaderClassAdder();
// })

function loaderClassAdd() {
    loader.classList.add("loader-active");    
}

function loaderClassRemove(){
    loader.addEventListener('animationiteration', function(e){
        e.target.classList.remove("loader-active");
    });

    loader.addEventListener('webkitAnimationIteration', function (e) {
        e.target.classList.remove("loader-active");
    });

    loader.addEventListener('MSAnimationIteration', function (e) {
        e.target.classList.remove("loader-active");
    });
    
    
    // loader.classList.remove("loader-active");
}

window.addEventListener('beforeunload', function(e){

    if(animationOn){
        return;
    }

    //check if popup is active
    var popup = document.querySelector('.popup');
    if(popup && !popup.classList.contains('closed')){
        popup.classList.add('closed');
    }
    loaderClassAdd();
});

window.addEventListener('load', function (e) {
    if(loader.classList.contains("loader-active")){
        loaderClassRemove();
    }
});

var form = document.querySelector('.message-form__d__new');
var hasBeenAnimated = false;

function messageAddClass(e){
    e.target.classList.add('message-form__d__new__s__sent');
    hasBeenAnimated = true;
}

if(form && !hasBeenAnimated){
    form.addEventListener('submit', function (e) {
            messageAddClass(e);
    });
};
var slideshows = document.querySelectorAll(".oocss-slideshow");

for (let i = 0; i < slideshows.length; i++) {
    //variables
    let slideshow = slideshows[i];
    let steps = slideshow.querySelectorAll(".oocss-slideshow--step");
    let slideshowContent = slideshow.querySelector(".oocss-slideshow--content");
    let slider = slideshow.querySelector(".oocss-slideshow--slider");
    let cursors = slider.querySelector(".oocss-slideshow--cursors");
    let prevBtn = slideshow.querySelector(".oocss-slideshow--prev");
    let nextBtn = slideshow.querySelector(".oocss-slideshow--next");

    //functions
    function handleFocus(step) {
        step.setAttribute("tabindex", null);
        let childrenElts = step.getElementsByTagName("input", "textarea", "button", "select");
        if (childrenElts.length > 0) {
            for (let i = 0; i < childrenElts.length; i++) {
                childElt = childrenElts[i];
                childElt.addEventListener("keydown", function (e) {
                    if (e.shiftKey && e.keyCode == 9) {
                        if (i == 0) {
                            //check if prevBtn display is not none
                            if (prevBtn.style.display !== "none") {
                                e.preventDefault();
                                clickOnPrevBtn();
                            }
                        }
                    } else if (e.keyCode == 9 || e.keyCode == 13) {
                        if (i === childrenElts.length - 1) {
                            if (nextBtn.style.display !== "none") {
                                e.preventDefault();
                                clickOnNextBtn();
                            }
                        } else if (i == 0) {
                            e.preventDefault();
                            //get next input and select
                            childrenElts[i + 1].select();
                        }
                    }
                });
            }
        }
    }

    function clickOnCursor(step) {
        let stepOrder = step.getAttribute("data-step-order");
        slideTo(stepOrder);
    }

    function getHTMLOrder(step) {
        let steps = slideshow.querySelectorAll(".oocss-slideshow--step");
        for (i = 0; i < steps.length; i++) {
            if (steps[i] == step) {
                return i;
            }
        }
    }

    function slideTo(stepNb) {
        let step = slideshowContent.querySelector("[data-step-order='" + stepNb + "']");
        if (!step) {
            console.log("pas de data-step-order");
            step = steps[stepNb - 1];
        }
        let stepHTMLOrder = getHTMLOrder(step);
        let translateX = "calc(-1 * " + window.getComputedStyle(slideshowContent).width + " * " + (stepHTMLOrder) + ")";
        slideshowContent.style.transform = "translateX(" + translateX + ")";
        slideshow.setAttribute("data-active-step", stepNb);

        //hide prevBtn or Next Btn if first or last step
        if (stepNb == 1) {
            prevBtn.style.display = "none";
        } else {
            prevBtn.style.display = "block";
        }
        if (stepNb == steps.length) {
            nextBtn.style.display = "none";
        } else {
            nextBtn.style.display = "block";
        }

        //add active class to active cursor item
        let cursorItems = cursors.querySelectorAll(".oocss-slideshow--cursor");
        for (let n = 1; n <= cursorItems.length; n++) {
            if (n == stepNb) {
                cursorItems[n - 1].classList.add("active");
            } else {
                cursorItems[n - 1].classList.remove("active");
            }
        };

        //focus on first element;
        //let step = slideshow.querySelector("[data-step-order='" + stepNb + "']");
        let stepFirstFocusableChild = step.getElementsByTagName("input", "textarea", "button", "select")[0];

        if (stepFirstFocusableChild) {
            stepFirstFocusableChild.select();
        }
    }

    function clickOnPrevBtn() {
        let activeStep = slideshow.getAttribute("data-active-step");
        activeStep--;
        slideTo(activeStep);
    }

    function clickOnNextBtn() {
        let activeStep = slideshow.getAttribute("data-active-step");
        activeStep++;
        slideTo(activeStep);
    }

    function rewindSlideshow() {
        slideTo(1);
    }

    function autoplaySlideshow() {
        let speed = null;
        if (slideshow.getAttribute("autoplay") && slideshow.getAttribute("autoplay") == "true") {
            speed = parseInt(slideshow.getAttribute("data-slideshow-speed"));
            //set a default speed value in ms
            if (!speed) {
                speed = 5000;
            }
        };
        if (speed) {
            setInterval(function () {
                autoSlide();
            }, speed);
        }
    }

    function autoSlide() {
        let steps = slideshow.querySelectorAll(".oocss-slideshow--step");
        let currentActiveStep = slideshow.getAttribute("data-active-step");
        let nextStep = (parseInt(currentActiveStep) + 1);

        if (nextStep <= steps.length) {
            slideTo(nextStep);
        } else {
            rewindSlideshow();
        }
    }

    //on page load check for slider && rewind slideshow
    window.addEventListener("load", function (e) {
        //Create prev btn, next btn and cursor divs if not present
        if (prevBtn == null) {
            let prevBtn = document.createElement("button");
            prevBtn.classList.add("oocss-slideshow--prev");
            prevBtn.textContent = "←";
            slider.append(prevBtn);
        }
        if (cursors == null) {
            let cursors = document.createElement("div");
            cursors.classList.add("oocss-slideshow--cursors");
            slider.append(cursors);
        }
        if (nextBtn == null) {
            let nextBtn = document.createElement("button");
            nextBtn.classList.add("oocss-slideshow--next");
            nextBtn.textContent = "→";
            slider.append(nextBtn);
        }

        prevBtn = slideshow.querySelector(".oocss-slideshow--prev");
        cursors = slideshow.querySelector(".oocss-slideshow--cursors");
        nextBtn = slideshow.querySelector(".oocss-slideshow--next");

        //add listener on prev and next btns
        prevBtn.addEventListener("click", function (e) {
            clickOnPrevBtn();
        });
        nextBtn.addEventListener("click", function (e) {
            clickOnNextBtn();
        });


        //set the grid-template-columns of the slideshow-content block based on the steps number  
        slideshowContent.style.gridTemplateColumns = "repeat(" + steps.length + ", 100%)";

        for (let n = 0; n < steps.length; n++) {
            let step = steps[n];
            //set the slideshow--slider based on the number of steps
            let cursor = document.createElement("button");
            cursor.classList.add("oocss-slideshow--cursor");
            cursor.setAttribute("data-step-order", (n + 1));


            //add listeners on button click
            cursor.addEventListener("click", function (e) {
                clickOnCursor(e.target);
            });
            cursors.append(cursor);
            //handle Focus on each step child element
            handleFocus(step);
        }

        rewindSlideshow();
        autoplaySlideshow();
    });


}
//# sourceMappingURL=compiled.js.map
