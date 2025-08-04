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

var print_btn = document.getElementById("print-button");
if (print_btn) {
    print_btn.onclick = function () {
        window.print();
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const sections = document.querySelectorAll('section[id]');

    function activateLinkOnScroll() {
        let current = "";
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
            if (scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });
        navLinks.forEach(link => {
            const linkHref = link.getAttribute("href");
            if (!linkHref) return;
            link.classList.remove("active");
            if (
                (linkHref === `#${current}`) ||
                (linkHref === `/#${current}`)
            ) {
                link.classList.add("active");
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            const href = this.getAttribute("href");
            if (href.startsWith("#") || href.startsWith("/#")) {
                // Do nothing: scroll handler will update active
            } else {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
            if (!this.classList.contains('dropdown-toggle')) {
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
                    bsCollapse.hide();
                }
            }
        });
    });

    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
                bsCollapse.hide();
            }
        });
    });

    window.addEventListener('scroll', activateLinkOnScroll);

    // Set initial active state after DOM loads
    setTimeout(activateLinkOnScroll, 100);
});


document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById('main-navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 60) {
            navbar.classList.add('navbar-shrink');
        } else {
            navbar.classList.remove('navbar-shrink');
        }
    });
});