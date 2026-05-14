function insertShell(){
  const nav = document.getElementById('nav-container')
  const foot = document.getElementById('footer-container')
  if(nav){
    nav.innerHTML = `
    <div>
      <nav class="navbar">
        <div class="nav-left">
          <div class="brand">IE108</div>
          <div class="small muted">Đặt sân • Tuyển kèo</div>
        </div>
        <div class="nav-right">
          <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="search.html">Search</a>
            <a href="matchfeed.html">Match Feed</a>
            <a href="booking.html">Booking</a>
          </div>
          <button id="nav-toggle" class="nav-toggle" aria-label="Toggle menu">☰</button>
        </div>
      </nav>
      <div id="mobile-menu" class="mobile-menu">
        <a href="index.html">Home</a>
        <a href="search.html">Search</a>
        <a href="matchfeed.html">Match Feed</a>
        <a href="booking.html">Booking</a>
        <a href="login.html">Login</a>
      </div>
    </div>`
  }
  if(foot){
    foot.innerHTML = `<div class="footer card">
      <div class="container small muted">© ${new Date().getFullYear()} IE108 — Đặt sân & Tuyển kèo</div>
    </div>`
  }
}

// Basic demo interactions
document.addEventListener('DOMContentLoaded',()=>{
  insertShell()
  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle')
  const mobileMenu = document.getElementById('mobile-menu')
  if(navToggle && mobileMenu){
    navToggle.addEventListener('click',()=>{
      mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block'
    })
  }
  const searchForm = document.getElementById('search-form')
  if(searchForm){
    searchForm.addEventListener('submit',e=>{
      e.preventDefault()
      const q = document.getElementById('q').value
      alert('Search for: '+q+' (demo)')
      // In real app, redirect to search results page
      window.location.href = 'search.html?q='+encodeURIComponent(q)
    })
  }
  // booking demo
  const bookBtns = document.querySelectorAll('.book-btn')
  bookBtns.forEach(b=>b.addEventListener('click',()=>{
    alert('Open booking modal (demo)')
  }))
})
