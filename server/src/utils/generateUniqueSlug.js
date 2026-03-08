import slugify from "./slugify.js";

const generateUniqueSlug = async (Model, title) => {
  const baseSlug = slugify(title);

  let slug = baseSlug;
  let counter = 1;

  while (await Model.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export default generateUniqueSlug;