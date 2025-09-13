export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientId, clientSecret, productInstanceId, documentId, redirectUrl, signers } = req.body;

    const cleanSigners = signers.map(signer => ({
      identifier: '9876543210',
      displayName: 'Test Signer',
      birthYear: '1991',
      signature: {
        height: 60,
        onPages: ['1'],
        position: 'bottom-left',
        width: 180
      }
    }));

    const payload = {
      documentId,
      redirectUrl,
      signers: cleanSigners
    };

    const response = await fetch('https://dg-sandbox.setu.co/api/signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-product-instance-id': productInstanceId,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('=== SIGNATURE RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('=== END RESPONSE ===');
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Signature API error:', error);
    res.status(500).json({ error: error.message });
  }
}