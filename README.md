# Setu API Integration - Frontend Demo

A Next.js application demonstrating integration with Setu's eSign APIs for document signing workflows.

## ⚠️ Security Notice

This is a **frontend-only demo application**. API credentials are stored in browser localStorage, which is **insecure for production use**. This approach is only suitable for testing and demonstration purposes.

## Features

- **Settings Page**: Configure Setu API credentials
- **Upload Contract**: Upload PDF documents and initiate signature requests
- **Status Tracking**: Monitor signature request status with real-time polling
- **Document Download**: Download signed documents when completed

## Getting Started

### Prerequisites

- Node.js 18+ 
- Setu API sandbox credentials

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Configure Credentials**: Go to Settings and enter your Setu API credentials
2. **Upload Document**: Navigate to Upload Contract and select a PDF file
3. **Sign Document**: Use the embedded iframe or open the signature URL in a new tab
4. **Check Status**: Monitor progress in the Status page
5. **Download**: Download the signed document when completed

## API Endpoints Used

- `POST /api/documents` - Upload PDF documents
- `POST /api/signature` - Initiate signature requests  
- `GET /api/signature/:id` - Check signature status
- `GET /api/documents/:id/download` - Download signed documents

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Or use Vercel CLI:
```bash
vercel --prod
```

## Project Structure

```
├── pages/
│   ├── index.js          # Landing page
│   ├── settings.js       # API credentials configuration
│   ├── upload.js         # Document upload and signature initiation
│   └── status.js         # Status checking and document download
├── components/
│   └── Layout.js         # Navigation layout
├── utils/
│   └── api.js           # Setu API integration functions
└── styles/
    └── globals.css      # Application styles
```

## Technologies Used

- Next.js 14
- React 18
- Vanilla CSS
- Setu eSign API

## License

MIT