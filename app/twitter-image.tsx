// twitter:image uses the same branded card as og:image. Re-export the
// opengraph-image route so there is a single source of truth for the art.
export { default, alt, size, contentType } from "./opengraph-image";
