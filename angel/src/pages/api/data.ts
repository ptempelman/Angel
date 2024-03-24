import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '~/server/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    // Assuming JSON with "filename", "status", and "result"
    const { reportId, filename, status, result } = req.body;


    if (!reportId || !filename || !status || !result) {
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

            // Save the file and status to the database
            try {
                const issue = await db.issue.create({
                    data: {
                        reportId: reportId,
                        status: status,
                        filename: filename,
                        description: result,
                    },
                });
                res.status(200).json({ message: 'File processing notification received', issue });
            } catch (error) {
                console.error('Error creating issue:', error);
                res.status(500).json({ error: 'Internal server error' });
            }

            res.status(202).json({ message: 'File is being processed', filename, result });
            break;
        case 'completed':
            console.log(`File processing completed: ${filename}`, result);

            // Save the result to the database
            try {

                // Attempt to find the issue first
                const existingIssue = await db.issue.findFirst({
                    where: {
                        reportId: reportId,
                        filename: filename,
                    },
                });

                if (existingIssue) {
                    // If the issue exists, update it
                    const updatedIssue = await db.issue.update({
                        where: { id: existingIssue.id },
                        data: {
                            status: status,
                            description: result,
                        },
                    });
                } else {
                    // If the issue does not exist, create a new one
                    const newIssue = await db.issue.create({
                        data: {
                            reportId: reportId,
                            filename: filename,
                            status: status,
                            description: result,
                        },
                    });
                }

                res.status(200).json({ message: 'File processing completed' });
            } catch (error) {
                console.error('Error updating issue:', error);
                res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'File processing completed', filename, result });
            break;
        default:
            res.status(500).json({ error: 'Unexpected status value' });
    }
}
