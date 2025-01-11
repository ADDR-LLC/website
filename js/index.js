
var currentPageUrl = ''; // global

function loadContent(url) {
    var iframe = document.getElementById('contentFrame');
    iframe.src = url;
    currentPageUrl = url; // curr url
    iframe.onload = function() {
        iframe.style.display = 'block';
    };
}



// function changeNavbarColor(page) {
//     var navbar = document.getElementById('navbar');
//     switch(page) {
//         case 'home':
//             navbar.style.borderBottomColor = 'blue';
//             break;
//         case 'mission':
//             navbar.style.borderBottomColor = 'green';
//             break;
//         case 'concept':
//             navbar.style.borderBottomColor = 'purple';
//             break;
//         case 'contact':
//             navbar.style.borderBottomColor = 'red';
//             break;
//         default:
//             navbar.style.borderBottomColor = 'grey';
//     }
// }