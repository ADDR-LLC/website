
var currentPageUrl = ''; // global

function loadContent(url) {
    var iframe = document.getElementById('contentFrame');
    iframe.src = url;
    currentPageUrl = url; // curr url
    iframe.onload = function() {
        placeholder.style.display = 'none';
        iframe.style.display = 'block';
    };
}