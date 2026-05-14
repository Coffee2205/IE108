# IE108

Static multi-page frontend for the football pitch booking and match-making project.

## Structure

### Pages
- `static/index.html` - Home page with hero section and stats
- `static/login.html` - Login page with modern dark theme
- `static/signup.html` - Signup page with role selection
- `static/venues.html` - Venue discovery and booking with background images
- `static/matchfeed.html` - Match feed posting and discovery page
- `static/history.html` - Booking history page
- `static/contact.html` - Contact information page

### Components
- `static/components/` - Reusable HTML partials (navbar, footer, hero, venues, matchfeed, history, stats, contact)

### Styles & Scripts
- `static/assets/css/` - Base and component-specific CSS files
- `static/assets/js/shared.js` - Common utilities for all pages
- `static/assets/js/home.js` - Home page logic
- `static/assets/js/login.js` - Login page with form validation
- `static/assets/js/signup.js` - Signup page with password validation
- `static/assets/js/venues.js` - Venue listing, filtering, detail modal
- `static/assets/js/matchfeed.js` - Post creation & feed rendering
- `static/assets/js/history.js` - Booking history management
- `static/assets/js/contact.js` - Contact page setup

## Run locally

- `npm run dev` - serve from within the static directory
- `npm run start` - serve the static folder (may require proper working directory)
- `npm run check` - syntax-check the JavaScript

Quick one-off server without npm:
```bash
cd static && npx http-server .
```

## Architecture

- **Multi-page app**: Each navbar menu item leads to a separate HTML page
- **Component-based**: Reusable HTML partials loaded on each page (navbar, footer)
- **Shared utilities**: Common functions in `shared.js` (toast notifications, component loading, data)
- **Page-specific scripts**: Each page has its own script handling page-specific interactions
- **Authentication**: Login and signup pages with form validation and localStorage user session

## Navigation

- **Trang chủ** (Home) → `index.html` - Hero section with quick booking form
- **Tìm sân** (Find venues) → `venues.html` - Browse venues with enhanced background images
- **Ghép trận** (Match feed) → `matchfeed.html` - Create and join match posts
- **Lịch sử đặt sân** (Booking history) → `history.html` - View booking history
- **Liên hệ** (Contact) → `contact.html` - Contact information and quick links

## Authentication

- **Login Page** (`login.html`) - Dark theme login form with:
  - Email/phone & password inputs
  - Remember me checkbox
  - Forgot password link
  - Social login buttons (Facebook, Google)
  - Link to signup

- **Signup Page** (`signup.html`) - Modern registration form with:
  - First name & last name fields
  - Email & phone inputs
  - Password with confirmation
  - Role selection (Player, Venue Owner, Coach)
  - Terms & privacy checkbox
  - Social signup options

## Features

- ✅ Responsive multi-page design
- ✅ Modern dark theme for auth pages
- ✅ Venue cards with background image overlays
- ✅ Form validation and error handling
- ✅ Toast notifications for user feedback
- ✅ Smooth page transitions
- ✅ Navbar + Footer on all pages
- ✅ Mobile-friendly layout
- ✅ Mock data & local storage sessions

## Notes for contributors

- The project is HTML, CSS and vanilla JavaScript only.
- No React, Vue, Angular, backend, or database is used.
- Each page loads the navbar and footer dynamically via `shared.js`
- Mock data is stored in `shared.js` and accessible globally via `window.IE108`
- User sessions are stored in localStorage (demo purposes)
- Use GitHub SSH for cloning and pushing:

```bash
git clone git@github.com:Coffee2205/IE108.git
```

Node.js 18+ is recommended.
