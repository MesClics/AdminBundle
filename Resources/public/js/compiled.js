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
window.addEventListener("load", function () {
    let filters = document.querySelectorAll(".oocss-filters");
    let filtersList = new Object();

    if (filters) {
        let activeFilters = new Object();

        function addActiveFitler(filter, filtersBlockClass, filterGroup) {
            if (!activeFilters[filtersBlockClass][filterGroup]) {
            }

            activeFilters[filtersBlockClass][filterGroup].push(filter);
            //console.log(activeFilters);
        }

        function removeActiveFilter(filter, filtersBlockClass, filterGroup) {
            let updatedFilters = activeFilters[filtersBlockClass][filterGroup].filter(function (el) {
                //console.log(filter, el);
                return el != filter;
            });
            //console.log(updatedFilters);
            activeFilters[filtersBlockClass][filterGroup] = updatedFilters;
        }

        function applyFiltersToList(filters, list) {
            for (let i = 0; i < list.length; i++) {
                let isFilterCompatible = null;
                if (filters.length > 0) {
                    isFilterCompatible = false;
                    filters.forEach(function (f) {
                        if (list[i].classList.contains(f.class)) {
                            isFilterCompatible = true;
                        }
                    });
                } else {
                    isFilterCompatible = true;
                }


                if (isFilterCompatible === false) {
                    list[i].classList.add("oocss-filtered-out");
                } else if (isFilterCompatible === true) {
                    list[i].classList.remove("oocss-filtered-out");
                }
            }

            return list;
        }

        function resetFilters(list) {
            for (let i = 0; i < list.length; i++) {
                list[i].classList.remove("oocss-filtered-out");
            }
            return list;
        }

        for (let i = 0; i < filters.length; i++) {
            let filtersBlock = filters[i];
            //get the filter target elts
            let filterTargetBlockClass = filtersBlock.getAttribute("data-filters-target-class");
            if (!activeFilters[filterTargetBlockClass]) {
                activeFilters[filterTargetBlockClass] = new Object();
            }
            activeFilters[filterTargetBlockClass][i] = new Array();

            let filterTargetElts = document.querySelector('.' + filterTargetBlockClass).querySelectorAll(".oocss-filterable");
            let filtersListValues = Object.values(filtersList);
            let listAlreadyExists = filtersListValues.find(function (element) {
                return element;
            });
            if (!listAlreadyExists) {
                filtersList[filterTargetBlockClass] = filterTargetElts;
            }


            //insert title for filters block
            let filtersTitleConfig = filtersBlock.getAttribute("data-filters-title").split("/");
            let filtersTitleTag = filtersTitleConfig[0].split(".")[0];
            let filtersTitleTagClass = filtersTitleConfig[0].split(".")[1];
            let filtersTitle = filtersTitleConfig[1];
            if (filtersTitle) {
                let filtersBlockTitle = document.createElement(filtersTitleTag);
                if (filtersTitleTagClass) {
                    filtersBlockTitle.classList.add(filtersTitleTagClass);
                }
                filtersBlockTitle.textContent = filtersTitle;

                filtersBlock.parentNode.insertBefore(filtersBlockTitle, filtersBlock);
            }
            //get the filters config and the button model
            let config = filtersBlock.getAttribute("data-filters").split("|");
            let filterButtonModel = filtersBlock.querySelector(".oocss-filters-button");

            if (filterButtonModel) {
                filterButtonModel.remove();
            }
            //forEach filters input, create one html button
            for (let f = 0; f < config.length; f++) {
                let filterStr = config[f].split("/");
                let filter = new Object();
                filterStr.forEach(function (config) {
                    let key = config.split(":")[0];
                    let value = config.split(":")[1];
                    filter[key] = value;
                });


                //get the button model and delete it from DOM
                let filterButton = null;
                if (filterButtonModel) {
                    filterButton = filterButtonModel.cloneNode(true);
                    let filterButtonTextContent = filterButton.querySelector('[data-filters-button-textContent]');
                    filterButtonTextContent.textContent = filter.name;
                } else {
                    filterButton = document.createElement("button");
                    filterButton.classList.add("oocss-filters-button");
                    filterButton.textContent = filter.name;
                }
                //replace every @filter.class in children Nodes by filter.class property
                filterButton.querySelectorAll(".oocss-filters-button-class").forEach(function (el) {
                    el.classList.remove("oocss-filters-button-class");
                    el.classList.add(filter.class);
                });


                //add eventListeners to button
                filterButton.addEventListener("click", function (e) {
                    let button = null
                    if (e.target.classList.contains("oocss-filters-button")) {
                        button = e.target;
                    } else {
                        button = findAncestor(e.target, "oocss-filters-button");
                    }
                    let buttonEventActivate = new CustomEvent("activate", { "detail": { "filter": filter } });
                    let buttonEventDeactivate = new CustomEvent("deactivate", { "detail": { "filter": filter } });
                    button.classList.toggle("active");

                    //dipatch an Event on the button to handle the button activation.
                    if (button.classList.contains("active")) {
                        filterButton.dispatchEvent(buttonEventActivate);
                    } else {
                        filterButton.dispatchEvent(buttonEventDeactivate);
                    }
                });

                //append
                filtersBlock.append(filterButton);

                //listen on the activate event
                filterButton.addEventListener("activate", function (e) {
                    //add an element to the activeFilters obj
                    addActiveFitler(e.detail.filter, filterTargetBlockClass, i);
                    let activeFiltersEvent = new CustomEvent("activeFiltersChange", { "detail": { "activeFilters": activeFilters[filterTargetBlockClass], "toBeFilteredList": filtersList[filterTargetBlockClass] } });
                    filtersBlock.dispatchEvent(activeFiltersEvent);
                });

                filterButton.addEventListener("deactivate", function (e) {
                    //remove the element from the activeFilters obj
                    removeActiveFilter(e.detail.filter, filterTargetBlockClass, i);
                    let activeFiltersEvent = new CustomEvent("activeFiltersChange", { "detail": { "activeFilters": activeFilters[filterTargetBlockClass], "toBeFilteredList": filtersList[filterTargetBlockClass] } });
                    filtersBlock.dispatchEvent(activeFiltersEvent);
                });

            }

            filtersBlock.addEventListener("activeFiltersChange", function (e) {

                let filters = Object.values(e.detail.activeFilters);
                let list = Array.from(e.detail.toBeFilteredList);
                let noActiveFiltersInGroup = 0;

                for (let i = 0; i < filters.length; i++) {
                    if (filters[i].length > 0) {
                        list = applyFiltersToList(filters[i], list);
                        list = list.filter(function (el) {
                            return !el.classList.contains("oocss-filtered-out");
                        });
                    } else {
                        noActiveFiltersInGroup++;

                        if (noActiveFiltersInGroup == filters.length) {
                            list = resetFilters(list);
                        }
                    }
                }
            });
        }
    }
});
var clickableTableRows = document.querySelectorAll(".oocss-clickable-table-row");

for(let i = 0; i < clickableTableRows.length; i++){
    let clickableTableRow = clickableTableRows[i];

    let link = clickableTableRow.getElementsByTagName("a")[0].getAttribute("href");

    if(link) {
        clickableTableRow.addEventListener("click", function (e) {
            window.location.href = link;
        });

    }
}
//# sourceMappingURL=compiled.js.map
