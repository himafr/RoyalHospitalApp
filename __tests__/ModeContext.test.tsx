import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from '../src/context/ModeContext';

const mockGetItem = jest.mocked(AsyncStorage.getItem);
const mockSetItem = jest.mocked(AsyncStorage.setItem);

beforeEach(() => {
  jest.clearAllMocks();
  mockGetItem.mockResolvedValue(null);
});

describe('ThemeProvider preferences', () => {
  it('restores saved font size and language', async () => {
    mockGetItem.mockImplementation(async key => {
      if (key === 'royal_hospital.font_size') return 'large';
      if (key === 'royal_hospital.language') return 'en';
      return null;
    });

    let theme!: ReturnType<typeof useTheme>;
    function Harness() {
      theme = useTheme();
      return null;
    }

    await act(async () => {
      ReactTestRenderer.create(
        <ThemeProvider>
          <Harness />
        </ThemeProvider>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(theme.fontSize).toBe('large');
    expect(theme.fontScale).toBe(1.2);
    expect(theme.language).toBe('en');
    expect(theme.isRTL).toBe(false);
    expect(theme.t('home')).toBe('Home');
  });

  it('persists font size and language changes', async () => {
    let theme!: ReturnType<typeof useTheme>;
    function Harness() {
      theme = useTheme();
      return null;
    }

    await act(async () => {
      ReactTestRenderer.create(
        <ThemeProvider>
          <Harness />
        </ThemeProvider>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(theme.isRTL).toBe(true);
    await act(async () => {
      theme.setFontSize('small');
      theme.setLanguage('en');
    });

    expect(theme.isRTL).toBe(false);
    expect(mockSetItem).toHaveBeenCalledWith(
      'royal_hospital.font_size',
      'small',
    );
    expect(mockSetItem).toHaveBeenCalledWith(
      'royal_hospital.language',
      'en',
    );
  });
});
