export default function Home() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Digital Document Signing</h1>
        <p className="page-subtitle">
          Secure, legally compliant eSign solution powered by Setu API. 
          Upload documents and get them signed with Aadhaar-based digital signatures.
        </p>
      </div>

      <div className="grid grid-3 mb-4">
        <div className="card text-center">
          <div className="upload-icon">🔒</div>
          <h3 className="card-title">Secure</h3>
          <p className="text-sm text-secondary">Aadhaar-based authentication ensures maximum security</p>
        </div>
        <div className="card text-center">
          <div className="upload-icon">⚡</div>
          <h3 className="card-title">Fast</h3>
          <p className="text-sm text-secondary">Complete signing process in minutes</p>
        </div>
        <div className="card text-center">
          <div className="upload-icon">✅</div>
          <h3 className="card-title">Legal</h3>
          <p className="text-sm text-secondary">Fully compliant with Indian IT Act</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Getting Started</h2>
          <p className="card-description">Follow these steps to sign your documents</p>
        </div>
        
        <div className="grid grid-2">
          <div>
            <h3 className="font-semibold mb-4">Quick Setup</h3>
            <ol className="text-sm" style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Configure your Setu API credentials</li>
              <li>Upload a PDF document</li>
              <li>Complete Aadhaar verification</li>
              <li>Download signed document</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Requirements</h3>
            <ul className="text-sm" style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Valid Setu API credentials</li>
              <li>PDF documents (max 10MB)</li>
              <li>Aadhaar number for signing</li>
              <li>Mobile number for OTP</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <a href="/settings" className="btn btn-outline">
            Configure Settings
          </a>
          <a href="/upload" className="btn btn-primary">
            Upload Document
          </a>
        </div>
      </div>

      <div className="alert alert-warning">
        <strong>Demo Notice:</strong> This is a frontend-only demo using Setu's sandbox environment. 
        API credentials are stored in browser localStorage for testing purposes only.
      </div>
    </>
  );
}