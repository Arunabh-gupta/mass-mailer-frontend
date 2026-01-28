import { create } from "zustand";

const useStateStore = create((set) => ({
  passkey: "",
  updatePassKey: (input) => set((state) => ({passkey: input})),
  hostEmail: "",
  updateHostEmail: (input) => set((state) => ({hostEmail: input})),
  subject: "",
  updateSubject: (input) => set((state) => ({subject: input})),
  emailContent: "",
  updateEmailContent: (input) => set((state) => ({emailContent: input})),

}));

export default useStateStore;
