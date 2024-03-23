import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    // Assuming JSON with "filename", "status", and "result"
    const { filename, status, result } = req.body;


    if (!filename || !status || !result) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    if (status !== 'processing' && status !== 'completed') {
        res.status(400).json({ error: 'Invalid status value' });
        return;
    }

    switch (status) {
        case 'processing':
            console.log(`Processing file: ${filename}`, result);
            res.status(202).json({ message: 'File is being processed', filename, result });
            break;
        case 'completed':
            console.log(`File processing completed: ${filename}`, result);
            res.status(200).json({ message: 'File processing completed', filename, result });
            break;
        default:
            res.status(500).json({ error: 'Unexpected status value' });
    }
}
