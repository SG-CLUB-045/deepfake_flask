const pop_up = () => [0, 1].forEach(e => covers[e].classList.toggle("hidden"));
const about_us = () => [0, 2].forEach(e => covers[e].classList.toggle("hidden"));

const closeAll = () => {
    covers.forEach(e => e.classList.add("hidden"));

    setTimeout(() => {
        fileName.textContent = '';
        display.classList.remove("display-show");
        actionBtn.innerHTML = "Select";
        actionBtn.htmlFor = "video";
    }, 200);
}

const changeAction = () => {
    if (vid.files.length > 0) {
        const file = vid.files[0];

        display.src = URL.createObjectURL(file);
        display.classList.add("display-show")
        display.load(); display.play();

        fileName.textContent = `File Name: ${file.name}`;

        actionBtn.innerHTML = "Check for DeepFake";
        actionBtn.htmlFor = '';
        actionBtn.onclick = () => testForFile(file); 
    }
}

const testForFile = file => {
    const data = new FormData(); data.append("video", file);
    const loader = document.getElementById("loader-holder");

    loader.classList.remove("hidden");
    
    fetch('/api', {
        method: 'POST', body: data
    })
    .then(res => res.json())
    .then(data => {
        ["output", "confidence"].forEach(e => {
            const elem = document.getElementById(e);
            elem.innerHTML += data[e]; elem.classList.remove("d-none");
        });
    })
    .finally(() => {
        loader.classList.add("hidden");
    });
}

const covers = Array.from(document.getElementsByClassName("cover"));

const vid = document.getElementById("video");
const display = document.getElementById("display");

const fileName = document.getElementById("fileName");
const actionBtn = document.getElementById("action-btn");