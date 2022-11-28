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

function setPair(key, value) {
    this.setProperty(key, value);
    return this;
}

function to_dark_mode() {
    let root = document.querySelector(":root").style
    root.setPair("--")
    // getpropertyvalue
}

function onload() {
    refresh_navbar();
}