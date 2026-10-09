export interface RSVPFormData {
  fullName: string;
  phone: string;
  attending: 'yes' | 'no';
  guestCount: number;
  guestNames: string[];
  message: string;
}

export interface RSVPResponse {
  success: boolean;
  message: string;
}

export type RSVPFormStatus = 'idle' | 'loading' | 'success' | 'error';

export interface RSVPDocument extends RSVPFormData {
  id: string;
  createdAt?: {
    toDate?: () => Date;
    seconds?: number;
    nanoseconds?: number;
  } | null;
  source?: string;
}
