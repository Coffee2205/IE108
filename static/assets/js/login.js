/*
  login.js - Login page handler
*/
(function(){
  const { qs, toast } = window.IE108

  function handleLogin(event) {
    event.preventDefault()
    const email = qs('#email').value.trim()
    const password = qs('#password').value.trim()

    if (!email || !password) {
      toast('Vui lòng điền đầy đủ thông tin', 'error')
      return
    }

    // Mock authentication
    if (email && password) {
      toast('Đăng nhập thành công! 🎉')
      // Save user session
      localStorage.setItem('user', JSON.stringify({ email, loggedIn: true }))
      setTimeout(() => {
        window.location.href = 'index.html'
      }, 500)
    }
  }

  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
      const form = qs('#login-form')
      if (form) {
        form.addEventListener('submit', handleLogin)
      }
    }
  })
})()
