/*
  home.js - Home page (hero + featured venues/matches + stats)
*/
(function(){
  const { qs, qsa, el, loadComponent, venues, feedPosts, toast } = window.IE108

  // Render featured venues
  function renderFeaturedVenues() {
    const container = qs('#featured-venues-list')
    if (!container) return

    const featured = venues.filter(v => v.featured)
    
    container.innerHTML = featured.map(venue => `
      <div class="featured-venue-card">
        <div class="featured-venue-image">
          <img src="${venue.img}" alt="${venue.name}" onerror="this.src='https://via.placeholder.com/400x200?text=Sân+bóng'">
          <div class="featured-venue-badge">${venue.rating}⭐</div>
        </div>
        <div class="featured-venue-content">
          <h3 class="featured-venue-name">${venue.name}</h3>
          <div class="featured-venue-info">
            <span>${venue.type}</span>
            <span class="featured-venue-rating">${venue.rating}</span>
          </div>
          <div class="featured-venue-price">${venue.price.toLocaleString()} ₫</div>
          <div class="featured-venue-tags">
            ${venue.tags.map(tag => `<span class="featured-venue-tag">${tag}</span>`).join('')}
          </div>
          <div class="featured-venue-action">
            <button class="btn btn-primary" onclick="localStorage.setItem('selectedVenue', '${venue.id}'); window.location.href='venues.html'">Xem chi tiết</button>
          </div>
        </div>
      </div>
    `).join('')
  }

  // Render featured matches
  function renderFeaturedMatches() {
    const container = qs('#featured-matches-list')
    if (!container) return

    const featured = feedPosts.filter(p => p.featured)
    
    container.innerHTML = featured.map(post => `
      <div class="featured-match-card">
        <div class="featured-match-badge">Nổi bật</div>
        <div class="featured-match-header">
          <div class="featured-match-team">${post.team}</div>
          <span class="featured-match-level">${post.level}</span>
        </div>
        <div class="featured-match-meta">
          <div class="featured-match-meta-item">
            <i class="fa-solid fa-map-pin"></i>
            <span>${post.place}</span>
          </div>
          <div class="featured-match-meta-item">
            <i class="fa-solid fa-clock"></i>
            <span>${post.time}</span>
          </div>
          <div class="featured-match-meta-item">
            <i class="fa-solid fa-money-bill"></i>
            <span>${post.cost.toLocaleString()}đ</span>
          </div>
        </div>
        <div class="featured-match-description">${post.text}</div>
        <div class="featured-match-footer">
          <div class="featured-match-need">Cần <span class="need-count">${post.need}</span> người</div>
          <div class="featured-match-action">
            <button class="btn btn-primary" onclick="window.location.href='matchfeed.html'">Xem thêm</button>
            <button class="btn btn-ghost" onclick="alert('Gửi lời mời tham gia')">Tham gia</button>
          </div>
        </div>
      </div>
    `).join('')
  }

  async function init() {
    console.log('🏠 Home page loading...')
    
    // Load page components
    await loadComponent('#hero-root', 'components/hero.html')
    await loadComponent('#featured-venues-root', 'components/featured-venues.html')
    await loadComponent('#featured-matches-root', 'components/featured-matches.html')
    await loadComponent('#stats-root', 'components/stats.html')

    // Render featured content AFTER components are loaded
    renderFeaturedVenues()
    renderFeaturedMatches()

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
})()

  if (document.readyState === 'complete') {
    setTimeout(init, 100)
  }
})()
