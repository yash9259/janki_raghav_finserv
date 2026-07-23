import { MessageCircle, Phone } from "lucide-react";

export default function FloatingCTA() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a href="tel:+919328512413" aria-label="Call" className="h-12 w-12 rounded-full bg-brand-dark text-white grid place-items-center shadow-xl hover:scale-110 transition-transform">
        <Phone size={18} />
      </a>
      <a href="https://wa.me/919328512413" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="h-14 w-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-2xl hover:scale-110 transition-transform animate-glow">
        <MessageCircle size={22} />
      </a>
    </div>
  );
}
