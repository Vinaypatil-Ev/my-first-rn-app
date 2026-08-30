import BalanceView from "@/components/home/balanceView";
import HeadViewAll from "@/components/home/headViewAll";
import ProfileView from "@/components/home/profileView";
import UpcomingCard from "@/components/home/upCard";
import SafeArea from "@/components/safeArea";
import data from "@/constants/data";
import { formatCurrency, formatSubscriptionDate } from "@/utils/converter";

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
      <HeadViewAll heading="Upcoming" />
      <UpcomingCard />
    </SafeArea>
  );
}
