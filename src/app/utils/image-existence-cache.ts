const existingImageUrls = new Set<string>();
const missingImageUrls = new Set<string>();
const pendingImageChecks = new Map<string, Array<(exists: boolean) => void>>();

function flushPending(imageUrl: string, exists: boolean): void {
  const callbacks = pendingImageChecks.get(imageUrl);
  pendingImageChecks.delete(imageUrl);
  if (!callbacks) {
    return;
  }
  callbacks.forEach((callback) => callback(exists));
}

/**
 * Probe an image URL once per session; cache misses to avoid repeated 404 noise.
 */
export function checkImageExists(imageUrl: string, callBack: (exists: boolean) => void): void {
  if (!imageUrl) {
    callBack(false);
    return;
  }

  if (existingImageUrls.has(imageUrl)) {
    callBack(true);
    return;
  }

  if (missingImageUrls.has(imageUrl)) {
    callBack(false);
    return;
  }

  const pending = pendingImageChecks.get(imageUrl);
  if (pending) {
    pending.push(callBack);
    return;
  }

  pendingImageChecks.set(imageUrl, [callBack]);

  const imageData = new Image();
  imageData.onload = function () {
    existingImageUrls.add(imageUrl);
    flushPending(imageUrl, true);
  };
  imageData.onerror = function () {
    missingImageUrls.add(imageUrl);
    flushPending(imageUrl, false);
  };
  imageData.src = imageUrl;
}

/** Clear cached probe results (e.g. after profile image upload/delete). */
export function forgetImageExistence(imageUrl?: string): void {
  if (!imageUrl) {
    existingImageUrls.clear();
    missingImageUrls.clear();
    pendingImageChecks.clear();
    return;
  }

  existingImageUrls.delete(imageUrl);
  missingImageUrls.delete(imageUrl);
  pendingImageChecks.delete(imageUrl);
}
