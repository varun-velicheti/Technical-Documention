/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/* Menu show */
if(navToggle){
   navToggle.addEventListener('click', () =>{
      navMenu.classList.add('show-menu')
   })
}

/* Menu hidden */
if(navClose){
   navClose.addEventListener('click', () =>{
      navMenu.classList.remove('show-menu')
   })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
   const navMenu = document.getElementById('nav-menu')
   // When we click on each nav__link, we remove the show-menu class
   navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== SHADOW HEADER ===============*/
const shadowHeader = () =>{
   const header = document.getElementById('header')
   // Add a class if the bottom offset is greater than 50 of the viewport
   this.scrollY >= 50 ? header.classList.add('shadow-header')
                      : header.classList.remove('shadow-header')
}

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () =>{
   const scrollUp = document.getElementById('scroll-up')
   // When the scroll is higher than 350 viewport height, add the show-scroll class
   this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                       : scrollUp.classList.remove('show-scroll')
}

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
   const scrollDown = window.scrollY

   sections.forEach(current =>{
      const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

      if(!sectionsClass) return

      if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
         sectionsClass.classList.add('active-link')
      }else{
         sectionsClass.classList.remove('active-link')
      }
   })
}

/* One passive scroll listener, at most once per frame */
let scrollQueued = false
window.addEventListener('scroll', () => {
   if (scrollQueued) return
   scrollQueued = true
   requestAnimationFrame(() => { shadowHeader(); scrollUp(); scrollActive(); scrollQueued = false })
}, { passive: true })

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
   origin: 'top',
   distance: '40px',
   duration: 900,        // snappy: content is there as you arrive
   delay: 80,
   viewFactor: .1,
   // reset: true, // Animations repeat
})

sr.reveal(`.home__data, .favorite__description, .footer__container`)
sr.reveal(`.favorite__pack`, {interval: 60, distance: '24px'})
sr.reveal(`.care__bowl, .contact__img`, {origin: 'bottom'})
sr.reveal(`.care__list, .contact__data`, {origin: 'bottom', delay: 200})
sr.reveal(`.banner__item, .products__card`, {interval: 50})
