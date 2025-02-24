import asyncHandler from 'express-async-handler';
import {
  S3Client,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import expressAsyncHandler from 'express-async-handler';
import { customError } from '../middlewares/globalError';
const limit = process.env.PAGE_LIMITE || 5;
const client = new S3Client({
  region: 'default',
  endpoint: process.env.LIARA_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY as string,
    secretAccessKey: process.env.LIARA_SECRET_KEY as string,
  },
});
const uploadFile = expressAsyncHandler(async (req, res) => {
  if (!req.file) throw customError('هیچ عکسی انتخاب نشده', 401);
  const reqs = req.file as any;
  const fileData = {
    url: reqs?.location,
  };
  try {
    res.send({ url: fileData.url });
  } catch (error) {
    if (fileData.url) {
      const key = decodeURIComponent(fileData.url.split('/').slice(-1)[0]);
      await client.send(
        new DeleteObjectCommand({
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: key,
        }),
      );
    }
    throw customError('آپلود با خطا مواجه شد', 400, error);
  }
});

const deleteFile = expressAsyncHandler(async (req, res) => {
  const { url } = req.query;
  try {
    const key = decodeURIComponent(
      url?.toString().split('/').slice(-1)[0] as string,
    );
    const params = {
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: key as string,
    };
    await client.send(new DeleteObjectCommand(params));
    res.send({ success: true });
  } catch (err) {
    throw customError('حذف فایل با خطا مواجه شد', 500, err);
  }
});
const getAllMedia = asyncHandler(async (req, res) => {
  const { next } = req.query;
  const url = process.env.URL_IMAGE_LIARA as string;
  const params = {
    Bucket: process.env.LIARA_BUCKET_NAME,
    MaxKeys: 2,
    ContinuationToken: next?.toString(),
  };
  try {
    const data = await client.send(new ListObjectsV2Command(params));
    const files = data?.Contents?.map((file) => file.Key);
    const urls = files?.map((i) => {
      return url + i;
    });
    res.send({ data: urls, next: data.NextContinuationToken });
  } catch (err) {
    throw customError('خطا در اتصال دیتابیس', 500, err);
  }
});
export { uploadFile, deleteFile, getAllMedia };
