var root = document.getElementsByTagName('html')[0];
var weirdTheme = false;

function pageIs(name) {
    return window.location.pathname.indexOf(name) > -1
}

function toTop(event) {
    root.scrollTop = 0;
}

function initBackToTop() {
    backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton == null) return;
    backToTopButton.addEventListener("click", toTop);
}

function backToTop(event) {
    offset = 300
    backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton == null) return;
    if (root.scrollTop > offset) {
        backToTopButton.style.display = "flex";
        backToTopButton.style.transform = 'rotate(' + (root.scrollTop - offset) % 360 + 'deg)';
    } else {
        backToTopButton.style.display = "none";
    }
}

function set_modal_content(modalElement, type, src) {
    Array.from(modalElement.childNodes).forEach((child) => {
        modalElement.removeChild(child)
    });
    const newElem = document.createElement(type);
    newElem.id = "modal-content";
    newElem.src = src;
    newElem.addEventListener("mouseout", closeModal);
    modalElement.appendChild(newElem);
}

function modal(event) {
    modalElement = document.getElementById("modal");
    if (modalElement.style.display == "none") {
        event.preventDefault();
    }
    modalElement.style.display = "block";
    if (
        pageIs("portfolio")
        && event.srcElement.parentElement.href.indexOf("github.com") == -1
    ) {
        try {
            set_modal_content(modalElement, "iframe", event.srcElement.parentElement.href)
            return;
        } catch (err) {
            console.error("threw error " + err + " while trying to construct modal iframe");
        }
    }
    set_modal_content(modalElement, "img", event.srcElement.src)
}

function closeModal(event) {
    document.getElementById("modal").style.display = "none";
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
    } else {
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
    links = Array.from(document.getElementById("main-nav").children);
    // links.push(document.getElementById("title-link"));
    links.forEach((link) => {
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
            window.addEventListener("click", closeModal);
        }
        if (pageIs("about")) {
            document.querySelector("img.profile").addEventListener("contextmenu", doABarrelRoll);
        }
        if (pageIs("about") || pageIs("gallery")) {
            Array.from(document.querySelectorAll("img")).forEach((img) => img.addEventListener("click", modal));
        }
        document.getElementById("modal").addEventListener("click", closeModal);
        window.addEventListener("keyup", handleKeyPress);
        window.addEventListener("keydown", handleKeyPress);
        initBackToTop();
        window.addEventListener("scroll", backToTop);
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
