/*
  shared.js - Common utilities for all pages (with auth support)
*/
(function () {
  window.IE108 = window.IE108 || {};

  // DOM utilities
  window.IE108.qs = (sel, root = document) => root.querySelector(sel);
  window.IE108.qsa = (sel, root = document) =>
    Array.from(root.querySelectorAll(sel));
  window.IE108.el = (tag, props = {}) =>
    Object.assign(document.createElement(tag), props);

  const { qs, qsa, el } = window.IE108;

  // ── Auth helpers ──
  window.IE108.getUser = function () {
    try {
      return JSON.parse(localStorage.getItem("ie108_user") || "null");
    } catch (e) {
      return null;
    }
  };

  window.IE108.logout = function () {
    localStorage.removeItem("ie108_user");
    window.location.href = "login.html";
  };

  // ── Data ──
  window.IE108.venues = [
    {
      id: 1,
      name: "SVĐ Hoàng Mai",
      area: "Hanoi",
      type: "5v5",
      addr: "Hoàng Mai, Hà Nội",
      rating: 4.6,
      price: 200000,
      tags: ["Ánh sáng", "Cỏ nhân tạo", "Bãi xe"],
      status: "available",
      img: "https://images.unsplash.com/photo-1517927033932-b3d18e5d7a9b?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: 2,
      name: "Trung tâm A",
      area: "Hanoi",
      type: "7v7",
      addr: "Cầu Giấy, Hà Nội",
      rating: 4.3,
      price: 320000,
      tags: ["Sân lớn", "Tắm tráng", "Có mái che"],
      status: "hold",
      img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: 3,
      name: "Sân Bình Thạnh",
      area: "HCM",
      type: "5v5",
      addr: "Bình Thạnh, Hồ Chí Minh",
      rating: 4.8,
      price: 180000,
      tags: ["Gần trung tâm", "Ánh sáng", "Nước uống"],
      status: "busy",
      img: "https://images.unsplash.com/photo-1533743983669-94fa5e8a93f4?auto=format&fit=crop&w=1200&q=60",
    },
  ];

  window.IE108.bookings = [
    {
      id: 1,
      venue: "SVĐ Hoàng Mai",
      time: "19:00 - 20:00",
      status: "upcoming",
      price: 200000,
    },
    {
      id: 2,
      venue: "Trung tâm A",
      time: "20:00 - 21:00",
      status: "completed",
      price: 320000,
    },
    {
      id: 3,
      venue: "Sân Bình Thạnh",
      time: "18:00 - 19:00",
      status: "cancelled",
      price: 180000,
    },
  ];

  window.IE108.conversations = [
    {
      id: 1,
      name: "An",
      preview: "OK tới nha",
      messages: [
        { me: false, text: "Tối nay kèo 5v5 nhé?" },
        { me: true, text: "Ok, mình tham gia!" },
      ],
    },
    {
      id: 2,
      name: "Bình",
      preview: "Còn thiếu 2 người",
      messages: [{ me: false, text: "Bạn vào kèo 7v7 không?" }],
    },
    {
      id: 3,
      name: "Team Lân",
      preview: "Chốt sân rồi",
      messages: [{ me: false, text: "20h sân A nhé" }],
    },
  ];

  window.IE108.feedPosts = [
    {
      id: 1,
      team: "Team Rồng Xanh",
      level: "Intermediate",
      place: "SVĐ Hoàng Mai",
      time: "20:00 hôm nay",
      need: 3,
      cost: 100000,
      text: "Cần tuyển thêm 3 cầu thủ đá kèo 5v5. Ưu tiên người chạy cánh nhanh, kỷ luật tốt.",
    },
    {
      id: 2,
      team: "Đội U30",
      level: "Beginner+",
      place: "Trung tâm A",
      time: "18:30 thứ 7",
      need: 5,
      cost: 120000,
      text: "Ghép trận phong trào, ưu tiên vui vẻ, fair-play và đúng giờ.",
    },
  ];

  // Toast notification
  window.IE108.toast = function (message, type = "success") {
    const box = qs("#toast");
    if (!box) return;
    const node = el("div", { className: `toast ${type}` });
    node.textContent = message;
    box.appendChild(node);
    setTimeout(() => node.remove(), 2600);
  };

  // Load HTML component
  window.IE108.loadComponent = async function (targetSelector, url) {
    const target = qs(targetSelector);
    if (!target) return;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
      const html = await response.text();
      target.innerHTML = html;
    } catch (err) {
      console.error(`Failed to load ${url}:`, err);
    }
  };

  // ── Setup navbar dynamically based on login state ──
  function setupNavbar() {
    const user = window.IE108.getUser();

    // Swap auth buttons for user menu if logged in
    const actionsEl = qs(".nav-actions");
    if (!actionsEl) return;

    if (user && user.loggedIn) {
      const roleLabel = { player: "Player", owner: "Chủ sân", admin: "Admin" };
      const roleColor = {
        player: "#3b82f6",
        owner: "#8b5cf6",
        admin: "#ef4444",
      };
      const roleDest = {
        player: "index.html",
        owner: "owner.html",
        admin: "admin.html",
      };

      actionsEl.innerHTML = `
        <a href="${
          roleDest[user.role] || "index.html"
        }" style="display:flex;align-items:center;gap:8px;color:#fff;font-weight:700;font-size:14px;text-decoration:none;padding:8px 12px;border-radius:10px;background:rgba(255,255,255,.08)">
          <span style="width:28px;height:28px;border-radius:8px;background:${
            roleColor[user.role] || "#6b7280"
          };display:grid;place-items:center;font-size:12px;font-weight:800;color:#fff;flex:none">${
        user.name[0]
      }</span>
          <span style="display:flex;flex-direction:column;line-height:1.2">
            <span>${user.name}</span>
            <span style="font-size:11px;font-weight:500;color:rgba(255,255,255,.55)">${
              roleLabel[user.role] || user.role
            }</span>
          </span>
        </a>
        <button id="btn-logout-nav" class="btn btn-ghost" style="font-size:13px;padding:9px 14px">
          <i class="fa-solid fa-arrow-right-from-bracket" style="margin-right:6px"></i>Đăng xuất
        </button>
      `;

      qs("#btn-logout-nav")?.addEventListener("click", () => {
        if (confirm("Bạn có chắc muốn đăng xuất?")) window.IE108.logout();
      });

      // Mobile menu too
      const mobileActions = qs(".mobile-actions");
      if (mobileActions) {
        mobileActions.innerHTML = `
          <div style="color:#fff;font-size:14px;font-weight:700;padding:8px 6px">Xin chào, ${user.name}!</div>
          <button id="m-logout" class="btn btn-ghost" style="font-size:13px">Đăng xuất</button>
        `;
        qs("#m-logout")?.addEventListener("click", () => window.IE108.logout());
      }

      // Add role-specific nav links
      const navLinks = qs(".nav-links");
      if (navLinks && user.role === "owner") {
        const ownerLink = document.createElement("a");
        ownerLink.href = "owner.html";
        ownerLink.className = "nav-link";
        ownerLink.textContent = "Quản lý sân";
        navLinks.appendChild(ownerLink);
      }
      if (navLinks && user.role === "admin") {
        const adminLink = document.createElement("a");
        adminLink.href = "admin.html";
        adminLink.className = "nav-link";
        adminLink.style.color = "#fca5a5";
        adminLink.textContent = "Admin Panel";
        navLinks.appendChild(adminLink);
      }
    } else {
      // Not logged in — default buttons
      qs("#btn-login")?.addEventListener(
        "click",
        () => (window.location.href = "login.html")
      );
      qs("#btn-signup")?.addEventListener(
        "click",
        () => (window.location.href = "signup.html")
      );
      qs("#m-login")?.addEventListener(
        "click",
        () => (window.location.href = "login.html")
      );
      qs("#m-signup")?.addEventListener(
        "click",
        () => (window.location.href = "signup.html")
      );
    }
  }

  // Setup navbar and footer on all pages
  document.addEventListener("DOMContentLoaded", async function () {
    await window.IE108.loadComponent("#navbar-root", "components/navbar.html");
    await window.IE108.loadComponent("#footer-root", "components/footer.html");

    // Mobile toggle
    const navToggle = qs("#nav-toggle");
    const mobileMenu = qs("#mobile-menu");
    if (navToggle && mobileMenu) {
      navToggle.addEventListener("click", () => {
        const isHidden = mobileMenu.hasAttribute("hidden");
        if (isHidden) mobileMenu.removeAttribute("hidden");
        else mobileMenu.setAttribute("hidden", "");
      });
    }

    // Set year
    const yearEl = qs("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Auth-aware navbar
    setupNavbar();
  });
})();
