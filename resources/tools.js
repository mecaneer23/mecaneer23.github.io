function refresh_navbar() {
    setTimeout(() => inner_navbar(document.getElementsByClassName("header")[0].children[0]), 0.01);
    setTimeout(() => Array.from(document.getElementById("main-nav").children).forEach(item => inner_navbar(item)), 0.01);
}

function inner_navbar(item) {
    item = item.children[0];
    if (item.href === undefined) return;
    href = item.href.charAt(item.href.length -1) === "/" ? item.href : item.href + "/";
    if (href !== document.URL) {
        item.classList.remove("current");
    } else {
        item.classList.add("current");
    }
}

function toggle_menu() {
    let menu = document.getElementById("burger-menu");
    if (menu.classList.contains("open")) {
        menu.classList.remove("open");
    } else {
        menu.classList.add("open");
    }
}

function inner_colorscheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("colorscheme", theme);
}

function set_colorscheme(event, theme) {
    if (theme !== null) {
        inner_colorscheme(theme);
        return;
    }
    if (event.matches) {
        inner_colorscheme("dark");
    } else {
        inner_colorscheme("light");
    }
}

function toggle_colorscheme(event) {
    let theme = document.body.getAttribute("data-theme");
    if (theme == "dark") {
        set_colorscheme(event, "light");
    } else if (theme == "light") {
        set_colorscheme(event, "dark");
    } else {
        console.log(theme);
    }
}

function onload() {
    refresh_navbar();
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => set_colorscheme(e, null));
    document.getElementById("checkbox").addEventListener("click", toggle_colorscheme);
    set_colorscheme(null, (localStorage.getItem("colorscheme") ? localStorage.getItem("colorscheme") == "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light");
}

window.addEventListener("load", () => {
    setTimeout(onload, 30);
});
