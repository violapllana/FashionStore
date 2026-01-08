import { View, StyleSheet, ScrollView } from "react-native";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

interface AdminLayoutProps {
  children: React.ReactNode;
  user?: any;
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  return (
    <View style={styles.container}>
      <AdminSidebar />
      <View style={styles.main}>
        <AdminTopBar name={user?.name} email={user?.email} />
        <ScrollView style={styles.content}>{children}</ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  main: { flex: 1, padding: 20, backgroundColor: "#f5f7fb" }, // <- ngjyrë e hapur
  content: { flex: 1 },
});
