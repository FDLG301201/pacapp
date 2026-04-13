import Link from 'next/link'
import { Instagram, Facebook } from 'lucide-react'
import { Logo } from './logo'

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Tu próxima prenda favorita está más cerca de lo que crees.
            </p>
          </div>

          {/* Sobre PACAPP */}
          <div>
            <h3 className="font-semibold mb-4">Sobre PACAPP</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/sobre-nosotros" className="hover:text-foreground transition-colors">
                  Quiénes somos
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="hover:text-foreground transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/sostenibilidad" className="hover:text-foreground transition-colors">
                  Sostenibilidad
                </Link>
              </li>
              <li>
                <Link href="/prensa" className="hover:text-foreground transition-colors">
                  Prensa
                </Link>
              </li>
            </ul>
          </div>

          {/* Para vendedores */}
          <div>
            <h3 className="font-semibold mb-4">Para vendedores</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/registro?tipo=vendedor" className="hover:text-foreground transition-colors">
                  Registra tu tienda
                </Link>
              </li>
              <li>
                <Link href="/planes" className="hover:text-foreground transition-colors">
                  Planes y precios
                </Link>
              </li>
              <li>
                <Link href="/mayoreo" className="hover:text-foreground transition-colors">
                  Venta al por mayor
                </Link>
              </li>
              <li>
                <Link href="/recursos-vendedores" className="hover:text-foreground transition-colors">
                  Recursos
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="font-semibold mb-4">Ayuda</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/ayuda" className="hover:text-foreground transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-foreground transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="/reportar" className="hover:text-foreground transition-colors">
                  Reportar un problema
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terminos" className="hover:text-foreground transition-colors">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-foreground transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 PACAPP — Hecho en RD 🇩🇴
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://instagram.com/pacapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://facebook.com/pacapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="https://tiktok.com/@pacapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="TikTok"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
