jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { getErrorMessage, showErrorToast, showSuccessToast } from '../src/utils/toast';
import { pickImage } from '../src/utils/pickImage';

const mockLaunchImageLibrary = jest.mocked(launchImageLibrary);
const mockToast = jest.mocked(Toast);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('pickImage', () => {
  it('requests one photo and returns the selected asset', async () => {
    const asset = { uri: 'file:///photo.jpg' };
    mockLaunchImageLibrary.mockResolvedValueOnce({ assets: [asset] });

    await expect(pickImage()).resolves.toEqual(asset);
    expect(mockLaunchImageLibrary).toHaveBeenCalledWith({
      mediaType: 'photo',
      selectionLimit: 1,
    });
  });

  it('returns null when the user cancels or no asset is selected', async () => {
    mockLaunchImageLibrary
      .mockResolvedValueOnce({ didCancel: true })
      .mockResolvedValueOnce({});

    await expect(pickImage()).resolves.toBeNull();
    await expect(pickImage()).resolves.toBeNull();
  });

  it('throws the picker error when image selection fails', async () => {
    mockLaunchImageLibrary.mockResolvedValueOnce({
      errorCode: 'permission',
      errorMessage: 'Permission denied',
    });

    await expect(pickImage()).rejects.toThrow('Permission denied');
  });
});

describe('toast helpers', () => {
  it('uses the expected toast variants and supplied localized titles', () => {
    showSuccessToast('Saved', 'Success');
    showErrorToast('Try again', 'Error');

    expect(mockToast.show).toHaveBeenNthCalledWith(1, {
      type: 'success',
      text1: 'Success',
      text2: 'Saved',
    });
    expect(mockToast.show).toHaveBeenNthCalledWith(2, {
      type: 'error',
      text1: 'Error',
      text2: 'Try again',
    });
  });

  it('prefers a server message and falls back to an error message or supplied text', () => {
    expect(
      getErrorMessage({ response: { data: { message: '  Server message  ' } } }, 'Fallback'),
    ).toBe('  Server message  ');
    expect(getErrorMessage(new Error('Network error'), 'Fallback')).toBe(
      'Network error',
    );
    expect(getErrorMessage(null, 'Fallback')).toBe('Fallback');
    expect(
      getErrorMessage({ response: { data: { message: '   ' } } }, 'Fallback'),
    ).toBe('Fallback');
  });
});
