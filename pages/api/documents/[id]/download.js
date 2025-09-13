export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { clientid, clientsecret, productinstanceid } = req.headers;

  try {
    const response = await fetch(`https://dg-sandbox.setu.co/api/documents/${id}/download`, {
      method: 'GET',
      headers: {
        'x-client-id': clientid,
        'x-client-secret': clientsecret,
        'x-product-instance-id': productinstanceid,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const buffer = await response.arrayBuffer();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="signed-document-${id}.pdf"`);
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}