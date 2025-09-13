export const getCredentials = () => {
  if (typeof window === 'undefined') return null;
  
  const credentials = localStorage.getItem('setuCredentials');
  return credentials ? JSON.parse(credentials) : null;
};

export const saveCredentials = (credentials) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('setuCredentials', JSON.stringify(credentials));
};

export const uploadDocument = async (file) => {
  const credentials = getCredentials();
  if (!credentials) throw new Error('No credentials found. Please configure API credentials in Settings.');

  const reader = new FileReader();
  const base64 = await new Promise((resolve) => {
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });

  const response = await fetch('/api/documents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
      productInstanceId: credentials.productInstanceId,
      name: file.name,
      document: base64,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed (${response.status}): ${errorText}`);
  }

  return response.json();
};

export const initiateSignature = async (documentId, redirectUrl) => {
  const credentials = getCredentials();
  if (!credentials) throw new Error('No credentials found. Please configure API credentials in Settings.');

  const payload = {
    clientId: credentials.clientId,
    clientSecret: credentials.clientSecret,
    productInstanceId: credentials.productInstanceId,
    documentId,
    redirectUrl,
    signers: [
      {
        name: 'Test Signer',
        email: 'test@example.com',
        phone: '9999999999'
      }
    ]
  };

  const response = await fetch('/api/signature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Signature initiation failed (${response.status}): ${errorText}`);
  }

  return response.json();
};

export const getSignatureStatus = async (signatureId) => {
  const credentials = getCredentials();
  if (!credentials) throw new Error('No credentials found. Please configure API credentials in Settings.');

  const response = await fetch(`/api/signature/${signatureId}`, {
    method: 'GET',
    headers: {
      'clientId': credentials.clientId,
      'clientSecret': credentials.clientSecret,
      'productInstanceId': credentials.productInstanceId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Status fetch failed (${response.status}): ${errorText}`);
  }

  return response.json();
};

export const downloadDocument = async (signatureId) => {
  const credentials = getCredentials();
  if (!credentials) throw new Error('No credentials found. Please configure API credentials in Settings.');

  const response = await fetch(`/api/signature/${signatureId}/download`, {
    method: 'GET',
    headers: {
      'clientId': credentials.clientId,
      'clientSecret': credentials.clientSecret,
      'productInstanceId': credentials.productInstanceId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Download failed (${response.status}): ${errorText}`);
  }

  return response.blob();
};