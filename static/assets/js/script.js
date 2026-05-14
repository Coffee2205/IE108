/*
  script.js - Main JS for IE108 frontend
  - Pure JavaScript (no frameworks)
  - Handles mobile menu, quick booking, venue rendering, fake bookings, match feed, chat, tabs, toasts, smooth scroll
*/
(function(){
  // Utilities
  function qs(sel, root=document){ return root.querySelector(sel) }
  function qsa(sel, root=document){ return Array.from((root||document).querySelectorAll(sel)) }
  function el(t, props){ const e=document.createElement(t); if(props) Object.assign(e,props); return e }

  // Data (mock)
  const venues = [
    {id:1,name:'SVĐ Hoàng Mai',area:'Hanoi',type:'5v5',addr:'Hà Nội',rating:4.6,price:200000, tags:['Ánh sáng','Sân cỏ nhân tạo'],status:'available',img:'https://images.unsplash.com/photo-1517927033932-b3d18e5d7a9b?auto=format&fit=crop&w=800&q=60'},
    {id:2,name:'Trung tâm A',area:'Hanoi',type:'7v7',addr:'Hà Nội',rating:4.3,price:320000,tags:['Sân lớn','Tắm tráng'],status:'partial',img:'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=60'},
    {id:3,name:'Sân Bình Thạnh',area:'HCM',type:'5v5',addr:'Hồ Chí Minh',rating:4.8,price:180000,tags:['Gần trung tâm'],status:'booked',img:'https://images.unsplash.com/photo-1533743983669-94fa5e8a93f4?auto=format&fit=crop&w=800&q=60'}
  ];

  const bookings = [] // fake bookings

  // Mobile menu
  const navToggle = qs('#nav-toggle')
  const mobileMenu = qs('#mobile-menu')
  navToggle && navToggle.addEventListener('click',()=>{
    const shown = mobileMenu.style.display === 'block'
    mobileMenu.style.display = shown ? 'none' : 'block'
  })

  // Smooth scroll for nav links
  qsa('.nav-link').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault(); const id = a.getAttribute('href').slice(1)
      const target = document.getElementById(id)
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'})
    })
  })

  // Render venues
  function renderVenues(list){
    const grid = qs('#venues-grid')
    grid.innerHTML=''
    list.forEach(v=>{
      const card = el('div',{className:'venue card'})
      const img = el('img'); img.src=v.img; img.alt=v.name
      const title = el('h3'); title.textContent=v.name
      const meta = el('div',{className:'meta'})
      const left = el('div'); left.innerHTML = `<div class='muted small'>${v.addr} • ${v.type}</div>`
      const right = el('div'); right.innerHTML = `<div class='badge'>${v.price.toLocaleString()}đ</div>`
      meta.appendChild(left); meta.appendChild(right)
      const tags = el('p',{className:'small muted'}); tags.textContent = v.tags.join(' • ')
      const actions = el('div',{className:'flex', style:''})
      const btn = el('button',{className:'btn'}); btn.textContent='Đặt sân'
      btn.addEventListener('click', ()=> openDetail(v.id))
      actions.appendChild(btn)
      card.appendChild(img)
      card.appendChild(title)
      card.appendChild(meta)
      card.appendChild(tags)
      card.appendChild(actions)
      grid.appendChild(card)
    })
  }

  // Filter venues by area
  qs('#filter-area').addEventListener('change',(e)=>{
    const v = e.target.value
    if(v==='all') renderVenues(venues)
    else renderVenues(venues.filter(x=>x.area===v))
  })

  // Quick booking form
  qs('#quick-booking').addEventListener('submit', (e)=>{
    e.preventDefault();
    const area = qs('#area').value; const type = qs('#pitch-type').value; const date = qs('#date').value
    showToast(`Searching ${type} in ${area} for ${date || 'any date'}`)
    // Filter and scroll to venues
    renderVenues(venues.filter(x=> x.area===area && x.type===type))
    setTimeout(()=> qs('#venues').scrollIntoView({behavior:'smooth'}),300)
  })

  // Open detail modal
  function openDetail(id){
    const v = venues.find(x=>x.id===id)
    if(!v) return
    const modal = qs('#detail-modal'); const content = qs('#detail-content')
    content.innerHTML = ''
    const grid = el('div',{style:'display:flex;gap:12px;flex-wrap:wrap'})
    const left = el('div',{style:'flex:1;min-width:260px'})
    const img = el('img'); img.src=v.img; img.style.width='100%'; img.style.borderRadius='8px'; left.appendChild(img)
    const right = el('div',{style:'flex:1;min-width:260px'})
    right.innerHTML = `<h2>${v.name}</h2><p class='muted'>${v.addr}</p><p>${v.tags.join(', ')}</p>`
    // Hours grid
    const hours = ['17:00','18:00','19:00','20:00','21:00']
    const hoursGrid = el('div',{style:'display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:12px'})
    hours.forEach((h,i)=>{
      const slot = el('button',{className:'small'});
      slot.textContent=h
      // fake status
      const st = i%3===0? 'available': (i%3===1? 'booked':'holding')
      slot.style.padding='8px'; slot.style.borderRadius='8px'; slot.style.border='1px solid #e6e9ef'
      if(st==='available'){ slot.style.background='#ECFDF5'; slot.style.color='#065F46' }
      if(st==='booked'){ slot.style.background='#FEE2E2'; slot.style.color='#991B1B' }
      if(st==='holding'){ slot.style.background='#FFFBEB'; slot.style.color='#92400E' }
      slot.addEventListener('click',()=>{
        if(st==='booked') return showToast('Khung giờ đã được đặt', 'error')
        // confirm booking
        bookings.push({venue:v.name,time:h,price:v.price,status:'upcoming'})
        showToast('Đã thêm vào lịch đặt (demo)')
        renderHistory()
      })
      hoursGrid.appendChild(slot)
    })
    right.appendChild(hoursGrid)
    grid.appendChild(left); grid.appendChild(right)
    content.appendChild(grid)
    modal.style.display='block'
  }

  qs('#close-detail').addEventListener('click',()=> qs('#detail-modal').style.display='none')

  // History render
  function renderHistory(){
    const list = qs('#history-list'); list.innerHTML=''
    if(bookings.length===0) list.innerHTML = '<div class="muted">Bạn chưa có booking nào</div>'
    bookings.forEach(b=>{
      const card = el('div',{className:'card', style:'margin-bottom:12px'})
      card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${b.venue}</strong><div class='muted small'>${b.time}</div></div><div><div>${b.price.toLocaleString()}đ</div><button class='nav-outline' data-cancel>Hủy</button></div></div>`
      qsa('[data-cancel]', card).forEach(btn=>btn.addEventListener('click',()=>{
        bookings.splice(bookings.indexOf(b),1); renderHistory(); showToast('Đã hủy booking')
      }))
      list.appendChild(card)
    })
  }

  // Match feed
  const feed = qs('#feed')
  const posts = []
  qs('#post-btn').addEventListener('click',()=>{
    const txt = qs('#post-text').value.trim()
    if(!txt) return showToast('Nhập nội dung trước khi đăng','error')
    const p = {id:Date.now(),text:txt,team:'Team A',level:'Intermediate',place:'SVĐ Hoàng Mai',time:'20:00',need:3,cost:100000}
    posts.unshift(p); qs('#post-text').value=''; renderFeed()
    showToast('Đăng kèo thành công')
  })
  function renderFeed(){
    feed.innerHTML=''
    posts.forEach(p=>{
      const card = el('div',{className:'card', style:'margin-bottom:12px'})
      card.innerHTML = `<div style='display:flex;gap:12px;align-items:center'><div style='width:48px;height:48px;border-radius:50%;background:#d1fae5;display:flex;align-items:center;justify-content:center;font-weight:700;color:#064e3b'>${p.team[0]}</div><div style='flex:1'><strong>${p.team}</strong><div class='muted small'>${p.level} • ${p.place} • ${p.time}</div><p style='margin:8px 0'>${p.text}</p><div style='display:flex;gap:8px'><button class='btn'>Nhận kèo (${p.need})</button><button class='nav-outline'>Chat</button></div></div></div>`
      feed.appendChild(card)
    })
  }

  // Chat fake
  const conversations = [{id:1,name:'An',last:'OK tới',messages:[{me:true,text:'Bạn tham gia không?'},{me:false,text:'Còn 2 chỗ'}]}]
  function renderConversations(){
    const list = qs('#conversations'); list.innerHTML=''
    conversations.forEach(c=>{
      const li = el('li'); li.style.padding='8px 0'
      li.innerHTML = `<a href='#' class='muted'>${c.name} <div class='small muted'>${c.last}</div></a>`
      li.addEventListener('click', ()=> openConversation(c))
      list.appendChild(li)
    })
  }
  function openConversation(c){
    const win = qs('#chat-window'); win.innerHTML=''
    c.messages.forEach(m=>{
      const b = el('div'); b.textContent = m.text; b.style.margin='8px 0'; b.style.maxWidth='70%'
      if(m.me){ b.style.marginLeft='auto'; b.style.background='#DCFCE7'; b.style.padding='8px'; b.style.borderRadius='8px' }
      else{ b.style.background='#F1F5F9'; b.style.padding='8px'; b.style.borderRadius='8px' }
      win.appendChild(b)
    })
  }
  qs('#chat-send').addEventListener('click', ()=>{
    const txt = qs('#chat-input').value.trim(); if(!txt) return
    const win = qs('#chat-window'); const b = el('div'); b.textContent=txt; b.style.background='#DCFCE7'; b.style.padding='8px'; b.style.borderRadius='8px'; b.style.margin='8px 0'; b.style.marginLeft='auto'
    win.appendChild(b); qs('#chat-input').value=''; showToast('Tin nhắn đã gửi')
  })

  // Toasts
  function showToast(msg, type='success'){
    const t = el('div',{className:'card'}); t.style.padding='10px 14px'; t.style.marginTop='8px'
    t.textContent = msg
    if(type==='error'){ t.style.background='#fee2e2'; t.style.color='#991b1b' }
    qs('#toast').appendChild(t)
    setTimeout(()=> t.remove(),3000)
  }

  // Init
  function init(){
    qs('#year').textContent = new Date().getFullYear()
    renderVenues(venues)
    renderHistory()
    renderConversations()
    renderFeed()
  }
  document.addEventListener('DOMContentLoaded', init)

  // expose for debug
  window.IE108 = {venues,bookings,posts}

})();
