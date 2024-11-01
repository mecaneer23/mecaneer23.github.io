var root = document.getElementsByTagName('html')[0];
var weirdTheme = false;
var modalData = {
    isOpen: false,
    scrolled: false
};
const MODAL_ANIMATION_DELAY = 400;

function pageIs(name) {
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

function setModalContent(event, type, src) {
    if (modalData.isOpen) {
        return;
    }
    const modalElement = document.getElementById("modal");

    if (modalElement.style.display === "none") {
        event.preventDefault();
    }

    modalElement.style.display = "block";
    Array.from(modalElement.childNodes).forEach((child) => {
        modalElement.removeChild(child);
    });

    const newElem = document.createElement(type);
    newElem.id = "modal-content";
    newElem.src = src;

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

    newElem.onload = adjustSizeAndPosition;
    modalData.isOpen = true;
}

function modal(event) {
    if (
        pageIs("portfolio")
        && event.srcElement.parentElement.href.indexOf("github.com") == -1
    ) {
        try {
            setModalContent(event, "iframe", event.srcElement.parentElement.href)
            return;
        } catch (err) {
            console.error("threw error " + err + " while trying to construct modal iframe");
        }
    }
    setModalContent(event, "img", event.srcElement.src)
}

function closeModal(_) {
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
    contentElement.style.transition = `all ${MODAL_ANIMATION_DELAY}ms ease-in-out`;

    setTimeout(() => {
        modalElement.style.display = "none";
        modalElement.removeChild(contentElement);
    }, MODAL_ANIMATION_DELAY);

    modalData.scrolled = false;
    modalData.isOpen = false;
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
    } else {
        menu.classList.add("open");
        updateSideNavHeight();
    }
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

function toggleWeirdColorscheme(event) {
    root.classList.add("weird");
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

var keys = {}
function handleKeyPress(event) {
    let { keyCode, type } = event;
    let isKeyDown = (type == 'keydown');
    keys[keyCode] = isKeyDown;

    if (isKeyDown && keys[69] && keys[71]) { // e + g
        goToSecretPage();
    } else if (isKeyDown && keys[66] && keys[82]) { // b + r
        doABarrelRoll();
    } else if (modalData.isOpen) {
        closeModal();
    }
};

function goToSecretPage() {
    window.location.pathname = "/easter-egg";
}

function doABarrelRoll(event) {
    event.preventDefault()
    root.classList.add('spinner');
    setTimeout(() => root.classList.remove('spinner'), 3500);
}

function updateSideNavHeight(specificHeight) {
    let main = window.getComputedStyle(document.getElementsByTagName("main")[0]);
    let height = specificHeight === undefined ? "calc(" + (parseFloat(main.marginTop, 10) + parseFloat(main.marginBottom, 10) + parseFloat(main.height, 10)) + "px + 1vh)" : specificHeight;
    document.getElementById("nav").style.height = height;
}

function weirdThemeHandler(event) {
    weirdTheme = true;
    setTimeout(() => {
        if (weirdTheme) {
            toggleWeirdColorscheme();
        }
    }, 3500);
    weirdTheme = false;
}

function weirdThemeHandlerSetFalse(event) {
    weirdTheme = false;
}

function refreshNavbar() {
    Array.from(document.getElementById("main-nav").children)
        .forEach((link) => {
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
        document.getElementById("checkbox").addEventListener("click", toggleColorscheme);
        document.getElementsByClassName("no-padding")[0].addEventListener("mouseover", weirdThemeHandler);
        document.getElementsByClassName("no-padding")[0].addEventListener("mouseout", weirdThemeHandlerSetFalse);
        if (pageIs("portfolio")) {
            Array.from(document.getElementsByTagName("img")).forEach((img) => img.addEventListener("contextmenu", modal));
        }
        if (pageIs("about")) {
            document.querySelector("img.profile").addEventListener("contextmenu", doABarrelRoll);
        }
        if (pageIs("about") || pageIs("gallery") || pageIs("chilling")) {
            Array.from(document.querySelectorAll("img")).forEach((img) => img.addEventListener("click", modal));
        }
        if (document.querySelector("#modal") != null) {
            document.getElementById("modal").addEventListener("click", closeModal);
        }
        window.addEventListener("keyup", handleKeyPress);
        window.addEventListener("keydown", handleKeyPress);
        initBackToTop();
        window.addEventListener("scroll", handleScroll);
        updateTitle();
        refreshNavbar();
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

window.addEventListener("load", () => {
    loader();
});
