import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';

// Global text styles
export const textStyles = StyleSheet.create({
  h1: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.h1,
    color: colors.text,
  },
  h2: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.h2,
    color: colors.text,
  },
  h3: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.semiBold,
    lineHeight: typography.lineHeight.h3,
    color: colors.text,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.body,
    color: colors.text,
  },
  bodySmall: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.bodySmall,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.bodySmall,
    color: colors.text,
  },
  caption: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.caption,
    color: colors.textSecondary,
  },
});

// Common container styles
export const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  padded: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
});
