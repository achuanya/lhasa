import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

/**
 * Get slug from file path (just the filename without directory structure)
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @returns just the slug (filename)
 */
export function getSlugFromPath(
  id: string,
  _filePath?: string | undefined
) {
  // Making sure `id` does not contain the directory
  const blogId = id.split("/");
  const slug = blogId.length > 0 ? blogId.slice(-1)[0] : id;
  return slug;
}

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/posts` in return value
 * @param useSimpleUrl - whether to use simple URL structure (just slug)
 * @param customPrefix - custom prefix to use instead of /posts
 * @returns blog post path
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true,
  useSimpleUrl = true,
  customPrefix?: string
) {
  // If using simple URL structure for main blog posts, just return the slug with trailing slash
  if (useSimpleUrl && !customPrefix) {
    return `/${getSlugFromPath(id, filePath)}/`;
  }

  // If using custom prefix, use simple structure: customPrefix/slug with trailing slash
  if (customPrefix) {
    return `${customPrefix}/${getSlugFromPath(id, filePath)}/`;
  }

  // Original complex path logic for backward compatibility
  const pathSegments = filePath
    ?.replace(BLOG_PATH, "")
    .split("/")
    .filter(path => path !== "") // remove empty string in the segments ["", "other-path"] <- empty string will be removed
    .filter(path => !path.startsWith("_")) // exclude directories start with underscore "_"
    .slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
    .map(segment => slugifyStr(segment)); // slugify each segment path

  const basePath = includeBase ? "/posts" : "";

  // Making sure `id` does not contain the directory
  const blogId = id.split("/");
  const slug = blogId.length > 0 ? blogId.slice(-1) : blogId;

  // If not inside the sub-dir, simply return the file path with trailing slash
  if (!pathSegments || pathSegments.length < 1) {
    return [basePath, slug].join("/") + "/";
  }

  return [basePath, ...pathSegments, slug].join("/") + "/";
}
