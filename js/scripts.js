document.addEventListener('DOMContentLoaded', function () {

    /* ------- Navbar shrink + back-to-top + sticky CTA visibility ------- */
    const navbar    = document.getElementById('mainNav');
    const backTop   = document.getElementById('back-to-top');
    const stickyCta = document.getElementById('sticky-cta');

    function handleScroll() {
        const y = window.scrollY;
        if (navbar)  navbar.classList.toggle('navbar-shrink', y > 80);
        if (backTop) backTop.classList.toggle('show', y > 700);
        if (stickyCta) {
            const booking   = document.getElementById('booking');
            const beforeCta = y > 500;
            // Hide sticky CTA when user already reached the booking section
            const pastBooking = booking ? (window.innerHeight + y > booking.offsetTop) : false;
            stickyCta.classList.toggle('show', beforeCta && !pastBooking);
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ------- Smooth scroll with navbar offset ------- */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || this.closest('.gallery-tile')) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = (navbar ? navbar.offsetHeight : 0) + 8;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });

            // Close mobile menu if open
            const collapse = document.querySelector('.navbar-collapse.show');
            if (collapse && window.bootstrap) {
                bootstrap.Collapse.getInstance(collapse)?.hide();
            }
        });
    });

    /* ------- Reveal on scroll ------- */
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }

    /* ------- Gallery: "show more" + modal viewer ------- */
    const galleryMore = document.getElementById('gallery-more');
    if (galleryMore) {
        galleryMore.addEventListener('click', function () {
            document.querySelectorAll('.gallery-tile.is-hidden').forEach(el => el.classList.remove('is-hidden'));
            this.style.display = 'none';
        });
    }

    const galleryTiles = Array.from(document.querySelectorAll('.gallery-tile'));
    const modalEl      = document.getElementById('galleryModal');
    const modalImg     = document.getElementById('gallery-modal-img');
    const counter      = document.getElementById('gallery-counter');
    let currentIdx = 0;
    let bsModal    = null;

    function setGalleryImage(idx) {
        if (galleryTiles.length === 0) return;
        currentIdx = (idx + galleryTiles.length) % galleryTiles.length;
        const href = galleryTiles[currentIdx].getAttribute('href');
        if (modalImg) modalImg.src = href;
        if (counter)  counter.textContent = (currentIdx + 1) + ' / ' + galleryTiles.length;
    }

    if (modalEl && window.bootstrap) {
        bsModal = new bootstrap.Modal(modalEl);
    }

    galleryTiles.forEach((tile, idx) => {
        tile.addEventListener('click', function (e) {
            e.preventDefault();
            setGalleryImage(idx);
            bsModal?.show();
        });
    });

    document.getElementById('gallery-prev')?.addEventListener('click', () => setGalleryImage(currentIdx - 1));
    document.getElementById('gallery-next')?.addEventListener('click', () => setGalleryImage(currentIdx + 1));

    document.addEventListener('keydown', function (e) {
        if (!modalEl || !modalEl.classList.contains('show')) return;
        if (e.key === 'ArrowLeft')  setGalleryImage(currentIdx - 1);
        if (e.key === 'ArrowRight') setGalleryImage(currentIdx + 1);
    });

    /* ------- Footer year ------- */
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
});
