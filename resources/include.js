function includeHTML() {
    let elem, file, xhttp, allElements = document.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
        elem = allElements[i];
        file = elem.getAttribute("w3-include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elem.innerHTML = this.responseText; }
                    if (this.status == 404) { elem.innerHTML = "Page not found."; }
                    elem.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}
includeHTML();