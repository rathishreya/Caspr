// The $NaN bug, preserved. The server sends spendable_cents; this declares
// spendableCents. A cast compiles either way and every field reads undefined.
export interface WalletSnapshot {
  spendableCents: number;
  budgetCents: number;
  plan: string;
  billingAnchor: string;
  legacyTierName: string;
}
