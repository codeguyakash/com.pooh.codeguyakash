import { createNavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  // ProfileScreen: undefined;
  ProfileScreen: { name: string };
  HomeScreen: undefined;
  ChatScreen: undefined;
  SettingsScreen: undefined;
  DashboardScreen: undefined;
  ForgotScreen: undefined;
  AppInfoScreen: undefined;
};

// Properly typed navigation reference
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Safely typed navigation function
export function navigate<Name extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[Name]
    ? [screen: Name] | [screen: Name, params: RootStackParamList[Name]]
    : [screen: Name, params: RootStackParamList[Name]]
): void {
  if (navigationRef.isReady()) {
    // @ts-expect-error – TypeScript inference bug, safe to ignore
    navigationRef.navigate(...args);
  }
}
