async function buildGallery(videos) {
    const gallery = document.getElementById('video-gallery');
    for (let id of videos) {
        const name = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`)
            .then(response => response.json())
            .then(data => data.title);

        const a = document.createElement('a');
        a.classList.add('portfolio-card');

        const thumbnail = document.createElement('img');
        thumbnail.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        thumbnail.classList.add('thumbnail');
        thumbnail.alt = `Thumbnail for ${name} video`;

        const title = document.createElement('p');
        title.classList.add('video-title');
        title.textContent = name;

        a.href = `https://www.youtube.com/watch?v=${id}`;

        a.appendChild(thumbnail);
        a.appendChild(title);

        gallery.appendChild(a);
    }
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
]);