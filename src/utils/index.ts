export const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dwdsjbetu/image/upload/v1694223269/djsplkr1hyxxtor7mogw.jpg";

export const parseText = (html: string) => {
  const htmlTagsRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi;
  const extractedText = html.replace(htmlTagsRegex, "");
  return extractedText;
};

export const CLOUD_NAME = "dwdsjbetu";
export const UPLOAD_PRESET = "oj28w9l5";
