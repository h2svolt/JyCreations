/** Central place for the shop's contact channels — every WhatsApp link on the
 * site (footer icon, checkout order flow) reads from here, so updating the
 * number once fixes it everywhere. */

// TODO: replace with the real WhatsApp number (country code + number, no
// spaces, no leading +), e.g. "923001234567", once it's provided.
export const WHATSAPP_NUMBER = "";

export const CONTACT_EMAIL = "jycreations2@gmail.com";

/** Builds a wa.me link, optionally pre-filling the chat with `message`.
 * Falls back to the bare wa.me landing page while WHATSAPP_NUMBER is unset. */
export function buildWhatsAppLink(message?: string): string {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/";
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
