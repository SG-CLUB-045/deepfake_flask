const pop_up = () => {
    covers.forEach(e => e.classList.toggle("visible"));
}

const detectFile = () => {
    const vid = document.getElementById("video").files[0];
    const data = new FormData(); data.append("video", vid);

    fetch('/detect', {
        method: 'POST', body: data
    })
    .then(res => res.json())
    .then(data => {
        console.log('Success:', data);
    })
}

const covers = Array.from(document.getElementsByClassName("cover"));