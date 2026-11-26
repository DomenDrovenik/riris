# ServisDesk

[![CI/CD](https://github.com/DomenDrovenik/riris/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/DomenDrovenik/riris/actions/workflows/ci-cd.yml)

**Nameščena aplikacija:** https://luminous-mermaid-d475a0.netlify.app
(backend: https://servisdesk-backend-latest.onrender.com)

ServisDesk je spletna aplikacija za prijavo in obravnavo servisnih zahtevkov za gospodinjske aparate.

Aplikacija omogoča strankam prijavo okvare in spremljanje poteka servisnega zahtevka. Administrator lahko zahtevke pregleduje in dodeljuje serviserjem, serviserji pa obravnavajo dodeljene zahtevke, spreminjajo njihov status ter zabeležijo izvedeno rešitev.

## Uporabljene tehnologije

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express
- Multer
- Nodemailer

### Podatkovna baza

- PostgreSQL

### Avtentikacija

- JWT
- bcrypt

### Lokalni razvoj

- Docker
- Docker Compose
- npm

## CI/CD cevovod

Cevovod (`.github/workflows/ci-cd.yml`) se zažene ob vsakem pull requestu in pushu na `main`.

1. **lint** – ESLint preveri kodo frontenda in backenda.
2. **build** – zgradi frontend (`dist/`) in Docker sliko backenda ter ju shrani kot artefakta.
3. **test** – zažene teste (Vitest, Jest) in shrani poročilo o pokritosti kode.
4. **deploy** – samo ob pushu na `main`, ko so prejšnji jobi uspešni: frontend namesti na Netlify, backend sliko pa prek GitHub Container Registry na Render. Baza teče na Neon (PostgreSQL).

## Dokumentacija

Celotna projektna dokumentacija je na voljo v direktoriju [docs](./docs/).
