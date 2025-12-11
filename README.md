# GPULaw Crypto - AI Legal Assistant

An AI-powered legal assistant application specialized in cryptocurrency compliance and regulatory documentation.

## Features

- **AI-Powered Document Generation**: Generate professional legal documents using Claude AI
- **Multi-language Support**: Available in English, Traditional Chinese, and Simplified Chinese
- **Case Management**: Organize and track legal cases
- **Document Templates**: Pre-built templates for various legal documents
- **Crypto Compliance Focus**: Specialized in cryptocurrency regulatory requirements

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Anthropic Claude API
- **Internationalization**: next-intl
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gpulaw-crypto
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Edit `.env` and add your credentials:
```
DATABASE_URL="your_postgresql_connection_string"
ANTHROPIC_API_KEY="your_anthropic_api_key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
```

4. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (when using a real database)
npx prisma db push

# Optional: Seed the database
npm run seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

The app will automatically redirect to `/en` (English) by default. Available routes:
- English: [http://localhost:3000/en](http://localhost:3000/en)
- Traditional Chinese: [http://localhost:3000/zh-TW](http://localhost:3000/zh-TW)
- Simplified Chinese: [http://localhost:3000/zh-CN](http://localhost:3000/zh-CN)

## Project Structure

```
gpulaw-crypto/
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── page.tsx       # Home page
│   │   └── layout.tsx     # Root layout
│   └── api/               # API routes
│       └── documents/     # Document generation API
├── i18n/                  # Internationalization config
├── lib/                   # Utility functions
│   ├── ai.ts             # Claude AI integration
│   └── prisma.ts         # Prisma client
├── messages/              # Translation files
│   ├── en.json
│   ├── zh-TW.json
│   └── zh-CN.json
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Database Schema

The application uses the following main models:

- **User**: User accounts with roles (Admin, Lawyer, Assistant, Client)
- **Case**: Legal cases with categories and status tracking
- **Document**: Legal documents with AI-generated content support
- **DocumentTemplate**: Reusable templates for common legal documents

### Case Categories

- Crypto Exchange Compliance
- ICO Legal Opinion
- AML Compliance
- User Agreement
- Regulatory Filing
- Licensing
- Token Classification
- Smart Contract Audit

## Language Support

The application supports URL-based language switching:

- English: `/en`
- Traditional Chinese: `/zh-TW`
- Simplified Chinese: `/zh-CN`

Language switching is automatic based on URL prefix.

## AI Document Generation

The AI document generation feature uses Claude API to:

1. Analyze case requirements
2. Apply relevant legal templates
3. Generate professional legal documents
4. Support multiple languages
5. Include appropriate legal disclaimers

### Document Generation Flow

1. Navigate to Dashboard → Generate with AI
2. Select case category
3. Enter client name and requirements
4. Choose language
5. Click "Generate Document"
6. Review and edit generated document
7. Save to database

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub

2. Import the project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `ANTHROPIC_API_KEY`
   - `NEXTAUTH_URL` (use your Vercel deployment URL)
   - `NEXTAUTH_SECRET`

4. Deploy!

### Database Setup

For production, we recommend:
- **Neon**: Serverless PostgreSQL (recommended for Vercel)
  - Create database at [neon.tech](https://neon.tech)
  - Copy connection string to `DATABASE_URL`
- **Supabase**: PostgreSQL with additional features
- **Railway**: Simple PostgreSQL hosting

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ANTHROPIC_API_KEY` | Claude API key from console.anthropic.com | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth (generate with `openssl rand -base64 32`) | Yes |

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma Client

## Key Pages

- `/` - Landing page with features overview
- `/[locale]/dashboard` - Main dashboard
- `/[locale]/dashboard/cases` - Case management
- `/[locale]/dashboard/documents/generate` - AI document generator

## Features to Implement

This is a demo/prototype. Future enhancements could include:

- [ ] User authentication with NextAuth.js
- [ ] Real database integration
- [ ] Document export (PDF, DOCX)
- [ ] Email notifications
- [ ] Audit trail and version control
- [ ] Team collaboration features
- [ ] Custom document templates
- [ ] Advanced AI prompting
- [ ] Document analytics

## License

This project is proprietary software for GPULaw.

## Support

For support, please contact: support@gpulaw.com

---

Built with ❤️ using Next.js and Claude AI
