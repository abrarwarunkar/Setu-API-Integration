import { useState } from 'react';
import { uploadDocument, initiateSignature, getCredentials } from '../utils/api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!getCredentials()) {
      setError('Please configure API credentials in Settings first');
      return;
    }

    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setProgress(0);
    setError('');
    setResult(null);

    try {
      setProgress(25);
      const uploadResponse = await uploadDocument(file);
      
      setProgress(50);
      const redirectUrl = `${window.location.origin}/upload?completed=true`;
      const documentId = uploadResponse.id || uploadResponse.documentId;
      
      if (!documentId) {
        throw new Error('No document ID received from upload');
      }
      
      setProgress(75);
      const signatureResponse = await initiateSignature(documentId, redirectUrl);
      
      let signatureUrl = null;
      if (signatureResponse.signers && signatureResponse.signers.length > 0) {
        signatureUrl = signatureResponse.signers[0].url;
      }
      
      setProgress(100);
      setResult({
        documentId: documentId,
        signatureId: signatureResponse.id,
        signatureUrl: signatureUrl,
        status: signatureResponse.status
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openSignatureUrl = () => {
    if (result?.signatureUrl) {
      window.open(result.signatureUrl, '_blank');
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Upload Document</h1>
        <p className="page-subtitle">Upload a PDF document to initiate the digital signing process</p>
      </div>

      {!getCredentials() && (
        <div className="alert alert-warning">
          <strong>Configuration Required:</strong> Please configure your API credentials in Settings before uploading documents.
          <div className="mt-4">
            <a href="/settings" className="btn btn-primary">
              Go to Settings
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {!result && (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div 
              className={`upload-zone ${dragOver ? 'dragover' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div className="upload-icon">📄</div>
              <div className="upload-text">Drop PDF here or click to browse</div>
              <div className="upload-subtext">Maximum file size: 10MB • PDF format only</div>
              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e.target.files[0])}
                style={{ display: 'none' }}
                disabled={loading}
              />
            </div>

            {file && (
              <div className="info-box">
                <div className="info-title">Selected File</div>
                <div className="info-content">
                  <p><strong>Name:</strong> {file.name}</p>
                  <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Type:</strong> {file.type}</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center">
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="loading">
                  <span className="spinner"></span>
                  {progress < 30 ? 'Uploading document...' : 
                   progress < 80 ? 'Initiating signature request...' : 
                   'Finalizing...'}
                </div>
                <div className="text-xs text-secondary">{progress}% complete</div>
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <button 
                type="submit" 
                className="btn btn-primary w-full" 
                disabled={loading || !file || !getCredentials()}
              >
                {loading ? 'Processing...' : 'Upload & Initiate Signature'}
              </button>
            </div>
          </form>
        </div>
      )}

      {result && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upload Successful</h3>
            <p className="card-description">Your document has been uploaded and signature request initiated</p>
          </div>
          
          <div className="grid grid-2 mb-4">
            <div className="info-box">
              <div className="info-title">Document ID</div>
              <div className="info-content text-xs" style={{ wordBreak: 'break-all' }}>
                {result.documentId}
              </div>
            </div>
            <div className="info-box">
              <div className="info-title">Signature ID</div>
              <div className="info-content text-xs" style={{ wordBreak: 'break-all' }}>
                {result.signatureId}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <span className="label">Status:</span>
            <span className="status status-pending ml-2">{result.status}</span>
          </div>

          <div className="alert alert-success">
            <strong>Next Steps:</strong>
            <ol className="mt-2" style={{ paddingLeft: '1.5rem' }}>
              <li>Click "Open Signature URL" to start signing</li>
              <li>Complete Aadhaar verification</li>
              <li>Track progress in Status page</li>
            </ol>
          </div>
          
          <div className="flex gap-4">
            <button onClick={openSignatureUrl} className="btn btn-primary">
              Open Signature URL
            </button>
            <a href={`/status?id=${result.signatureId}`} className="btn btn-outline">
              Track Status
            </a>
          </div>
        </div>
      )}

      <div className="info-box">
        <div className="info-title">Upload Guidelines</div>
        <div className="info-content">
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Only PDF documents are supported</li>
            <li>Maximum file size is 10MB</li>
            <li>Ensure document is ready for signing</li>
            <li>Use high-quality, readable documents</li>
          </ul>
        </div>
      </div>
    </>
  );
}