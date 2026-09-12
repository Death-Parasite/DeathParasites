import { useEffect, useState } from 'react';
import { resolveAllAssets, type AssetKey } from '@/data/assets';

export function useAssets() {
  const [assets, setAssets] = useState<Record<AssetKey, string | null> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    resolveAllAssets().then((resolved) => {
      if (!cancelled) {
        setAssets(resolved);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return { assets, loading };
}
