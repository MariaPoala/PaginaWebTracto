import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/51981830008?text=Hola%20Tractro%20SAC,%20quiero%20realizar%20una%20cotización%20"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition duration-300 flex items-center justify-center"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
