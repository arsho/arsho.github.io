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

// document.addEventListener('DOMContentLoaded', function () {
//     const navLinks = document.querySelectorAll('.navbar-collapse .nav-link');
//     const navbarCollapse = document.querySelector('.navbar-collapse');
//
//     navLinks.forEach(link => {
//         link.addEventListener('click', function () {
//             // Remove active from all nav links
//             navLinks.forEach(l => l.classList.remove('active'));
//             // Add active to the clicked link
//             this.classList.add('active');
//
//             // Collapse navbar if open (mobile)
//             if (navbarCollapse.classList.contains('show')) {
//                 const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
//                 bsCollapse.hide();
//             }
//         });
//     });
// });
//
// document.addEventListener('DOMContentLoaded', function () {
//     const sections = document.querySelectorAll('section[id]');
//     const navLinks = document.querySelectorAll('.navbar .nav-link');
//
//     function activateLinkOnScroll() {
//         let current = "";
//
//         sections.forEach(section => {
//             const sectionTop = section.offsetTop - 70; // Adjust offset for fixed header
//             if (window.scrollY >= sectionTop) {
//                 current = section.getAttribute("id");
//             }
//         });
//
//         navLinks.forEach(link => {
//             link.classList.remove("active");
//             if (link.getAttribute("href") === `#${current}`) {
//                 link.classList.add("active");
//             }
//         });
//     }
//
//     window.addEventListener('scroll', activateLinkOnScroll);
// });


document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar-collapse .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // Nav link click handler
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            // Remove active from all nav links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active to the clicked link
            this.classList.add('active');

            // Collapse only if not dropdown toggle (for mobile)
            if (!this.classList.contains('dropdown-toggle')) {
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
                    bsCollapse.hide();
                }
            }
        });
    });

    // Collapse navbar after picking a dropdown item (on mobile)
    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
                bsCollapse.hide();
            }
        });
    });

    // Scroll-based nav active state (no changes)
    const sections = document.querySelectorAll('section[id]');

    function activateLinkOnScroll() {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 70; // Adjust for header
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener('scroll', activateLinkOnScroll);
});
