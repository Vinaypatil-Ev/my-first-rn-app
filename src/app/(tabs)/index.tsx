import BalanceView from "../components/balanceView";
import ProfileView from "../components/profileView";
import SafeArea from "../components/safeArea";
export default function Index() {
  return (
    <SafeArea>
      <ProfileView />
      <BalanceView />
    </SafeArea>
  );
}
