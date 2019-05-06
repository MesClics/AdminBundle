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