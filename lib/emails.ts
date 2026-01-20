/**
 * Email Notification Utility
 * 
 * Handles all email notifications via Supabase Edge Functions
 * Per PRD Section 11
 */

import { supabase } from './supabase';

// Email types per PRD
export type EmailType = 
  | 'signup'
  | 'purchase_confirmation'
  | 'instant_win_result'
  | 'competition_win'
  | 'withdrawal_requested'
  | 'withdrawal_approved'
  | 'prize_claim_submitted'
  | 'influencer_application';

// Email data interfaces
export interface SignupEmailData {
  userEmail: string;
  userName: string;
}

export interface PurchaseConfirmationData {
  orderId: string;
  userEmail: string;
  userName: string;
  competitionTitle: string;
  ticketCount: number;
  totalPaid: number;
  ticketNumbers: string[];
}

export interface InstantWinResultData {
  userEmail: string;
  userName: string;
  competitionTitle: string;
  ticketNumber: string;
  isWinner: boolean;
  prizeName?: string;
  prizeValue?: number;
}

export interface CompetitionWinData {
  userEmail: string;
  userName: string;
  competitionTitle: string;
  prizeName: string;
  prizeValue: number;
}

export interface WithdrawalRequestedData {
  userEmail: string;
  userName: string;
  amount: number;
  requestId: string;
}

export interface WithdrawalApprovedData {
  userEmail: string;
  userName: string;
  amount: number;
  requestId: string;
}

export interface PrizeClaimData {
  userEmail: string;
  userName: string;
  prizeName: string;
  claimType: 'physical' | 'cash';
  address?: string;
  cashAmount?: number;
}

export interface InfluencerApplicationData {
  applicantEmail: string;
  applicantName: string;
  platform: string;
  followers: string;
  programInterest: string;
}

// Type guard for email data
type EmailDataMap = {
  signup: SignupEmailData;
  purchase_confirmation: PurchaseConfirmationData;
  instant_win_result: InstantWinResultData;
  competition_win: CompetitionWinData;
  withdrawal_requested: WithdrawalRequestedData;
  withdrawal_approved: WithdrawalApprovedData;
  prize_claim_submitted: PrizeClaimData;
  influencer_application: InfluencerApplicationData;
};

/**
 * Send an email notification
 * 
 * This function is designed to work with Supabase Edge Functions.
 * The actual email sending logic would be implemented in an Edge Function
 * that handles the email provider integration (e.g., Resend, SendGrid, etc.)
 */
export async function sendEmail<T extends EmailType>(
  type: T,
  data: EmailDataMap[T]
): Promise<{ success: boolean; error?: string }> {
  try {
    // In production, this would call a Supabase Edge Function
    // For now, we'll log the email and simulate success
    console.log(`[Email Notification] Type: ${type}`, data);

    // Example of how this would work with a Supabase Edge Function:
    // const { data: result, error } = await supabase.functions.invoke('send-email', {
    //   body: { type, data }
    // });
    // 
    // if (error) throw error;
    // return { success: true };

    // For MVP, we'll store in a notifications table for admin visibility
    const { error } = await supabase
      .from('email_notifications')
      .insert({
        type,
        data: data as unknown as Record<string, unknown>,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

    if (error) {
      // Table might not exist yet - that's okay for MVP
      console.warn('[Email] Could not log notification:', error.message);
    }

    return { success: true };
  } catch (error) {
    console.error(`[Email Error] Failed to send ${type} email:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Trigger email on signup
 */
export async function triggerSignupEmail(userEmail: string, userName: string) {
  return sendEmail('signup', { userEmail, userName });
}

/**
 * Trigger email on purchase confirmation
 */
export async function triggerPurchaseConfirmationEmail(data: PurchaseConfirmationData) {
  return sendEmail('purchase_confirmation', data);
}

/**
 * Trigger email on instant win result
 */
export async function triggerInstantWinResultEmail(data: InstantWinResultData) {
  return sendEmail('instant_win_result', data);
}

/**
 * Trigger email on competition win (scheduled draw)
 */
export async function triggerCompetitionWinEmail(data: CompetitionWinData) {
  return sendEmail('competition_win', data);
}

/**
 * Trigger email on withdrawal request
 */
export async function triggerWithdrawalRequestedEmail(data: WithdrawalRequestedData) {
  return sendEmail('withdrawal_requested', data);
}

/**
 * Trigger email on withdrawal approval
 */
export async function triggerWithdrawalApprovedEmail(data: WithdrawalApprovedData) {
  return sendEmail('withdrawal_approved', data);
}

/**
 * Trigger email on prize claim submission
 */
export async function triggerPrizeClaimEmail(data: PrizeClaimData) {
  return sendEmail('prize_claim_submitted', data);
}

/**
 * Trigger email on influencer application
 */
export async function triggerInfluencerApplicationEmail(data: InfluencerApplicationData) {
  return sendEmail('influencer_application', data);
}

/**
 * Email templates (for reference - actual templates would be in Edge Function)
 */
export const EMAIL_TEMPLATES = {
  signup: {
    subject: 'Welcome to BabyBets!',
    description: 'Sent when a user creates an account',
  },
  purchase_confirmation: {
    subject: 'Your BabyBets Entry Confirmation',
    description: 'Sent after successful ticket purchase',
  },
  instant_win_result: {
    subject: 'Your Instant Win Result',
    description: 'Sent after user reveals an instant win ticket',
  },
  competition_win: {
    subject: 'Congratulations! You Won!',
    description: 'Sent when user wins a scheduled draw',
  },
  withdrawal_requested: {
    subject: 'Withdrawal Request Received',
    description: 'Sent when user requests a withdrawal',
  },
  withdrawal_approved: {
    subject: 'Withdrawal Approved - Payment on the Way',
    description: 'Sent when admin approves a withdrawal',
  },
  prize_claim_submitted: {
    subject: 'Prize Claim Received',
    description: 'Sent when user submits a prize claim',
  },
  influencer_application: {
    subject: 'Partner Application Received',
    description: 'Sent when someone applies to be a partner',
  },
} as const;
