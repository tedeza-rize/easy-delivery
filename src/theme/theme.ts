/* -------------------------------------------------
 * 색상 토큰 (토스 공개 팔레트 기반)
 * ------------------------------------------------- */
export const tossColors = {
  grey50: '#f9fafb',
  grey100: '#f2f4f6',
  grey200: '#e5e8eb',
  grey300: '#d1d6db',
  grey400: '#b0b8c1',
  grey500: '#8b95a1',
  grey600: '#6b7684',
  grey700: '#4e5968',
  grey800: '#333d4b',
  grey900: '#191f28',

  blue500: '#3182f6',
  brandBlue: '#0064FF',
  tossGray: '#202632',
};

/* -------------------------------------------------
 * Theme 타입 정의
 * ------------------------------------------------- */
export interface Theme {
  backgroundPage: string;
  cardBg: string;
  cardBorder: string;
  rowHoverBg: string;
  textPrimary: string;
  textSecondary: string;
  iconColor: string;
  chevronColor: string;
  divider: string;
  switchTrackOff: string;
  switchTrackOn: string;
  switchThumb: string;
}

/* -------------------------------------------------
 * Light / Dark 테마 정의
 * ------------------------------------------------- */
export const lightTheme: Theme = {
  backgroundPage: tossColors.grey100,
  cardBg: '#ffffff',
  cardBorder: tossColors.grey200,
  rowHoverBg: tossColors.grey50,
  textPrimary: tossColors.grey900,
  textSecondary: tossColors.grey500,
  iconColor: tossColors.grey800,
  chevronColor: tossColors.grey400,
  divider: tossColors.grey200,
  switchTrackOff: tossColors.grey300,
  switchTrackOn: tossColors.blue500,
  switchThumb: '#ffffff',
};

export const darkTheme: Theme = {
  backgroundPage: tossColors.tossGray,
  cardBg: '#2a303c',
  cardBorder: tossColors.grey700,
  rowHoverBg: '#2f3542',
  textPrimary: '#ffffff',
  textSecondary: tossColors.grey500,
  iconColor: '#ffffff',
  chevronColor: tossColors.grey600,
  divider: tossColors.grey700,
  switchTrackOff: tossColors.grey700,
  switchTrackOn: tossColors.blue500,
  switchThumb: '#ffffff',
};
