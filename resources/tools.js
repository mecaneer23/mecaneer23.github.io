function refreshNavbar() {
    setTimeout(() => innerNavbar(document.getElementsByClassName("header")[0].children[0]), 0.01);
    setTimeout(() => Array.from(document.getElementById("main-nav").children).forEach(item => innerNavbar(item)), 0.01);
}

function innerNavbar(item) {
    item = item.children[0];
    if (item.href === undefined) return;
    href = item.href.charAt(item.href.length - 1) === "/" ? item.href : item.href + "/";
    if (href !== document.URL) {
        item.classList.remove("current");
    } else {
        item.classList.add("current");
    }
}

function toggleMenu() {
    let menu = document.getElementById("burger-menu");
    if (menu.classList.contains("open")) {
        menu.classList.remove("open");
    } else {
        menu.classList.add("open");
    }
}

function innerColorscheme(theme) {
    document.body.setAttribute("data-theme", theme);
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
    let theme = document.body.getAttribute("data-theme");
    if (theme == "dark") {
        setColorscheme(event, "light");
    } else if (theme == "light") {
        setColorscheme(event, "dark");
    } else {
        console.log(theme);
    }
}

function updateTitle() {
    let titleEnding = window.location.host;
    if (!document.title.endsWith(" | " + titleEnding)) {
        document.title = document.title + " | " + titleEnding;
    }
}

var keys = {}
function handleKeyPress(event) {
    let { keyCode, type } = event;
    let isKeyDown = (type == 'keydown');
    keys[keyCode] = isKeyDown;

    if (isKeyDown && keys[69] && keys[71]) {
        window.location.pathname = "/easter-egg";
    }
};

function load() {
    try {
        refreshNavbar();
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => setColorscheme(e, null));
        document.getElementById("checkbox").addEventListener("click", toggleColorscheme);
        window.addEventListener("keyup", handleKeyPress);
        window.addEventListener("keydown", handleKeyPress);
        setColorscheme(null, (localStorage.getItem("colorscheme") ? localStorage.getItem("colorscheme") == "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light");
        updateTitle();
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
