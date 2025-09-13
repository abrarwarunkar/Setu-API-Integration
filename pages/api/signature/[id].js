export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { clientid, clientsecret, productinstanceid } = req.headers;

  try {
    const response = await fetch(`https://dg-sandbox.setu.co/api/signature/${id}`, {
      method: 'GET',
      headers: {
        'x-client-id': clientid,
        'x-client-secret': clientsecret,
        'x-product-instance-id': productinstanceid,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}