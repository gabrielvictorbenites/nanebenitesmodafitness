import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Olá! Vim pelo site da Nane Benites e gostaria de tirar uma dúvida.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chamar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-elegant transition-transform duration-300 hover:scale-105 hover:bg-brand-dark md:h-16 md:w-16"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 md:h-7 md:w-7" aria-hidden>
        <path d="M20.52 3.48A11.94 11.94 0 0 0 12.02 0C5.4 0 .04 5.36.04 11.97a11.9 11.9 0 0 0 1.6 5.98L0 24l6.2-1.62a11.98 11.98 0 0 0 5.82 1.5h.01c6.6 0 11.97-5.36 11.97-11.98 0-3.2-1.25-6.21-3.48-8.42Zm-8.5 18.42h-.01a9.94 9.94 0 0 1-5.06-1.39l-.36-.21-3.68.96.98-3.59-.24-.37a9.93 9.93 0 0 1-1.53-5.33c0-5.49 4.47-9.96 9.97-9.96 2.66 0 5.16 1.04 7.04 2.92a9.9 9.9 0 0 1 2.92 7.05c0 5.5-4.47 9.97-9.96 9.97Zm5.47-7.47c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.28.3-1.05 1.03-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}