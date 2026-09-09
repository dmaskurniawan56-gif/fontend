import { Metadata } from "next";
import { MessagesView } from "@/modules/whatsapp/views/MessagesView";

export const metadata: Metadata = {
  title: "WhatsApp Chats & Messages | Wahide",
  description:
    "Monitor real-time WhatsApp message logs, check delivery statuses, and compose instant messages with live preview.",
};

export default function MessagesPage() {
  return <MessagesView />;
}
