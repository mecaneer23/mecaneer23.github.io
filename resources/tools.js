var root = document.getElementsByTagName('html')[0];
var weirdTheme = false;
var modalData = {
    isOpen: false,
    scrolled: false
};
const MODAL_ANIMATION_DELAY = 400;
const initialDPR = window.devicePixelRatio || 1; // TODO: account for page reload after zooming

function pageNameIncludes(name) {
    return window.location.pathname.indexOf(name) > -1
}

function toTop(_) {
    root.scrollTop = 0;
}

function initBackToTop() {
    backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton == null) return;
    backToTopButton.addEventListener("click", toTop);
}

function handleScroll(_) {
    offset = 300
    if (document.getElementById("burger-menu").classList.contains("open")) {
        toggleMenu();
    }
    backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton == null) return;
    if (root.scrollTop > offset) {
        backToTopButton.style.display = "flex";
        backToTopButton.style.transform = 'rotate(' + (root.scrollTop / 4 - offset) % 360 + 'deg)';
    } else {
        backToTopButton.style.display = "none";
    }

    if (modalData.isOpen) {
        modalData.scrolled = true;
    }
}

function cycleModalImage(backward) {
    if (!modalData.isOpen) {
        return;
    }

    modalData.scrolled = true;
    const modalElement = document.getElementById("modal");
    const container = document.querySelector(".gallery");
    const overflowIndex = backward ? container.children.length - 1 : 0;
    const splitCurrentSrc = modalElement.querySelector("#modal-content").src.split("/");
    const currentElem = container
        .querySelector(`img[src$="${splitCurrentSrc[splitCurrentSrc.length - 1]}"]`);
    const adjacentElem = backward ? currentElem.previousElementSibling : currentElem.nextElementSibling;

    document.getElementById("modal-content").src = adjacentElem ? adjacentElem.src : container.children[overflowIndex].src;
}

function setModalContent(event, type, src) {
    if (modalData.isOpen) {
        return;
    }
    const modalElement = document.getElementById("modal");

    if (modalElement.style.display === "none") {
        event.preventDefault();
    }

    modalElement.style.display = "block";
    const modalContent = modalElement.querySelector("#modal-content");
    if (modalContent) modalElement.removeChild(modalContent);

    const newElem = document.createElement(type);
    newElem.id = "modal-content";
    newElem.src = src;
    if (type === "iframe") {
        newElem.setAttribute("allow", "autoplay");
    }

    const triggerRect = event.target.getBoundingClientRect();
    if (!modalData.isOpen) {
        modalData.triggerRect = triggerRect;
    }
    newElem.style.position = "absolute";
    newElem.style.userSelect = "none";
    newElem.style.top = `${triggerRect.top}px`;
    newElem.style.left = `${triggerRect.left}px`;
    newElem.style.width = `${triggerRect.width}px`;
    newElem.style.height = `${triggerRect.height}px`;
    newElem.style.transition = `all ${MODAL_ANIMATION_DELAY}ms ease-in-out`;

    modalElement.appendChild(newElem);

    const adjustSizeAndPosition = () => {
        const aspectRatio = newElem.naturalWidth / newElem.naturalHeight;

        const maxHeight = window.innerHeight * 0.9;
        const maxWidth = window.innerWidth * 0.9;

        let finalWidth, finalHeight;

        if (maxWidth / maxHeight > aspectRatio) {
            finalHeight = maxHeight;
            finalWidth = finalHeight * aspectRatio;
        } else {
            finalWidth = maxWidth;
            finalHeight = finalWidth / aspectRatio;
        }

        newElem.style.width = `${finalWidth}px`;
        newElem.style.height = `${finalHeight}px`;

        newElem.style.top = `calc(50% - ${finalHeight / 2}px)`;
        newElem.style.left = `calc(50% - ${finalWidth / 2}px)`;
    };

    const setSize = () => {
        newElem.style.width = "90vw";
        newElem.style.height = "90vh";
        newElem.style.top = "5vh";
        newElem.style.left = "5vw";
    };

    if (pageNameIncludes("gallery")) {
        newElem.addEventListener("click", closeModal);
    }
    newElem.onload = type === "img" ? adjustSizeAndPosition : setSize;
    modalData.isOpen = true;
}

async function modal(event) {
    if (
        pageNameIncludes("portfolio")
        && event.srcElement.parentElement.href.indexOf("github.com") == -1
    ) {
        try {
            setModalContent(event, "iframe", event.srcElement.parentElement.href)
            return;
        } catch (err) {
            console.error("threw error " + err + " while trying to construct modal iframe");
        }
    }
    if (pageNameIncludes("video-gallery")) {
        setModalContent(event, "iframe", `https://www.youtube.com/embed/${event.srcElement.parentElement.dataset.videoId}?autoplay=1&controls=1&enablejsapi=1`);
        return;
    }
    setModalContent(event, "img", event.srcElement.src)
}

function closeModal(_) {
    if (!modalData.isOpen) {
        return;
    }

    const modalElement = document.getElementById("modal");
    const contentElement = document.getElementById("modal-content");

    if (modalData.scrolled) {
        contentElement.style.top = "50vh";
        contentElement.style.left = "50vw";
        contentElement.style.width = 0;
        contentElement.style.height = 0;
    } else {
        const triggerRect = modalData.triggerRect;
        contentElement.style.top = `${triggerRect.top}px`;
        contentElement.style.left = `${triggerRect.left}px`;
        contentElement.style.width = `${triggerRect.width}px`;
        contentElement.style.height = `${triggerRect.height}px`;
    }

    setTimeout(() => {
        modalElement.style.display = "none";
        modalElement.removeChild(contentElement);
    }, MODAL_ANIMATION_DELAY);

    modalData.scrolled = false;
    modalData.isOpen = false;
}

function openMenu() {
    document.getElementById("burger-menu").classList.add("open");
    updateSideNavHeight();
    moveThemeSwitchTop(false);
}

function updateScale() {
    document.documentElement.style.setProperty(
        "--zoom-scale",
        window.devicePixelRatio / initialDPR
    );
}

function moveThemeSwitchTop(is_top) {
    return;
    const mainNav = document.querySelector("#main-nav")
    const themeSwitch = document.querySelector(".switch-li");
    if (is_top) {
        setTimeout(() => {
            mainNav.insertBefore(themeSwitch, mainNav.firstChild);
            return;
        }, 800);
    }
    mainNav.appendChild(themeSwitch);
}

function toggleMenu() {
    let menu = document.getElementById("burger-menu");
    if (menu.classList.contains("open")) {
        menu.classList.remove("open");
        setTimeout(() => {
            if (!menu.classList.contains("open")) {
                updateSideNavHeight("auto");
            }
        }, 1000);
        moveThemeSwitchTop(true);
        return;
    }
    openMenu();
}

function ensureATheme() {
    if (
        !root.classList.contains("dark")
        && !root.classList.contains("light")
    ) {
        root.classList.add("light");
        innerColorscheme("light");
    }
}

function innerColorscheme(theme) {
    root.classList.remove(theme == "light" ? "dark" : "light")
    root.classList.add(theme);
    localStorage.setItem("colorscheme", theme);
    document.querySelector(".switch").style.flexDirection = theme == "dark" ? "row-reverse" : "row";
    document.getElementById(theme == "light" ? "moon" : "sun").style.display = "block";
    document.getElementById(theme == "dark" ? "moon" : "sun").style.display = "none";
}

function setColorscheme(event, theme) {
    if (theme !== null) {
        innerColorscheme(theme);
        return;
    }
    if (event.matches) {
        innerColorscheme("dark");
    } else {
        innerColorscheme("light");
    }
}

function toggleColorscheme(event) {
    if (root.classList.contains("weird")) {
        root.classList.remove("weird");
        root.classList.add("dark");
        localStorage.setItem("colorscheme", "dark");
    }
    if (root.classList.contains("dark")) {
        setColorscheme(event, "light");
    } else if (root.classList.contains("light")) {
        setColorscheme(event, "dark");
    }
}

function toggleWeirdColorscheme(_) {
    root.classList.add("weird");
}

function addMouseHighlight(event) {
    const elem = this.querySelector(".underline-light");
    elem.style.display = "block";
    const { left, width } = this.querySelector(".nav-item-text").getBoundingClientRect();
    elem.style.left = (event.pageX - left) / width * 100 + "%";
}

function removeMouseHighlight(_) {
    this.querySelector('.underline-light').style.display = "none";
}

function updateTitle() {
    if (!document.title.endsWith(" | " + window.location.host)) {
        document.title = document.title + " | Gabriel Natenshon | " + window.location.host;
    }
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = "/favicon.ico";
}

function skipToMainContent(event) {
    event.preventDefault();
    const mainContent = document.querySelector("main");
    mainContent.setAttribute("tabindex", "-1");
    mainContent.focus();
    mainContent.removeAttribute("tabindex");
}

var keys = {}
function handleKeyPress(event) {
    let { keyCode, type } = event;
    let isKeyDown = (type == 'keydown');
    keys[keyCode] = isKeyDown;

    // Don't scroll when pressing space to close modal
    if (isKeyDown && (keys[32] || keys[38] || keys[40]) && event.target == document.body && modalData.isOpen) { // space
        event.preventDefault();
    }

    if (pageNameIncludes("gallery") && isKeyDown) {
        if (keys[39] || keys[40]) { // right arrow || down arrow
            cycleModalImage();
        } else if (keys[37] || keys[38]) { // left arrow || up arrow
            cycleModalImage(true);
        } else {
            closeModal();
        }
    }

    if (isKeyDown && keys[69] && keys[71]) { // e + g
        goToSecretPage();
    } else if (isKeyDown && keys[66] && keys[82]) { // b + r
        doABarrelRoll();
    } else if (!pageNameIncludes("gallery")) {
        closeModal();
    }
};

function goToSecretPage() {
    window.location.pathname = "/easter-egg";
}

function doABarrelRoll(event) {
    if (event) event.preventDefault();
    root.classList.add('spinner');
    setTimeout(() => root.classList.remove('spinner'), 3500);
}

function updateSideNavHeight(specificHeight) {
    let main = window.getComputedStyle(document.getElementsByTagName("main")[0]);
    let height = specificHeight === undefined ? "calc(" + (parseFloat(main.marginTop, 10) + parseFloat(main.marginBottom, 10) + parseFloat(main.height, 10)) + "px + 1vh)" : specificHeight;
    document.getElementById("nav").style.height = height;
}

function weirdThemeHandler(_) {
    weirdTheme = true;
    setTimeout(() => {
        if (weirdTheme) {
            toggleWeirdColorscheme();
        }
    }, 3500);
    weirdTheme = false;
}

function weirdThemeHandlerSetFalse(_) {
    weirdTheme = false;
}

function refreshNavbar() {
    Array.from(document.getElementById("main-nav").children)
        .forEach((elem) => {
            let link = elem.querySelector("a");
            if (!link) {
                return;
            }
            if (link.pathname.split("/")[1] === document.location.pathname.split("/")[1]) {
                link.classList.add('current');
            } else {
                link.classList.remove('current');
            }
        });
}

function getImageXHR(imageUrl, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', imageUrl, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
        if (xhr.status === 200) {
            var reader = new FileReader();
            reader.onloadend = function () {
                var dataUrl = reader.result;
                callback(dataUrl);
            };

            reader.readAsDataURL(xhr.response);
        }
    };

    xhr.send();
}

function convertHTMLtoPDF(caller, filename, queryToConvert) {
    let div = document.querySelector(queryToConvert);
    let css;
    setTimeout(function () {
    }, 10);
    setTimeout(function () {
        css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "/about/pdf.css";
        document.body.appendChild(css);
        caller.classList.add("disabled");
    }, 10);
    setTimeout(function () {
        html2pdf().set({
            filename: filename,
            image: {
                type: "jpeg",
                quality: 1,
            },
            html2canvas: {
                scrollY: 0,
                dpi: 192,
                scale: 4,
                letterRendering: true,
                useCORS: true,
            },
        }).from(div).outputPdf("bloburl", { filename: filename }).then((bloburl) => {
            window.open(bloburl);
        });
    }, 20);
    setTimeout(function () {
        document.body.removeChild(css);
        caller.classList.remove("disabled");
    }, 30);
}

function load() {
    try {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => setColorscheme(e, null));
        setColorscheme(null, (localStorage.getItem("colorscheme") ? localStorage.getItem("colorscheme") == "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light");
        document.getElementsByClassName("switch-container")[0].addEventListener("mouseover", weirdThemeHandler);
        document.getElementsByClassName("switch-container")[0].addEventListener("mouseout", weirdThemeHandlerSetFalse);
        Array.from(document.getElementsByClassName("nav-item")).forEach((element) => element.addEventListener("focus", openMenu));
        Array.from(document.querySelectorAll(".nav-item:not(.switch-container)")).forEach(element => {
            element.addEventListener("mousemove", addMouseHighlight);
            element.addEventListener("mouseout", removeMouseHighlight);
        });
        document.getElementById("current-year").innerHTML = (new Date()).getFullYear();
        if (pageNameIncludes("portfolio") || pageNameIncludes("auto-racing-video-gallery")) {
            Array.from(document.getElementsByTagName("img")).forEach((img) => {
                img.addEventListener("contextmenu", (event) => {
                    event.preventDefault();
                    modal(event);
                });
            });
        }
        if (pageNameIncludes("about")) {
            document.querySelector("img.profile").addEventListener("contextmenu", doABarrelRoll);
        }
        if (pageNameIncludes("about") || (pageNameIncludes("gallery") && !pageNameIncludes("video")) || pageNameIncludes("chilling")) {
            Array.from(document.querySelectorAll("img")).forEach((img) => {
                if (img.id !== "modal-content") {
                    img.addEventListener("click", modal);
                }
            });
        }
        if (document.querySelector("#modal") != null && (!pageNameIncludes("gallery") || pageNameIncludes("video-gallery"))) {
            document.getElementById("modal").addEventListener("click", closeModal);
        }
        window.addEventListener("keyup", handleKeyPress);
        window.addEventListener("keydown", handleKeyPress);
        initBackToTop();
        window.addEventListener("scroll", handleScroll);
        updateTitle();
        refreshNavbar();
        window.addEventListener('resize', updateScale);
        updateScale();
        return document.body.hasAttribute("data-theme");
    } catch (e) {
        console.log(e);
        return false;
    }
}

function loader() {
    let loaded = load();
    if (!loaded) {
        setTimeout(loader, 1);
    } else {
        load();
        return true;
    }
}

// Thanks to Yong Wang (https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists)
function waitForElem(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function removeLoadingScreen() {
    (await waitForElem("#loading-screen")).style.display = "none";
}

window.addEventListener("load", () => {
    loader();
    removeLoadingScreen();
});
