/*
  contact.js - Contact page
*/
(function(){
  const { qs, loadComponent, toast } = window.IE108

  async function init() {
    console.log('📞 Contact page loading...')
    
    // Load contact component
    await loadComponent('#contact-root', 'components/contact.html')

    // Update contact links to point to correct pages
    const contactLinks = qs('#contact-root')
    if (contactLinks) {
      qsa('a[href^="#"]', contactLinks).forEach((link) => {
        const href = link.getAttribute('href')
        if (href === '#venues') link.setAttribute('href', 'venues.html')
        if (href === '#matchfeed') link.setAttribute('href', 'matchfeed.html')
      })
    }

    console.log('✅ Contact page initialized')
  }

  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
      setTimeout(init, 100)
    }
  })

  if (document.readyState === 'complete') {
    setTimeout(init, 100)
  }
})()
