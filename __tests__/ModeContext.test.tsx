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
  it('restores the saved dark mode after restart', async () => {
    mockGetItem.mockImplementation(async key => {
      if (key === 'settings') {
        return JSON.stringify({
          darkMode: false,
          fontSize: 'MEDIUM',
          language: 'ar',
        });
      }
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

    expect(theme.isDark).toBe(false);
  });

  it('restores saved font size and language', async () => {
    mockGetItem.mockImplementation(async key => {
      if (key === 'settings') {
        return JSON.stringify({
          darkMode: true,
          fontSize: 'LARGE',
          language: 'en',
        });
      }
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

    expect(theme.fontSize).toBe('LARGE');
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
      theme.setFontSize('SMALL');
      theme.setLanguage('en');
    });

    expect(theme.isRTL).toBe(false);
    expect(mockSetItem).toHaveBeenCalledWith(
      'royal_hospital.font_size',
      'SMALL',
    );
    expect(mockSetItem).toHaveBeenCalledWith(
      'royal_hospital.language',
      'en',
    );
  });
});
