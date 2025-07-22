function parseVideoTitle(title) {
    let [name, car, event, track, driver] = title.split(' | ');
    return {
        name,
        car,
        event,
        track,
        driver,
    }
}

async function buildGallery(videos) {
    const gallery = document.getElementById('video-gallery');
    const labels = new Set();
    const defaultDriver = "Mecaneer23";
    for (let id of videos) {
        const videoTitle = await fetch(`https://api.playerx.io/oembed?url=https://www.youtube.com/watch?v=${id}`)
            .then(response => response.json())
            .then(data => data.title);

        const card = document.createElement('a');
        card.classList.add('portfolio-card');
        card.href = `https://www.youtube.com/watch?v=${id}`;

        let parsedTitle = parseVideoTitle(videoTitle);

        const thumbnail = document.createElement('img');
        thumbnail.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        thumbnail.classList.add('thumbnail');
        thumbnail.alt = `Thumbnail for ${parsedTitle.name} video`;
        card.appendChild(thumbnail);

        const title = document.createElement('h3');
        title.classList.add('video-card-title');
        title.textContent = parsedTitle.name;
        card.appendChild(title);

        const event = document.createElement('p');
        event.classList.add('video-card-event');
        event.textContent = parsedTitle.event;
        card.appendChild(event);
        labels.add(parsedTitle.event);

        const track = document.createElement('p');
        track.classList.add('video-card-track');
        track.textContent = parsedTitle.track;
        card.appendChild(track);
        labels.add(parsedTitle.track);

        const car = document.createElement('p');
        car.classList.add('video-card-car');
        car.textContent = parsedTitle.car;
        card.appendChild(car);
        labels.add(parsedTitle.car);

        if (parsedTitle.driver !== defaultDriver) {
            if (!labels.has(defaultDriver)) {
                labels.add(defaultDriver);
            }
            const driver = document.createElement('p');
            driver.classList.add('video-card-driver');
            driver.textContent = parsedTitle.driver;
            card.appendChild(driver);
            labels.add(parsedTitle.driver);
        }

        card.dataset.videoId = id;

        gallery.appendChild(card);
    }
    console.log("Labels:", Array.from(labels).sort().join(', '));
}

buildGallery([
    "mbkfff-S2zU",
    "nMZrSdiTNWA",
    "6hsDIV0GnkA",
    "3Zt_6KRTVnA",
    "QHYgmLixB8w",
    "cKGwXQK9vCA",
    "dI-OYXi_F2Y",
    "mMDEL-l7G40",
    "xbAJCkjp_9o",
    "N_hYaMPB-B8",
    "BvIzHKu9Ltg",
    "oARmJUbhhMs",
]);
