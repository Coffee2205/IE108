/*
  home.js - Home page (hero + stats)
*/
(function(){
  const { qs, qsa, el, loadComponent, venues, toast } = window.IE108

  async function init() {
    console.log('🏠 Home page loading...')
    
    // Load page components
    await loadComponent('#hero-root', 'components/hero.html')
    await loadComponent('#stats-root', 'components/stats.html')

    // Setup quick booking form
    const quickBookingForm = qs('#quick-booking')
    if (quickBookingForm) {
      quickBookingForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const area = qs('#area').value
        const type = qs('#pitch-type').value
        const date = qs('#date').value || 'mọi ngày'
        const filtered = venues.filter((venue) => venue.area === area && venue.type === type)
        toast(`Đang tìm ${type} tại ${area} cho ${date} (${filtered.length} kết quả)`)
        // Navigate to venues page with filter
        localStorage.setItem('venueFilter', JSON.stringify({ area, type }))
        window.location.href = 'venues.html'
      })
    }

    // Quick booking buttons
    qsa('button.btn-primary, button.btn-ghost', qs('#hero-root')).forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.textContent.includes('Đặt sân')) {
          window.location.href = 'venues.html'
        } else if (btn.textContent.includes('đối thủ')) {
          window.location.href = 'matchfeed.html'
        }
      })
    })

    console.log('✅ Home page initialized')
  }

  // Wait for shared setup, then init page
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
      setTimeout(init, 100)
    }
  })

  if (document.readyState === 'complete') {
    setTimeout(init, 100)
  }
})()
