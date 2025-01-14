document.getElementById('mission_video').playbackRate = 1.4; // speed for target webm
document.getElementById('vision_video').playbackRate = 1.4; // speed for vision webm

window.addEventListener('load', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');
    console.log(fadeInElements);
    fadeInElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 500); // Adjust the delay as needed
    });
});