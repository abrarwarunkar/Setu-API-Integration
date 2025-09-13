export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientId, clientSecret, productInstanceId, name, document } = req.body;

    const buffer = Buffer.from(document, 'base64');
    const blob = new Blob([buffer], { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('document', blob, name);

    const response = await fetch('https://dg-sandbox.setu.co/api/documents', {
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-product-instance-id': productInstanceId,
      },
      body: formData,
    });

    const data = await response.json();
    console.log('Document upload response:', data);
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: error.message });
  }
}