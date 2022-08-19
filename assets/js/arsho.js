const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

var back_to_top = document.getElementById("back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        back_to_top.classList.add("d-block");
        back_to_top.classList.remove("d-none");
    } else {
        back_to_top.classList.add("d-none");
        back_to_top.classList.remove("d-block");
    }
}

function scroll_to_top() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

back_to_top.addEventListener('click', () => {
    scroll_to_top();
});

