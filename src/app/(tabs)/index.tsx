import data from "@/constants/data";
import { formatCurrency, formatSubscriptionDate } from "@/utils/converter";
import BalanceView from "../components/balanceView";
import ProfileView from "../components/profileView";
import SafeArea from "../components/safeArea";
export default function Index() {
  const { currency, amount, nextRenewalDate: date } = data.balance;
  const { name, uri } = data.user;
  return (
    <SafeArea>
      <ProfileView userName={name} profileUri={uri} />
      <BalanceView
        balance={formatCurrency(currency, amount)}
        dt={formatSubscriptionDate(date)}
      />
    </SafeArea>
  );
}
