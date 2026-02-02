/**
 * Get the base path from Next.js config
 * This will be empty string if no basePath is configured
 */
export const getBasePath = (): string => {
  // @ts-ignore - process.env.NEXT_PUBLIC_BASE_PATH is injected at build time
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
};

/**
 * Prefix an asset path with the base path if configured
 * @param path - The asset path (should start with /)
 * @returns The prefixed path
 */
export const assetPath = (path: string): string => {
  const basePath = getBasePath();

  // If path is already absolute or external, return as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Return with basePath prefix if basePath exists
  return basePath ? `${basePath}${normalizedPath}` : normalizedPath;
};
