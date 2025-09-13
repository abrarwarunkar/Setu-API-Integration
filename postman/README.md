# Stage 1 - Postman API Testing

## Setup Instructions

1. **Import Collection**: Import `Setu_API_Collection.json` into Postman
2. **Set Environment Variables**:
   - `client_id`: Your Setu client ID
   - `client_secret`: Your Setu client secret  
   - `product_instance_id`: Your product instance ID
   - `base_url`: https://dg-sandbox.setu.co (already set)

## Testing Flow

### 1. Upload Document
- **Method**: POST `/api/documents`
- **Body**: multipart/form-data with `name` and `document` (PDF file)
- **Auto-saves**: `document_id` to environment variables

### 2. Initiate Signature
- **Method**: POST `/api/signature`
- **Body**: JSON with documentId, redirectUrl, signers
- **Auto-saves**: `signature_id` to environment variables
- **Returns**: `signatureUrl` for signing

### 3. Get Signature Status
- **Method**: GET `/api/signature/{signature_id}`
- **Returns**: Current status (pending/completed/failed)

### 4. Download Signed Document
- **Method**: GET `/api/documents/{document_id}/download`
- **Returns**: Signed PDF file (only when status is completed)

## Video Recording Checklist

Record a walkthrough showing:
- ✅ Environment variables setup
- ✅ Document upload with successful response
- ✅ Signature initiation with returned metadata
- ✅ Status checking (pending → completed)
- ✅ Document download
- ✅ Complete end-to-end flow demonstration