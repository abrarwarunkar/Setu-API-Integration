import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSignatureStatus, downloadDocument, getCredentials } from '../utils/api';

export default function Status() {
  const router = useRouter();
  const [signatureId, setSignatureId] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(false);
  const [pollInterval, setPollInterval] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && router.query.id) {
      setSignatureId(router.query.id);
      fetchStatusById(router.query.id);
    }
  }, [router.query.id, mounted]);

  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  const fetchStatusById = async (id) => {
    if (!getCredentials()) {
      setError('Please configure API credentials in Settings first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await getSignatureStatus(id);
      setStatus(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    if (!signatureId.trim()) {
      setError('Please enter a signature ID');
      return;
    }
    await fetchStatusById(signatureId.trim());
  };

  const startPolling = () => {
    if (polling) return;
    
    setPolling(true);
    const interval = setInterval(async () => {
      try {
        const response = await getSignatureStatus(signatureId.trim());
        setStatus(response);
        
        if (response.status === 'completed' || response.status === 'sign_completed' || response.status === 'failed') {
          setPolling(false);
          clearInterval(interval);
          setPollInterval(null);
        }
      } catch (err) {
        setPolling(false);
        clearInterval(interval);
        setPollInterval(null);
        setError(err.message);
      }
    }, 5000);

    setPollInterval(interval);
  };

  const stopPolling = () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
    setPolling(false);
  };

  const handleDownload = async () => {
    if (!status?.id) return;

    try {
      setLoading(true);
      const blob = await downloadDocument(status.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed-document-${status.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(`Download failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const mockComplete = () => {
    setStatus(prev => ({
      ...prev,
      status: 'completed',
      completedAt: new Date().toISOString()
    }));
  };

  const getStatusClass = (statusValue) => {
    switch (statusValue?.toLowerCase()) {
      case 'completed': 
      case 'sign_completed': 
        return 'status-completed';
      case 'failed': 
        return 'status-failed';
      default: 
        return 'status-pending';
    }
  };

  const isCompleted = (statusValue) => {
    return statusValue?.toLowerCase() === 'completed' || statusValue?.toLowerCase() === 'sign_completed';
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Signature Status</h1>
        <p className="page-subtitle">Check the status of your signature request and download signed documents</p>
      </div>

      {!getCredentials() && (
        <div className="alert alert-warning">
          <strong>Configuration Required:</strong> Please configure your API credentials in Settings.
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

      <div className="card">
        <div className="form-group">
          <label className="label" htmlFor="signatureId">
            Signature Request ID *
          </label>
          <input
            id="signatureId"
            type="text"
            className="input"
            value={signatureId}
            onChange={(e) => setSignatureId(e.target.value)}
            placeholder="Enter signature request ID"
            disabled={loading}
          />
          <div className="input-help">
            You can find this ID in the upload confirmation or URL parameters
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <button 
            onClick={fetchStatus} 
            className="btn btn-primary" 
            disabled={loading || !signatureId.trim() || !getCredentials()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Checking...
              </>
            ) : (
              'Check Status'
            )}
          </button>

          <button 
            onClick={polling ? stopPolling : startPolling} 
            className={`btn ${polling ? 'btn-outline' : 'btn-secondary'}`}
            disabled={!signatureId.trim() || !getCredentials()}
          >
            {polling ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'}
          </button>
        </div>

        {polling && (
          <div className="alert alert-success">
            <strong>Auto-refreshing:</strong> Checking status every 5 seconds...
          </div>
        )}
      </div>

      {status && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Signature Request Details</h3>
          </div>
          
          <div className="grid grid-2 mb-4">
            <div className="info-box">
              <div className="info-title">Request ID</div>
              <div className="info-content text-xs" style={{ wordBreak: 'break-all' }}>
                {status.id}
              </div>
            </div>
            <div className="info-box">
              <div className="info-title">Document ID</div>
              <div className="info-content text-xs" style={{ wordBreak: 'break-all' }}>
                {status.documentId}
              </div>
            </div>
          </div>

          <div className="grid grid-2 mb-4">
            <div>
              <span className="label">Status:</span>
              <span className={`status ${getStatusClass(status.status)} ml-2`}>
                {status.status}
              </span>
            </div>
            <div>
              <span className="label">Created:</span>
              <span className="text-sm ml-2">
                {new Date(status.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {status.completedAt && (
            <div className="mb-4">
              <span className="label">Completed:</span>
              <span className="text-sm ml-2">
                {new Date(status.completedAt).toLocaleString()}
              </span>
            </div>
          )}

          <div className={`alert ${isCompleted(status.status) ? 'alert-success' : status.status === 'failed' ? 'alert-error' : 'alert-warning'}`}>
            {isCompleted(status.status) && (
              <strong>Document has been successfully signed and is ready for download.</strong>
            )}
            {status.status === 'failed' && (
              <strong>Signature process failed. Please try uploading the document again.</strong>
            )}
            {!isCompleted(status.status) && status.status !== 'failed' && (
              <strong>Signature request is pending. Complete the signing process using the signature URL.</strong>
            )}
          </div>

          <div className="flex gap-4">
            {isCompleted(status.status) && (
              <button 
                onClick={handleDownload} 
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Downloading...
                  </>
                ) : (
                  'Download Signed Document'
                )}
              </button>
            )}

            {!isCompleted(status.status) && status.status !== 'failed' && (
              <button 
                onClick={mockComplete} 
                className="btn btn-outline"
              >
                Mock Complete (Demo)
              </button>
            )}

            <button 
              onClick={() => fetchStatusById(status.id)} 
              className="btn btn-outline"
              disabled={loading}
            >
              Refresh Status
            </button>
          </div>
        </div>
      )}

      <div className="info-box">
        <div className="info-title">Status Guide</div>
        <div className="info-content">
          <div className="grid grid-3 gap-4">
            <div>
              <span className="status status-pending">SIGN_INITIATED</span>
              <p className="text-xs mt-2">Document is ready for signing</p>
            </div>
            <div>
              <span className="status status-completed">COMPLETED</span>
              <p className="text-xs mt-2">Document has been signed successfully</p>
            </div>
            <div>
              <span className="status status-failed">FAILED</span>
              <p className="text-xs mt-2">Signature process failed</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}