const MAX_SOURCE_BYTES = 15 * 1024 * 1024;

function cleanName(value) {
  return String(value || 'image')
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'image';
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This image could not be opened. Try a JPG, PNG, or WebP file.'));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('The browser could not convert this image to WebP.')),
      'image/webp',
      quality,
    );
  });
}

export async function prepareWebp(file, options = {}) {
  if (!file || !file.type?.startsWith('image/')) throw new Error('Choose an image file.');
  if (file.size > MAX_SOURCE_BYTES) throw new Error('Choose an image smaller than 15 MB.');

  const { maxWidth = 1920, maxHeight = 1920, quality = 0.82 } = options;
  const image = await loadImage(file);
  const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: false });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, quality);
  const output = new File([blob], `${cleanName(file.name)}.webp`, { type: 'image/webp' });
  return {
    file: output,
    width,
    height,
    originalBytes: file.size,
    outputBytes: output.size,
  };
}

export function makeStoragePath(folder, fileName) {
  const uniqueId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${cleanName(folder)}/${uniqueId}-${cleanName(fileName)}.webp`;
}

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

