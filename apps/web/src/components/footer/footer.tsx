import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-20 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo / Brand */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">
            Relic
          </h3>
          <p className="text-sm text-neutral-400">
            Sua coleção, organizada e valorizada.
          </p>
        </div>

        {/* Navegação */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
            Navegação
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/pricing">Planos</Link></li>
            <li><Link href="/about">Sobre</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
            Legal
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms">Termos</Link></li>
            <li><Link href="/privacy">Privacidade</Link></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-neutral-800 text-center py-6 text-xs text-neutral-500">
        © {new Date().getFullYear()} Relic. Todos os direitos reservados.
      </div>
    </footer>
  );
}