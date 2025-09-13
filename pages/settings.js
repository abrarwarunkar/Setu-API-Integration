import { useState, useEffect } from 'react';
import { getCredentials, saveCredentials } from '../utils/api';

export default function Settings() {
  const [credentials, setCredentials] = useState({
    clientId: '',
    clientSecret: '',
    productInstanceId: ''
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const existingCredentials = getCredentials();
    if (existingCredentials) {
      setCredentials(existingCredentials);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.clientId || !credentials.clientSecret || !credentials.productInstanceId) {
      setError('All fields are required');
      return;
    }

    try {
      saveCredentials(credentials);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save credentials');
    }
  };

  const handleChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    setSaved(false);
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">API Configuration</h1>
        <p className="page-subtitle">Configure your Setu API credentials to enable document signing</p>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {saved && (
          <div className="alert alert-success">
            Credentials saved successfully! You can now upload documents.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="clientId">
              Client ID *
            </label>
            <input
              id="clientId"
              type="text"
              className="input"
              value={credentials.clientId}
              onChange={(e) => handleChange('clientId', e.target.value)}
              placeholder="Enter your Setu Client ID"
              required
            />
            <div className="input-help">
              Found in your Setu dashboard under API credentials
            </div>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="clientSecret">
              Client Secret *
            </label>
            <input
              id="clientSecret"
              type="password"
              className="input"
              value={credentials.clientSecret}
              onChange={(e) => handleChange('clientSecret', e.target.value)}
              placeholder="Enter your Setu Client Secret"
              required
            />
            <div className="input-help">
              Keep this secret secure and never share it publicly
            </div>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="productInstanceId">
              Product Instance ID *
            </label>
            <input
              id="productInstanceId"
              type="text"
              className="input"
              value={credentials.productInstanceId}
              onChange={(e) => handleChange('productInstanceId', e.target.value)}
              placeholder="Enter your Product Instance ID"
              required
            />
            <div className="input-help">
              Specific to your eSign product configuration
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary">
              Save Configuration
            </button>
            <button 
              type="button" 
              onClick={() => {
                setCredentials({ clientId: '', clientSecret: '', productInstanceId: '' });
                localStorage.removeItem('setuCredentials');
                setSaved(false);
              }}
              className="btn btn-outline"
            >
              Clear All
            </button>
          </div>
        </form>
      </div>

      <div className="info-box">
        <div className="info-title">Security Notice</div>
        <div className="info-content">
          This demo stores credentials in browser localStorage for testing purposes only. 
          In production, use secure server-side credential management.
        </div>
      </div>

      {credentials.clientId && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Current Configuration</h3>
          </div>
          <div className="text-sm">
            <p><strong>Client ID:</strong> {credentials.clientId.substring(0, 8)}...****</p>
            <p><strong>Product Instance ID:</strong> {credentials.productInstanceId.substring(0, 8)}...****</p>
            <div className="alert alert-success mt-4">
              Configuration is complete. You can now upload documents.
            </div>
          </div>
        </div>
      )}
    </>
  );
}