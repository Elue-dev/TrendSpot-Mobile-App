export const DEFAULT_AVATAR =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZlr0nV3MSR5rc0souSDovrbJ1NIj--YEqwQ&usqp=CAU";

export const parseText = (html: string) => {
  const htmlTagsRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi;
  const extractedText = html.replace(htmlTagsRegex, "");
  return extractedText;
};
