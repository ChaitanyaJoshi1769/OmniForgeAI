export enum AssetModality {
  // Text
  TEXT = 'text',
  DOCUMENT = 'document',
  CODE = 'code',

  // Visual
  IMAGE = 'image',
  VECTOR = 'vector',
  ILLUSTRATION = 'illustration',

  // Motion
  VIDEO = 'video',
  ANIMATION = 'animation',

  // Audio
  AUDIO = 'audio',
  MUSIC = 'music',
  SPEECH = 'speech',
  PODCAST = 'podcast',

  // 3D & Design
  MODEL_3D = '3d_model',
  DESIGN = 'design',
  PROTOTYPE = 'prototype',

  // Interactive
  INTERACTIVE = 'interactive',
  COMPONENT = 'component',
  TEMPLATE = 'template',

  // Data
  DATASET = 'dataset',
  WORKFLOW = 'workflow',

  // Other
  ARCHIVE = 'archive',
  OTHER = 'other',
}

export const AssetModalityMimeTypes: Record<AssetModality, string[]> = {
  // Text
  [AssetModality.TEXT]: ['text/plain', 'application/json'],
  [AssetModality.DOCUMENT]: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  [AssetModality.CODE]: ['text/x-javascript', 'text/x-typescript', 'text/x-python', 'text/x-go'],

  // Visual
  [AssetModality.IMAGE]: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  [AssetModality.VECTOR]: ['image/svg+xml'],
  [AssetModality.ILLUSTRATION]: ['image/jpeg', 'image/png', 'image/webp'],

  // Motion
  [AssetModality.VIDEO]: ['video/mp4', 'video/quicktime', 'video/webm'],
  [AssetModality.ANIMATION]: ['video/mp4', 'application/json'],

  // Audio
  [AssetModality.AUDIO]: ['audio/mpeg', 'audio/wav', 'audio/webm'],
  [AssetModality.MUSIC]: ['audio/mpeg', 'audio/wav', 'audio/flac'],
  [AssetModality.SPEECH]: ['audio/mpeg', 'audio/wav'],
  [AssetModality.PODCAST]: ['audio/mpeg', 'audio/wav'],

  // 3D & Design
  [AssetModality.MODEL_3D]: ['model/gltf-binary', 'model/gltf+json', 'model/obj', 'model/fbx'],
  [AssetModality.DESIGN]: ['application/json', 'image/png'],
  [AssetModality.PROTOTYPE]: ['application/json'],

  // Interactive
  [AssetModality.INTERACTIVE]: ['application/json', 'text/html'],
  [AssetModality.COMPONENT]: ['application/json'],
  [AssetModality.TEMPLATE]: ['application/json'],

  // Data
  [AssetModality.DATASET]: ['application/json', 'text/csv'],
  [AssetModality.WORKFLOW]: ['application/json'],

  // Other
  [AssetModality.ARCHIVE]: ['application/zip', 'application/x-rar-compressed'],
  [AssetModality.OTHER]: ['*/*'],
};

export function getAssetModalityFromMimeType(mimeType: string): AssetModality {
  for (const [modality, types] of Object.entries(AssetModalityMimeTypes)) {
    if (types.includes(mimeType)) {
      return modality as AssetModality;
    }
  }
  return AssetModality.OTHER;
}
