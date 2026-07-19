import { useColorScheme as useRNColorScheme, type ColorSchemeName } from 'react-native';

export function useColorScheme(): 'light' | 'dark' {
  const coreScheme = useRNColorScheme() as ColorSchemeName | 'unspecified' | null;
  return coreScheme === 'unspecified' || coreScheme == null ? 'light' : coreScheme;
}