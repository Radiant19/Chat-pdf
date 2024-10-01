import AWS from 'aws-sdk';
import fs from 'fs/promises';
import path from 'path';

export async function downloadFromS3(file_key: string): Promise<string | null> {
    try {
        AWS.config.update({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.S3_BUCKET_NAME,
            },
            region: "eu-north-1",
        });

        const params = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: file_key,
        };

        const obj = await s3.getObject(params).promise();
        const file_name = path.join(process.env.TEMP_DIR || '/tmp', `pdf-${Date.now()}.pdf`);
        await fs.writeFile(file_name, obj.Body as Buffer);
        return file_name;
    } catch (error) {
        console.error('Error downloading file from S3:', error);
        return null;
    }
}