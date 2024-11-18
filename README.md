# Yubidive (WIP)

Simple Scuba dive bookings app.

## Project goal

The goal is to make an app that will help Suba clubs to manage their Scuba bookings. More features will come later.

Also, make it runs on a free tier environment like Cloudflare Pages, Vercel or Netlify.

The app is currently based on SvelteKit and TailwindCSS. It uses Prisma for database management.
During the early development, the app will use a SQLite database and I will try to make it works with Cloudflare R2 database later.

> Note: This project is still in (very) early development.

## Installation

```bash
pnpm install
```

Create the SQLite database:

```bash
pnpm prisma db push
```

Seed the database:

```bash
pnpm prisma db seed
```

## Usage

Run the development server

```bash
pnpm run dev
```

Run the development server and open the browser:

```bash
pnpm run dev --open
```

Build the project:

```bash
pnpm run build
```

## License

This project is under the Apache 2 license. See the [LICENSE](LICENSE) file for more details.
