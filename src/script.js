(function () {
    let currentMode = "all";
    let activeCount = 0;
    let completedCount = 0;

    let input = document.querySelector("#user-input");
    let clearButton = document.querySelector("#clear-button");
    let toggleAllButton = document.querySelector("#toggle-all");

    input.focus();

    enableCustomFunctions();
    enableModes();
    enableToggleAllButton();
    enableClearCompletedButton();
    enableForm();

    function enableCustomFunctions() {
        Element.prototype.hasClass = function (className) {
            return this.classList.contains(className);
        }
        Element.prototype.removeClass = function (className) {
            this.classList.remove(className);
        }
        Element.prototype.addClass = function (className) {
            this.classList.add(className);
        }
        Element.prototype.toggleClass = function (className) {
            this.classList.toggle(className);
        }
    }
    function enableModes() {
        let modes = document.querySelectorAll(".mode");
        modes.forEach(mode => {
            mode.addEventListener("click", event => {
                if (mode.id !== currentMode) {
                    currentMode = mode.id;
                    let items = document.querySelectorAll(".item");

                    items.forEach(item => {
                        if (currentMode == "all") {
                            item.removeClass("display-none");
                        }
                        else if (currentMode == "active") {
                            let hideOrShow = item.hasClass("completed") ? item.addClass("display-none") : item.removeClass("display-none");
                        }
                        else if (currentMode == "completed") {
                            let showOrHide = item.hasClass("completed") ? item.removeClass("display-none") : item.addClass("display-none");
                        }
                    });

                    for (let i = 0; i < modes.length; i++) {
                        if (mode.id == modes[i].id) {
                            modes[i].addClass("selected");
                        }
                        else {
                            modes[i].removeClass("selected");
                        }
                    }
                }
                else {
                    return;
                }
            });
        });

    }
    function enableToggleAllButton() {
        toggleAllButton.addEventListener("click", function () {
            let items = document.querySelectorAll(".item");

            items.forEach(item => {
                if (toggleAllButton.hasClass("black-text") && item.hasClass("completed")) {
                    activateItem(item);
                }
                else if (!toggleAllButton.hasClass("black-text") && !item.hasClass("completed")) {
                    completeItem(item);
                }
            });

            toggleAllButton.toggleClass("black-text");
            showActiveCount(activeCount);

            let showOrHideClearBtn = completedCount > 0 ? clearButton.removeClass("invisible") : clearButton.addClass("invisible");
        });
    }
    function enableClearCompletedButton() {
        document.querySelector("#clear-button").addEventListener("click", event => {
            clearCompleted();
        });
    }
    function enableForm() {
        document.querySelector("#form").addEventListener("submit", event => {
            event.preventDefault();

            if (input.value.length) {
                toggleAllButton.removeClass("black-text");
                toggleAllButton.removeClass("display-none");
                addItem();
            }
            else {
                return;
            }
        });
    }
    function addItem() {
        let list = document.querySelector("#item-list");
        let item = document.createElement("li");
        item.addClass("item");
        if (currentMode == "completed")
            item.addClass("display-none");

        let img = document.createElement("img");
        img.src = "checkbox-unchecked.svg";

        let label = document.createElement("label");
        label.textContent = input.value;

        let deleteButton = document.createElement("button");
        deleteButton.innerText = "×";
        deleteButton.addClass("display-none");

        item.appendChild(img);
        item.appendChild(label);
        item.appendChild(deleteButton);
        list.appendChild(item);

        let footer = document.querySelector("footer");
        footer.removeClass("display-none");

        document.querySelector("#form").reset();

        activeCount++;
        enableCheckbox(item);
        enableDeleteButton(item);
        showActiveCount(activeCount);
    }
    function enableCheckbox(item) {

        let image = item.querySelector("img");
        image.addEventListener("click", event => {
            let activateOrCompleteItem = item.hasClass("completed") ? activateItem(item) : completeItem(item);
            let showOrHideClearBtn = completedCount > 0 ? clearButton.removeClass("invisible") : clearButton.addClass("invisible");
            let blackOrGraytoggleAllButton = activeCount > 0 ? toggleAllButton.removeClass("black-text") : toggleAllButton.addClass("black-text");
            showActiveCount(activeCount);
        });

    }
    function enableDeleteButton(item) {

        let deleteButton = item.querySelector("button");
        deleteButton.addEventListener("click", event => {

            let updadeCount = item.hasClass("completed") ? completedCount-- : activeCount--;

            item.parentNode.removeChild(item);
            showActiveCount(activeCount);

            let itemsTotal = activeCount + completedCount;

            if (itemsTotal <= 0) {
                let footer = document.querySelector("footer");
                footer.addClass("display-none");
                toggleAllButton.addClass("display-none");
            }
            if (completedCount <= 0) {
                document.querySelector("#clear-button").addClass("invisible");
            }

            let blackOrGraytoggleAllButton = activeCount > 0 ? toggleAllButton.removeClass("black-text") : toggleAllButton.addClass("black-text");
        });
    }
    function showActiveCount(count) {
        let counterInput = document.querySelector("#item-counter");
        counterInput.innerText = count + " items left";
    }
    function clearCompleted() {
        let footer = document.querySelector("footer");

        let completedItems = document.querySelectorAll(".completed");
        completedItems.forEach(item => {
            completedCount--;
            item.parentNode.removeChild(item);
        });

        clearButton.addClass("invisible");

        showActiveCount(activeCount);
        let itemsTotal = activeCount + completedCount;

        if (itemsTotal <= 0) {
            footer.addClass("display-none");
            toggleAllButton.toggleClass("black-text");
            toggleAllButton.addClass("display-none");
        }
    }
    function completeItem(item) {
        item.querySelector("img").src = "checkbox-checked.svg";
        item.addClass("completed");

        completedCount++;
        activeCount--;

        if (currentMode == "active") {
            item.addClass("display-none");
        }
        else if (currentMode == "completed") {
            item.removeClass("display-none");
        }
    }
    function activateItem(item) {
        item.querySelector("img").src = "checkbox-unchecked.svg";
        item.removeClass("completed");

        activeCount++;
        completedCount--;

        if (currentMode == "completed") {
            item.addClass("display-none");
        }
        else if (currentMode == "active") {
            item.removeClass("display-none");
        }
    }
})();