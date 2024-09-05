const createElem = (type, att) => Object.assign(document.createElement(type), {... att});

const pop_up = () => [0, 1].forEach(e => covers[e].classList.toggle("hidden"));
const about_us = () => [0, 2].forEach(e => covers[e].classList.toggle("hidden"));

const closeAll = () => {
    covers.forEach(e => e.classList.add("hidden"));

    const context = canva.getContext('2d');
    context.clearRect(0, 0, canva.width, canva.height);

    setTimeout(() => {  
        canva.classList.add("non-expand");
        vid.value = '';
    }, 200);
}

const covers = Array.from(document.getElementsByClassName("cover"));
const canva = document.getElementById('thumbnail');

const vid = document.getElementById("video");

vid.addEventListener('change', e => {
    const file = e.target.files[0];

    if (file) {
        const elem = createElem("video", {src:URL.createObjectURL(file), preload:'metadata', muted:true});
        
        elem.addEventListener('loadeddata', () => {
            const context = canva.getContext('2d');

            elem.currentTime = 1;
            elem.addEventListener('seeked', function() {
                context.drawImage(elem, 0, 0, canva.width, canva.height);
            });

            canva.classList.remove("non-expand");
        });

        elem.load();
    }
});