/*
  history.js - Booking history and chat page
*/
(function(){
  const { qs, qsa, el, loadComponent, bookings, conversations, toast } = window.IE108
  let state = { activeHistoryTab: 'upcoming', activeConversationId: 1 }

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

  async function init() {
    console.log('📋 History page loading...')
    
    // Load history component (we'll need to add chat component too)
    await loadComponent('#history-root', 'components/history.html')
    
    renderHistory()

    // History tabs
    qsa('.history-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        qsa('.history-tab').forEach((btn) => btn.classList.remove('is-active'))
        tab.classList.add('is-active')
        state.activeHistoryTab = tab.dataset.tab
        renderHistory()
      })
    })

    console.log('✅ History page initialized')
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
