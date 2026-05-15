/*
  venues.js - Venues listing and booking page
*/
(function(){
  const { qs, qsa, el, loadComponent, venues, toast } = window.IE108
  let state = { activeVenueId: null }

  function renderVenues(list) {
    const grid = qs('#venues-grid')
    if (!grid) return
    grid.innerHTML = ''

    list.forEach((venue) => {
      const card = el('article', { className: 'card venue-card' })
      card.innerHTML = `
        <img class="venue-card__image" src="${venue.img}" alt="${venue.name}">
        <div class="venue-card__body">
          <h3 class="venue-card__title">${venue.name}</h3>
          <div class="venue-card__meta">
            <div class="venue-card__rating"><i class="fa-solid fa-star"></i> ${venue.rating.toFixed(1)}</div>
            <span class="venue-price">${venue.price.toLocaleString('vi-VN')}đ</span>
          </div>
          <div class="venue-card__address">${venue.addr}</div>
          <div class="venue-card__tags">${venue.tags.map((tag) => `<span class="badge">${tag}</span>`).join('')}</div>
          <div class="venue-card__footer">
            <span class="venue-status ${venue.status === 'available' ? 'available' : venue.status === 'busy' ? 'busy' : 'hold'}">
              ${venue.status === 'available' ? 'Còn trống' : venue.status === 'busy' ? 'Đã đặt' : 'Đang giữ chỗ'}
            </span>
            <button class="btn btn-primary js-open-venue" data-id="${venue.id}">Đặt sân</button>
          </div>
        </div>
      `
      grid.appendChild(card)
    })

    qsa('.js-open-venue', grid).forEach((button) => {
      button.addEventListener('click', () => openVenueDetail(Number(button.dataset.id)))
    })
  }

  function openVenueDetail(id) {
    const venue = venues.find((item) => item.id === id)
    if (!venue) return
    state.activeVenueId = id

    const modal = qs('#detail-modal')
    const content = qs('#detail-content')
    qs('#detail-title').textContent = venue.name
    qs('#detail-subtitle').textContent = `${venue.addr} • ${venue.type} • ${venue.rating.toFixed(1)}★`

    content.innerHTML = `
      <div class="grid grid-2" style="gap:18px">
        <div>
          <div class="gallery">
            <div class="gallery__main"><img src="${venue.img}" alt="${venue.name}"></div>
            <div class="gallery__thumb"><img src="${venue.img}" alt="${venue.name} 2"></div>
            <div class="gallery__thumb"><img src="https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=60" alt="Sân bóng"></div>
          </div>
          <div class="card" style="margin-top:16px;padding:18px">
            <h3 class="section-title" style="font-size:22px;margin-bottom:8px">Thông tin sân</h3>
            <p class="section-subtitle" style="margin-top:0">${venue.addr} · loại sân ${venue.type}. Phù hợp cho nhóm chơi phong trào và đặt sân theo giờ.</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
              ${venue.tags.map((tag) => `<span class="badge">${tag}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="booking-panel">
          <div class="booking-total">
            <div>
              <div class="muted small">Tổng tiền tạm tính</div>
              <div class="booking-total__value">${venue.price.toLocaleString('vi-VN')}đ</div>
            </div>
            <span class="venue-status ${venue.status === 'available' ? 'available' : venue.status === 'busy' ? 'busy' : 'hold'}">
              ${venue.status === 'available' ? 'Còn trống' : venue.status === 'busy' ? 'Đã đặt' : 'Đang giữ chỗ'}
            </span>
          </div>

          <h3 class="section-title" style="font-size:20px;margin-bottom:10px">Khung giờ</h3>
          <div class="pitches">
            ${['17:00', '18:00', '19:00', '20:00', '21:00'].map((slot, index) => {
              const status = index === 1 ? 'busy' : index === 2 ? 'hold' : 'available'
              return `<button class="pitch-slot ${status}" data-slot="${slot}" data-status="${status}">${slot}</button>`
            }).join('')}
          </div>

          <div style="margin-top:18px" class="card">
            <h3 class="section-title" style="font-size:18px;margin-bottom:8px">Thanh toán</h3>
            <p class="muted small" style="margin-top:0">Chọn một khung giờ còn trống để thêm vào lịch đặt sân của bạn.</p>
            <button id="pay-btn" class="btn btn-primary" style="width:100%">Thanh toán</button>
          </div>
        </div>
      </div>
    `

    qsa('.pitch-slot', content).forEach((button) => {
      button.addEventListener('click', (event) => {
        if (event.target.dataset.status === 'available') {
          qsa('.pitch-slot', content).forEach((btn) => btn.classList.remove('is-selected'))
          button.classList.add('is-selected')
          toast(`Đã chọn khung giờ ${button.textContent}`)
        }
      })
    })

    qs('#pay-btn').addEventListener('click', () => {
      const selected = qs('.pitch-slot.is-selected', content)
      if (!selected) {
        toast('Hãy chọn một khung giờ trước', 'error')
        return
      }
      toast(`Thanh toán cho sân ${venue.name} lúc ${selected.textContent}`)
      setTimeout(() => closeVenueDetail(), 800)
    })

    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
  }

  function closeVenueDetail() {
    const modal = qs('#detail-modal')
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
  }

  async function init() {
    console.log('🏟️  Venues page loading...')
    
    // Load venues component
    await loadComponent('#venues-root', 'components/venues.html')

    // Initial render
    renderVenues(venues)

    // Filter handler
    qs('#filter-area')?.addEventListener('change', (event) => {
      const value = event.target.value
      renderVenues(value === 'all' ? venues : venues.filter((venue) => venue.area === value))
      toast(value === 'all' ? 'Đã hiển thị toàn bộ sân' : `Đã lọc sân khu vực ${event.target.options[event.target.selectedIndex].text}`)
    })

    // Close modal handlers
    qs('#close-detail')?.addEventListener('click', closeVenueDetail)
    qs('#detail-modal')?.addEventListener('click', (event) => {
      if (event.target.id === 'detail-modal') closeVenueDetail()
    })

    // Check for filter from home page
    const savedFilter = localStorage.getItem('venueFilter')
    if (savedFilter) {
      const { area, type } = JSON.parse(savedFilter)
      qs('#filter-area').value = area
      renderVenues(venues.filter((v) => v.area === area && v.type === type))
      localStorage.removeItem('venueFilter')
      toast(`Lọc sân ${type} tại ${area}`)
    }

    console.log('✅ Venues page initialized')
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
