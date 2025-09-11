export default function Footer({ transparent }) {
  return (
    <footer
      className={`w-full text-center py-4 text-sm ${
        transparent
          ? "absolute bottom-0 left-0 right-0 text-white"
          : "border-t text-gray-500"
      }`}
    >
      © 2025 Fragnuance
    </footer>
  );
}