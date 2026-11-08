import { encode as encodeBase64 } from 'base-64';
import { Asset, launchImageLibrary } from 'react-native-image-picker';

function toBase64(value: string): string {
  const utf8Value = encodeURIComponent(value).replace(
    /%([0-9A-F]{2})/g,
    (_, hex: string) => String.fromCharCode(parseInt(hex, 16)),
  );
  return encodeBase64(utf8Value);
}

export async function pickImage(): Promise<Asset | null> {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
  });

  if (result.didCancel) return null;
  if (result.errorCode) {
    throw new Error(result.errorMessage || 'تعذر اختيار الصورة.');
  }

  return result.assets?.[0] ?? null;
}

export async function createImageFormData(
  data: object,
  photo: Asset,
): Promise<FormData> {
  if (!photo.uri) throw new Error('الصورة المختارة غير صالحة.');

  const formData = new FormData();
  const json = JSON.stringify(data);
  formData.append('data', {
    uri: `data:application/json;base64,${toBase64(json)}`,
    name: 'data.json',
    type: 'application/json',
  });
  formData.append('photo', {
    uri: photo.uri,
    name: photo.fileName || 'photo.jpg',
    type: photo.type || 'image/jpeg',
  });
  return formData;
}
