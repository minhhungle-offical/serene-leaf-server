import slugify from "slugify";
import PostCategory from "../models/PostCategory.js"; // điều chỉnh đường dẫn phù hợp

export async function generateUniqueSlug(name, currentId = null) {
  let baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let suffix = 1;

  let slugExists = await PostCategory.findOne({
    slug,
    _id: { $ne: currentId },
  });

  while (slugExists) {
    slug = `${baseSlug}-${suffix}`;
    slugExists = await PostCategory.findOne({ slug, _id: { $ne: currentId } });
    suffix++;
  }

  return slug;
}
