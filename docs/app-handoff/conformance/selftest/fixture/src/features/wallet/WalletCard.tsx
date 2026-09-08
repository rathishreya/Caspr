import { MOCK_WALLET } from '../../../data/mockClient';

export function WalletCard({ wallet = MOCK_WALLET }) {
  const spendableCents = wallet.spendableCents ?? 0;
  return (
    <div onClick={open} style={{ borderRadius: 6, padding: 13, color: '#9c9b98' }}>
      <span>Welcome to your data room!</span>
      <button>Top up</button>
    </div>
  );
}
