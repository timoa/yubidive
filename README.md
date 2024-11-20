# YubiDive 🤿

[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.0.0-FF3E00.svg)](https://kit.svelte.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-5.0.0-FF3E00.svg)](https://svelte.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.15-38B2AC.svg)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748.svg)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

A modern, efficient scuba diving booking management system designed for dive clubs and centers. YubiDive simplifies the process of managing boat schedules, dive bookings, and member interactions.

## ✨ Features

### 🛥️ Boat Management

- Create and manage boat profiles with detailed information
- Track boat capacity and status (active, inactive, maintenance)
- View boat schedules and availability

### 📅 Schedule Management

- Create and manage dive schedules
- Set start and end times for dive sessions
- Track available spots for each scheduled dive
- View upcoming and past schedules

### 🎫 Booking System

- Easy-to-use booking interface for members
- Real-time availability checking
- Booking management for administrators
- View and manage upcoming and past bookings

### 👥 User Management

- Member registration and authentication
- Role-based access control (admin/member)
- Member profile management

### 🌐 Internationalization

- Multi-language support (English/French)
- Easy to extend with additional languages

### 💅 Modern UI/UX

- Clean, responsive design using TailwindCSS
- Intuitive navigation and user flows
- Consistent design language across all pages

## 🚀 Tech Stack

- **Frontend**: SvelteKit 2.0, Svelte 5.0
- **Styling**: TailwindCSS 3.4
- **Database**: Prisma ORM with SQLite (Cloudflare R2 planned)
- **Deployment**: Cloudflare Pages/Vercel/Netlify (planned)

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/yubidive.git
   cd yubidive
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the database:

   ```bash
   # Create SQLite database
   pnpm prisma db push

   # Seed the database with initial data
   pnpm prisma db seed
   ```

## 🏃‍♂️ Development

Start the development server:

```bash
# Regular start
pnpm run dev

# Start and open in browser
pnpm run dev --open
```

Build for production:

```bash
pnpm run build
```

## 🧪 Testing and Quality

```bash
# Type checking
pnpm run check

# Linting
pnpm run lint

# Format code
pnpm run format
```

## 📝 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 🔜 Roadmap

- [ ] Integration with Cloudflare R2 database
- [ ] Advanced booking management features
- [ ] Mobile app version
- [ ] Email notifications
- [ ] Calendar integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
