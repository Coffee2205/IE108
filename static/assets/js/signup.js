/*
  signup.js - Signup page handler
*/
(function(){
  const { qs, toast } = window.IE108

  function handleSignup(event) {
    event.preventDefault()
    const firstname = qs('#firstname').value.trim()
    const lastname = qs('#lastname').value.trim()
    const email = qs('#email').value.trim()
    const phone = qs('#phone').value.trim()
    const password = qs('#password').value.trim()
    const confirmPassword = qs('#confirm-password').value.trim()
    const role = qs('#role').value
    const terms = qs('input[name="terms"]').checked

    // Validation
    if (!firstname || !lastname || !email || !password || !confirmPassword || !role) {
      toast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
      return
    }

    if (password.length < 8) {
      toast('Mật khẩu phải ít nhất 8 ký tự', 'error')
      return
    }

    if (password !== confirmPassword) {
      toast('Mật khẩu xác nhận không khớp', 'error')
      return
    }

    if (!terms) {
      toast('Vui lòng đồng ý với Điều khoản dịch vụ', 'error')
      return
    }

    // Mock registration
    const user = {
      firstname,
      lastname,
      email,
      phone,
      role,
      loggedIn: true
    }

    localStorage.setItem('user', JSON.stringify(user))
    toast('Đăng ký thành công! Chào mừng bạn 🎉')
    
    setTimeout(() => {
      window.location.href = 'index.html'
    }, 500)
  }

  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
      const form = qs('#signup-form')
      if (form) {
        form.addEventListener('submit', handleSignup)
      }
    }
  })
})()
