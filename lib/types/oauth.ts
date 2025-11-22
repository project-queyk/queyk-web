export interface GoogleIdentityInitializeConfig {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  context: string;
  ux_mode: string;
  auto_select: boolean;
  use_fedcm_for_prompt: boolean;
  cancel_on_tap_outside?: boolean;
  itp_support?: boolean;
}

export interface CredentialResponse {
  credential: string;
}

export interface GoogleNotification {
  isNotDisplayed?: () => boolean;
  getNotDisplayedReason?: () => string;
  isSkippedMoment?: () => boolean;
  getSkippedReason?: () => string;
  isDismissedMoment?: () => boolean;
  getDismissedReason?: () => string;
}

export interface GoogleToken {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

export interface UserWithSub {
  sub?: string;
}
