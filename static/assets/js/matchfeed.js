/*
  matchfeed.js - Match feed posting and discovery page
*/
(function(){
  const { qs, qsa, el, loadComponent, feedPosts, toast } = window.IE108

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
          <button class="btn btn-primary js-join">Nhận kèo</button>
          <button class="btn btn-outline js-chat">Chat</button>
        </div>
      `
      feed.appendChild(card)
    })

    qsa('.js-join', feed).forEach((btn) => {
      btn.addEventListener('click', () => {
        toast('Đã gửi yêu cầu nhận kèo. Đợi người tổ chức xác nhận.')
      })
    })

    qsa('.js-chat', feed).forEach((btn) => {
      btn.addEventListener('click', () => {
        window.location.href = 'history.html#chat'
      })
    })
  }

  async function init() {
    console.log('⚽ Match feed page loading...')
    
    // Load matchfeed component
    await loadComponent('#matchfeed-root', 'components/matchfeed.html')

    renderFeed()

    // Post button handler
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

    console.log('✅ Match feed page initialized')
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
