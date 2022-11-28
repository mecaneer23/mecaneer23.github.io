function refresh_navbar() {
    setTimeout(() => inner_navbar(document.getElementById("header").children[0]), 0.01);
    setTimeout(() => Array.from(document.getElementById("main-nav").children).forEach(item => inner_navbar(item)), 0.01);
}

function inner_navbar(item) {
    item = item.children[0];
    if (item.href !== document.URL) {
        item.classList.remove("current");
    } else {
        item.classList.add("current");
    }
}

function set_colorscheme(event, theme) {
    if (theme !== null) {
        document.body.setAttribute("data-theme", theme);
        return;
    }
    if (event.matches) {
        document.body.setAttribute("data-theme", "dark");
    } else {
        document.body.setAttribute("data-theme", "light");
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

window.addEventListener("load", () => {
    refresh_navbar();
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => set_colorscheme(e, null));
    document.getElementById("toggle").addEventListener("click", toggle_colorscheme);
    set_colorscheme(null, window.matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light");
})