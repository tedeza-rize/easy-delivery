import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
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
}
