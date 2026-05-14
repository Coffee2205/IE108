/*
  script.js - Main JS for IE108 frontend
  - Loads HTML components into shell
  - Handles mobile menu, quick booking, filtering, detail modal, feed, history, chat, toasts
*/
(function(){
  const qs = (sel, root=document) => root.querySelector(sel)
  const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel))
  const el = (tag, props={}) => Object.assign(document.createElement(tag), props)

  const components = [
    ['#navbar-root', 'components/navbar.html'],
    ['#hero-root', 'components/hero.html'],
    ['#stats-root', 'components/stats.html'],
    ['#venues-root', 'components/venues.html'],
    ['#matchfeed-root', 'components/matchfeed.html'],
    ['#history-root', 'components/history.html'],
    ['#chat-root', 'components/chat.html'],
    ['#contact-root', 'components/contact.html'],
    ['#footer-root', 'components/footer.html']
  ]

  const venues = [
    { id: 1, name: 'SVĐ Hoàng Mai', area: 'Hanoi', type: '5v5', addr: 'Hoàng Mai, Hà Nội', rating: 4.6, price: 200000, tags: ['Ánh sáng', 'Cỏ nhân tạo', 'Bãi xe'], status: 'available', img: 'https://images.unsplash.com/photo-1517927033932-b3d18e5d7a9b?auto=format&fit=crop&w=1200&q=60' },
    { id: 2, name: 'Trung tâm A', area: 'Hanoi', type: '7v7', addr: 'Cầu Giấy, Hà Nội', rating: 4.3, price: 320000, tags: ['Sân lớn', 'Tắm tráng', 'Có mái che'], status: 'hold', img: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=60' },
    { id: 3, name: 'Sân Bình Thạnh', area: 'HCM', type: '5v5', addr: 'Bình Thạnh, Hồ Chí Minh', rating: 4.8, price: 180000, tags: ['Gần trung tâm', 'Ánh sáng', 'Nước uống'], status: 'busy', img: 'https://images.unsplash.com/photo-1533743983669-94fa5e8a93f4?auto=format&fit=crop&w=1200&q=60' }
  ]

  const bookings = [
    { id: 1, venue: 'SVĐ Hoàng Mai', time: '19:00 - 20:00', status: 'upcoming', price: 200000 },
    { id: 2, venue: 'Trung tâm A', time: '20:00 - 21:00', status: 'completed', price: 320000 },
    { id: 3, venue: 'Sân Bình Thạnh', time: '18:00 - 19:00', status: 'cancelled', price: 180000 }
  ]

  const conversations = [
    { id: 1, name: 'An', preview: 'OK tới nha', messages: [{ me: false, text: 'Tối nay kèo 5v5 nhé?' }, { me: true, text: 'Ok, mình tham gia!' }] },
    { id: 2, name: 'Bình', preview: 'Còn thiếu 2 người', messages: [{ me: false, text: 'Bạn vào kèo 7v7 không?' }] },
    { id: 3, name: 'Team Lân', preview: 'Chốt sân rồi', messages: [{ me: false, text: '20h sân A nhé' }] }
  ]

  const feedPosts = [
    { id: 1, team: 'Team Rồng Xanh', level: 'Intermediate', place: 'SVĐ Hoàng Mai', time: '20:00 hôm nay', need: 3, cost: 100000, text: 'Cần tuyển thêm 3 cầu thủ đá kèo 5v5. Ưu tiên người chạy cánh nhanh, kỷ luật tốt.' },
    { id: 2, team: 'Đội U30', level: 'Beginner+', place: 'Trung tâm A', time: '18:30 thứ 7', need: 5, cost: 120000, text: 'Ghép trận phong trào, ưu tiên vui vẻ, fair-play và đúng giờ.' }
  ]

  const state = { activeConversationId: 1, activeHistoryTab: 'upcoming', activeVenueId: null }

  function toast(message, type = 'success') {
    const box = qs('#toast')
    const node = el('div', { className: `toast ${type}` })
    node.textContent = message
    box.appendChild(node)
    setTimeout(() => node.remove(), 2600)
  }

  function smoothScrollTo(selector) {
    const target = document.querySelector(selector)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function loadComponent(targetSelector, url) {
    const target = qs(targetSelector)
    if (!target) return
    const response = await fetch(url)
    target.innerHTML = await response.text()
  }

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
            <div class="gallery__thumb"><img src="https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=60" alt="Sân bóng"></div>
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
      button.addEventListener('click', () => {
        const status = button.dataset.status
        const slot = button.dataset.slot
        if (status === 'busy') {
          toast(`Khung giờ ${slot} đã được đặt`, 'error')
          return
        }
        if (status === 'hold') {
          toast(`Khung giờ ${slot} đang được giữ chỗ`, 'warning')
          return
        }
        bookings.unshift({
          id: Date.now(),
          venue: venue.name,
          time: slot,
          status: 'upcoming',
          price: venue.price
        })
        renderHistory()
        toast(`Đã chọn khung giờ ${slot} cho ${venue.name}`)
      })
    })

    qs('#pay-btn', content).addEventListener('click', () => {
      toast('Thanh toán demo thành công')
    })

    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
  }

  function closeVenueDetail() {
    const modal = qs('#detail-modal')
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
  }

  function renderHistory() {
    const list = qs('#history-list')
    if (!list) return
    const filtered = bookings.filter((item) => item.status === state.activeHistoryTab)

    list.innerHTML = ''
    if (!filtered.length) {
      list.innerHTML = `<div class="muted">Không có booking ở mục này.</div>`
      return
    }

    filtered.forEach((booking) => {
      const card = el('article', { className: 'card history-card' })
      card.innerHTML = `
        <div>
          <h3 class="history-card__title">${booking.venue}</h3>
          <div class="history-card__meta">${booking.time}</div>
          <div style="margin-top:10px"><span class="booking-badge ${booking.status}">${booking.status}</span></div>
        </div>
        <div style="text-align:right">
          <div class="history-card__price">${booking.price.toLocaleString('vi-VN')}đ</div>
          <div class="history-card__actions" style="margin-top:10px;justify-content:flex-end">
            <button class="btn btn-outline js-cancel-booking" data-id="${booking.id}">Hủy sân</button>
          </div>
        </div>
      `
      list.appendChild(card)
    })

    qsa('.js-cancel-booking', list).forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.id)
        const index = bookings.findIndex((item) => item.id === id)
        if (index >= 0) {
          bookings.splice(index, 1)
          renderHistory()
          toast('Đã hủy booking')
        }
      })
    })
  }

  function renderFeed() {
    const feed = qs('#feed')
    if (!feed) return
    feed.innerHTML = ''

    feedPosts.forEach((post) => {
      const card = el('article', { className: 'card feed-card' })
      card.innerHTML = `
        <div class="feed-card__header">
          <div class="feed-avatar">${post.team.charAt(0)}</div>
          <div>
            <h3 class="feed-team">${post.team}</h3>
            <div class="feed-meta">${post.level} • ${post.place} • ${post.time}</div>
            <div class="feed-meta">Thiếu <strong>${post.need}</strong> người • Chi phí chia sân ${post.cost.toLocaleString('vi-VN')}đ/người</div>
          </div>
        </div>
        <p class="feed-content">${post.text}</p>
        <div class="feed-actions">
          <button class="btn btn-primary">Nhận kèo</button>
          <button class="btn btn-outline">Chat</button>
        </div>
      `
      feed.appendChild(card)
    })
  }

  function renderConversations() {
    const list = qs('#conversations')
    const window = qs('#chat-window')
    if (!list || !window) return

    list.innerHTML = ''
    conversations.forEach((conversation) => {
      const item = el('li', { className: `chat-item ${conversation.id === state.activeConversationId ? 'is-active' : ''}` })
      item.innerHTML = `
        <div class="chat-item__name">${conversation.name}</div>
        <div class="chat-item__preview">${conversation.preview}</div>
      `
      item.addEventListener('click', () => {
        state.activeConversationId = conversation.id
        renderConversations()
        openConversation(conversation.id)
      })
      list.appendChild(item)
    })

    openConversation(state.activeConversationId)
  }

  function openConversation(id) {
    const conversation = conversations.find((item) => item.id === id)
    const window = qs('#chat-window')
    if (!conversation || !window) return

    window.innerHTML = ''
    conversation.messages.forEach((message) => {
      const bubble = el('div', { className: `chat-bubble ${message.me ? 'me' : 'them'}` })
      bubble.textContent = message.text
      window.appendChild(bubble)
    })
    window.scrollTop = window.scrollHeight
  }

  function bindEvents() {
    const navToggle = qs('#nav-toggle')
    const mobileMenu = qs('#mobile-menu')

    navToggle?.addEventListener('click', () => {
      const isHidden = mobileMenu.hasAttribute('hidden')
      if (isHidden) mobileMenu.removeAttribute('hidden')
      else mobileMenu.setAttribute('hidden', '')
    })

    qsa('.nav-link').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault()
        smoothScrollTo(link.getAttribute('href'))
        mobileMenu?.setAttribute('hidden', '')
      })
    })

    qs('#btn-login')?.addEventListener('click', () => toast('Màn hình đăng nhập demo'))
    qs('#btn-signup')?.addEventListener('click', () => toast('Màn hình đăng ký demo'))
    qs('#m-login')?.addEventListener('click', () => toast('Màn hình đăng nhập demo'))
    qs('#m-signup')?.addEventListener('click', () => toast('Màn hình đăng ký demo'))

    qs('#close-detail')?.addEventListener('click', closeVenueDetail)

    qs('#detail-modal')?.addEventListener('click', (event) => {
      if (event.target.id === 'detail-modal') closeVenueDetail()
    })

    qs('#filter-area')?.addEventListener('change', (event) => {
      const value = event.target.value
      renderVenues(value === 'all' ? venues : venues.filter((venue) => venue.area === value))
      toast(value === 'all' ? 'Đã hiển thị toàn bộ sân' : `Đã lọc sân khu vực ${event.target.options[event.target.selectedIndex].text}`)
    })

    qs('#quick-booking')?.addEventListener('submit', (event) => {
      event.preventDefault()
      const area = qs('#area').value
      const type = qs('#pitch-type').value
      const date = qs('#date').value || 'mọi ngày'
      renderVenues(venues.filter((venue) => venue.area === area && venue.type === type))
      toast(`Đang tìm ${type} tại ${area} cho ${date}`)
      smoothScrollTo('#venues')
    })

    qs('#post-btn')?.addEventListener('click', () => {
      const input = qs('#post-text')
      const text = input.value.trim()
      if (!text) {
        toast('Hãy nhập nội dung bài đăng trước khi đăng', 'error')
        return
      }

      feedPosts.unshift({
        id: Date.now(),
        team: 'Đội tự tạo',
        level: 'Player',
        place: 'Nhiều sân',
        time: 'Hôm nay',
        need: 2,
        cost: 90000,
        text
      })
      input.value = ''
      renderFeed()
      toast('Đăng kèo thành công')
    })

    qsa('.history-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        qsa('.history-tab').forEach((btn) => btn.classList.remove('is-active'))
        tab.classList.add('is-active')
        state.activeHistoryTab = tab.dataset.tab
        renderHistory()
      })
    })

    qs('#chat-send')?.addEventListener('click', () => {
      const input = qs('#chat-input')
      const text = input.value.trim()
      if (!text) return

      const activeConversation = conversations.find((item) => item.id === state.activeConversationId)
      activeConversation.messages.push({ me: true, text })
      activeConversation.preview = text
      input.value = ''
      renderConversations()
      toast('Đã gửi tin nhắn')
    })

    qs('#chat-input')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        qs('#chat-send').click()
      }
    })

  }

  async function init() {
    await Promise.all(components.map(([target, url]) => loadComponent(target, url)))
    qs('#year').textContent = new Date().getFullYear()

    renderVenues(venues)
    renderHistory()
    renderFeed()
    renderConversations()
    bindEvents()
  }

  document.addEventListener('DOMContentLoaded', init)
  window.IE108 = { venues, bookings, feedPosts, conversations }
})()
