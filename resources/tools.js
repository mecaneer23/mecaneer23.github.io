var root = document.getElementsByTagName('html')[0];
var weirdTheme = false;

function modal(event) {
    modalElement = document.getElementById("modal");
    if (modalElement.style.display == "none") {
        event.preventDefault();
    }
    modalElement.style.display = "block";
    try {
        document.getElementById("modal-content").src = event.srcElement.parentElement.href;
    } catch (err) {
        if (document.getElementById("modal-content").nodeName != "IMG") {
            modalElement.removeChild(modalElement.childNodes[1])
            const newElem = document.createElement("img");
            newElem.id = "modal-content";
            newElem.src = event.srcElement.src;
            newElem.addEventListener("mouseout", closeModal);
            modalElement.appendChild(newElem);
        }
    }
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

function doABarrelRoll() {
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
    });}

function load() {
    try {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => setColorscheme(e, null));
        document.getElementById("checkbox").addEventListener("click", toggleColorscheme);
        document.getElementsByClassName("no-padding")[0].addEventListener("mouseover", weirdThemeHandler);
        document.getElementsByClassName("no-padding")[0].addEventListener("mouseout", weirdThemeHandlerSetFalse);
        Array.from(document.getElementsByTagName("img")).forEach((img) => img.addEventListener("contextmenu", modal))
        window.addEventListener("click", closeModal);
        window.addEventListener("keyup", handleKeyPress);
        window.addEventListener("keydown", handleKeyPress);
        setColorscheme(null, (localStorage.getItem("colorscheme") ? localStorage.getItem("colorscheme") == "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light");
        updateTitle();
        refreshNavbar();
        return document.body.hasAttribute("data-theme");
    } catch (e) {
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
