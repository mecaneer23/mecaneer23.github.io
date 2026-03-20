import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas-pro@1.6.6/+esm';
window.toOffice = toOffice;

async function takeAndStoreScreenshot() {
    const canvas = await html2canvas(document.body, {
        useCORS: true,
        scrollX: -window.pageXOffset,
        scrollY: -window.pageYOffset,
        width: window.innerWidth,
        height: window.innerHeight,

        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight
    });

    sessionStorage.removeItem("screenshot");
    sessionStorage.setItem("screenshot", canvas.toDataURL("image/png"));
    return canvas.toDataURL("image/png");
}


async function toOffice() {
    await takeAndStoreScreenshot();
    document.body.style.opacity = 0;
    setTimeout(() => {
        window.location.href = "/office?return=" +
            encodeURIComponent(window.location.pathname);
    }, 200);
}