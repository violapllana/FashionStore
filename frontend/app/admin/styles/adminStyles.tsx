import { StyleSheet } from "react-native";

export const adminStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6FF",
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },

  addBtn: {
    backgroundColor: "#6C9EFF",
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },

  addText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  cardColumn: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  name: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
  },

  text: {
    color: "#374151",
  },

  link: {
    marginHorizontal: 6,
    color: "#2563eb",
    fontWeight: "600",
  },

  delete: {
    color: "#ef4444",
    fontWeight: "600",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "90%",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: "#6C9EFF",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },

  cancel: {
    marginTop: 10,
    textAlign: "center",
    color: "#64748b",
  },

  dangerBtn: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  filterBtn: {
    backgroundColor: "#E0E7FF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  filterActive: {
    backgroundColor: "#6366F1",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  roleActive: {
    backgroundColor: "#6366F1",
    padding: 8,
    borderRadius: 8,
  },
  roleBtn: {
    backgroundColor: "#E0E7FF",
    padding: 8,
    borderRadius: 8,
  },
});
