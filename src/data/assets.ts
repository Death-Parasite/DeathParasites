const assetPaths = {
  poster: ['/assets/dp01poster.png', '/assets/dp01poster.jpg'],
  introImage: ['/assets/IMG-20260614-WA0009.jpg'],
  firefly: ['/assets/Firefly_RemoveBackground.png'],
  character1: ['/assets/IMG-20260619-WA0027.jpg', '/assets/Cpaute.png'],
  character2: ['/assets/IMG-20260620-WA0005(1).jpg'],
  character3: ['/assets/Cpauter.1'],
} as const;

export type AssetKey = keyof typeof assetPaths;

const imageCache = new Map<string, boolean>();

export function checkImageExists(src: string): Promise<boolean> {
  if (imageCache.has(src)) return Promise.resolve(imageCache.get(src)!);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { imageCache.set(src, true); resolve(true); };
    img.onerror = () => { imageCache.set(src, false); resolve(false); };
    img.src = src;
  });
}

export async function resolveAsset(key: AssetKey): Promise<string | null> {
  const paths = assetPaths[key];
  for (const path of paths) {
    const exists = await checkImageExists(path);
    if (exists) return path;
  }
  return null;
}

export async function resolveAllAssets(): Promise<Record<AssetKey, string | null>> {
  const entries = await Promise.all(
    (Object.keys(assetPaths) as AssetKey[]).map(async (key) => {
      const resolved = await resolveAsset(key);
      return [key, resolved] as const;
    })
  );
  return Object.fromEntries(entries) as Record<AssetKey, string | null>;
}

export { assetPaths };
