import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

function randomUUID(): string {
  return crypto.randomUUID(); // Edge/Web global crypto
}

export async function uploadFileToS3(file: Uint8Array, fileType: string) {
  const fileKey = `uploads/${randomUUID()}.${fileType.split("/")[1]}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileKey,
    Body: file,
    ContentType: fileType,
  });

  await s3.send(command);

  // public URL
  const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  return fileUrl;
}
