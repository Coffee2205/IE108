/*
  shared.js - Common utilities for all pages
*/
(function(){
  window.IE108 = window.IE108 || {}

  // DOM utilities
  window.IE108.qs = (sel, root=document) => root.querySelector(sel)
  window.IE108.qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel))
  window.IE108.el = (tag, props={}) => Object.assign(document.createElement(tag), props)

  const { qs, qsa, el, loadComponent } = window.IE108

  // Data - Venues
  window.IE108.venues = [
    { id: 1, name: 'SVĐ Hoàng Mai', area: 'Hanoi', type: '5v5', addr: 'Hoàng Mai, Hà Nội', rating: 4.6, price: 200000, tags: ['Ánh sáng', 'Cỏ nhân tạo', 'Bãi xe'], status: 'available', featured: true, img: 'https://images.unsplash.com/photo-1517927033932-b3d18e5d7a9b?auto=format&fit=crop&w=1200&q=60' },
    { id: 2, name: 'Trung tâm A', area: 'Hanoi', type: '7v7', addr: 'Cầu Giấy, Hà Nội', rating: 4.3, price: 320000, tags: ['Sân lớn', 'Tắm tráng', 'Có mái che'], status: 'hold', featured: true, img: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=60' },
    { id: 3, name: 'Sân Bình Thạnh', area: 'HCM', type: '5v5', addr: 'Bình Thạnh, Hồ Chí Minh', rating: 4.8, price: 180000, tags: ['Gần trung tâm', 'Ánh sáng', 'Nước uống'], status: 'busy', featured: true, img: 'https://images.unsplash.com/photo-1533743983669-94fa5e8a93f4?auto=format&fit=crop&w=1200&q=60' },
    { id: 4, name: 'Sân Phú Mỹ', area: 'HCM', type: '7v7', addr: 'Phú Mỹ, Hồ Chí Minh', rating: 4.7, price: 280000, tags: ['Sân cỏ tự nhiên', 'Café', 'Giữ xe'], status: 'available', featured: false, img: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=1200&q=60' },
    { id: 5, name: 'SVĐ Thể Công', area: 'Hanoi', type: '11v11', addr: 'Thể Công, Hà Nội', rating: 4.5, price: 500000, tags: ['Sân 11 người', 'Chất lượng FiFa', 'Bãi đỗ lớn'], status: 'available', featured: false, img: 'https://images.unsplash.com/photo-1516567867555-b7b368ff701d?auto=format&fit=crop&w=1200&q=60' },
    { id: 6, name: 'Sân Cầu Giấy', area: 'Hanoi', type: '5v5', addr: 'Cầu Giấy, Hà Nội', rating: 4.4, price: 180000, tags: ['Ánh sáng', 'Thông thoáng', 'Gần BRT'], status: 'available', featured: false, img: 'https://images.unsplash.com/photo-1529155089698-0201bb193d3b?auto=format&fit=crop&w=1200&q=60' },
    { id: 7, name: 'Sân Ba Đình', area: 'Hanoi', type: '7v7', addr: 'Ba Đình, Hà Nội', rating: 4.2, price: 250000, tags: ['Sân rộng', 'Mái che', 'Thang máy'], status: 'available', featured: false, img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=60' },
    { id: 8, name: 'Sân Hùng Vương', area: 'HCM', type: '5v5', addr: 'Hùng Vương, Hồ Chí Minh', rating: 4.9, price: 220000, tags: ['5 sao', 'Hàng đầu', 'Phục vụ tốt'], status: 'available', featured: false, img: 'https://images.unsplash.com/photo-1577958314293-5eef3e3a2f54?auto=format&fit=crop&w=1200&q=60' },
    { id: 9, name: 'Sân Biên Hòa', area: 'BD', type: '7v7', addr: 'Biên Hòa, Bình Dương', rating: 4.3, price: 200000, tags: ['Mới xây', 'Sân đẹp', 'Rẻ'], status: 'available', featured: false, img: 'https://images.unsplash.com/photo-1552109067-f554a5b5e5d7?auto=format&fit=crop&w=1200&q=60' },
    { id: 10, name: 'Sân Hạ Long', area: 'QN', type: '5v5', addr: 'Hạ Long, Quảng Ninh', rating: 4.1, price: 150000, tags: ['Giá rẻ', 'Cỏ tự nhiên', 'Biển'], status: 'available', featured: false, img: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=1200&q=60' }
  ]

  window.IE108.bookings = [
    { id: 1, venue: 'SVĐ Hoàng Mai', time: '19:00 - 20:00', status: 'upcoming', price: 200000 },
    { id: 2, venue: 'Trung tâm A', time: '20:00 - 21:00', status: 'completed', price: 320000 },
    { id: 3, venue: 'Sân Bình Thạnh', time: '18:00 - 19:00', status: 'cancelled', price: 180000 }
  ]

  window.IE108.conversations = [
    { id: 1, name: 'An', preview: 'OK tới nha', messages: [{ me: false, text: 'Tối nay kèo 5v5 nhé?' }, { me: true, text: 'Ok, mình tham gia!' }] },
    { id: 2, name: 'Bình', preview: 'Còn thiếu 2 người', messages: [{ me: false, text: 'Bạn vào kèo 7v7 không?' }] },
    { id: 3, name: 'Team Lân', preview: 'Chốt sân rồi', messages: [{ me: false, text: '20h sân A nhé' }] }
  ]

  window.IE108.feedPosts = [
    { id: 1, team: 'Team Rồng Xanh', level: 'Intermediate', place: 'SVĐ Hoàng Mai', time: '20:00 hôm nay', need: 3, cost: 100000, text: 'Cần tuyển thêm 3 cầu thủ đá kèo 5v5. Ưu tiên người chạy cánh nhanh, kỷ luật tốt.', featured: true },
    { id: 2, team: 'Đội U30', level: 'Beginner+', place: 'Trung tâm A', time: '18:30 thứ 7', need: 5, cost: 120000, text: 'Ghép trận phong trào, ưu tiên vui vẻ, fair-play và đúng giờ.', featured: true },
    { id: 3, team: 'Team FC Hà Nội', level: 'Advanced', place: 'SVĐ Thể Công', time: '19:00 hôm nay', need: 4, cost: 150000, text: 'Tuyển thủ dự bị cho trận đấu 11v11. Có kinh nghiệm đội tuyển ưu tiên.', featured: true },
    { id: 4, team: 'Bóng đá quân đội', level: 'Semi-pro', place: 'Sân Bình Thạnh', time: '20:30 hôm nay', need: 2, cost: 200000, text: 'Tìm thủ thành hoặc tiền vệ chất lượng. Lương cao, địa vị ổn định.', featured: false },
    { id: 5, team: 'Team Hùng Vương', level: 'Beginner', place: 'Sân Phú Mỹ', time: '18:00 thứ 6', need: 6, cost: 80000, text: 'Ghép trận vui vẻ, không care trình độ. Tất cả đều được chào đón!', featured: false },
    { id: 6, team: 'CLB Tiên Sơn', level: 'Intermediate', place: 'Sân Cầu Giấy', time: '19:30 thứ 7', need: 3, cost: 110000, text: 'Cần 3 người để hoàn thành đội hình. Có sân, không lo chi phí.', featured: false },
    { id: 7, team: 'Team Minh Khai', level: 'Intermediate', place: 'Sân Ba Đình', time: '20:00 thứ 6', need: 4, cost: 95000, text: 'Kèo 7v7 vui vẻ. Đi ăn uống sau trận.', featured: false },
    { id: 8, team: 'FC Hồ Chí Minh', level: 'Advanced', place: 'Sân Hùng Vương', time: '19:00 hôm nay', need: 2, cost: 180000, text: 'Tuyển cầu thủ xuất sắc. Có cơ hội ký hợp đồng dài hạn.', featured: false },
    { id: 9, team: 'Team Thanh Xuân', level: 'Beginner+', place: 'Sân Biên Hòa', time: '18:30 thứ 7', need: 5, cost: 100000, text: 'Ghép trận định kỳ hàng tuần. Gia đình bạn có thể xem.', featured: false },
    { id: 10, team: 'Team Hạ Long FC', level: 'Intermediate', place: 'Sân Hạ Long', time: '19:00 thứ 6', need: 3, cost: 70000, text: 'Trận giao hữu với đội bạn. Chi phí rẻ, vui vẻ là chính.', featured: false },
    { id: 11, team: 'Team Chữ S', level: 'Intermediate', place: 'SVĐ Hoàng Mai', time: '20:00 thứ 7', need: 4, cost: 125000, text: 'Ghép trận thường xuyên. Đã có sân, cần thêm người.', featured: false },
    { id: 12, team: 'Team Phố Hiến', level: 'Advanced', place: 'Sân Hùng Vương', time: '21:00 hôm nay', need: 3, cost: 160000, text: 'Thi đấu chính thức. Chỉ nhận cầu thủ có thẻ.', featured: false }
  ]

  // Toast notification
  window.IE108.toast = function(message, type = 'success') {
    const box = qs('#toast')
    const node = el('div', { className: `toast ${type}` })
    node.textContent = message
    box.appendChild(node)
    setTimeout(() => node.remove(), 2600)
  }

  // Load HTML component
  window.IE108.loadComponent = async function(targetSelector, url) {
    const target = qs(targetSelector)
    if (!target) {
      // Silently skip if target doesn't exist (useful for pages without navbar/footer)
      return
    }
    try {
      console.log(`⏳ Loading component: ${url}`)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${url}`)
      }
      const html = await response.text()
      target.innerHTML = html
      console.log(`✅ Loaded: ${url}`)
    } catch (err) {
      console.error(`❌ Failed to load ${url}:`, err)
      target.innerHTML = `<div style="color: #dc2626; padding: 20px; text-align: center;">
        <p>❌ Failed to load component: ${url}</p>
        <p style="font-size: 12px; color: #6b7280;">${err.message}</p>
      </div>`
    }
  }

  // Setup navbar and footer on all pages
  document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 Page loading...')
    
    // Load navbar and footer
    await window.IE108.loadComponent('#navbar-root', 'components/navbar.html')
    await window.IE108.loadComponent('#footer-root', 'components/footer.html')
    
    // Setup navbar events
    const navToggle = qs('#nav-toggle')
    const mobileMenu = qs('#mobile-menu')
    
    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', () => {
        const isHidden = mobileMenu.hasAttribute('hidden')
        if (isHidden) mobileMenu.removeAttribute('hidden')
        else mobileMenu.setAttribute('hidden', '')
      })
    }

    // Setup login/signup buttons
    qs('#btn-login')?.addEventListener('click', () => window.location.href = 'login.html')
    qs('#btn-signup')?.addEventListener('click', () => window.location.href = 'signup.html')
    qs('#m-login')?.addEventListener('click', () => window.location.href = 'login.html')
    qs('#m-signup')?.addEventListener('click', () => window.location.href = 'signup.html')

    // Set footer year
    const yearEl = qs('#year')
    if (yearEl) yearEl.textContent = new Date().getFullYear()
    
    console.log('✅ Common setup done')
  })
})()
