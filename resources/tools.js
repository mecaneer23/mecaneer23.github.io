var root = document.getElementsByTagName('html')[0];

function refreshNavbar() {
    setTimeout(() => innerNavbar(document.getElementsByClassName("header")[0].children[0]), 0.01);
    setTimeout(() => Array.from(document.getElementById("main-nav").children).forEach(item => innerNavbar(item)), 0.01);
}

function innerNavbar(item) {
    try {
        if (item.href === undefined) return;
    } catch (e) {
        return;
    }
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
    if (root.classList.contains("dark")) {
        setColorscheme(event, "light");
    } else if (root.classList.contains("light")) {
        setColorscheme(event, "dark");
    }
}

function updateTitle() {
    if (!document.title.endsWith(" | " + window.location.host)) {
        document.title = document.title + " | " + window.location.host;
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
    let height = specificHeight === undefined ? (parseFloat(main.marginTop, 10) + parseFloat(main.marginBottom, 10) + parseFloat(main.height, 10) + 1) + "px" : specificHeight;
    document.getElementById("nav").style.height = height;
    console.log(height);
}

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
