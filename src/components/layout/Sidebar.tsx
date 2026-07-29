import { useEffect, useState } from 'react';
import { NAV_ITEMS } from '@/constants/navigation';
import { SidebarBrand } from './SidebarBrand';
import { SidebarItem } from './SidebarItem';
import { useAuth } from '@/contexts/AuthContext';
import { SignOut, Sun, Moon } from '@phosphor-icons/react';

interface SidebarProps {
  drawerId: string;
}

export function Sidebar({ drawerId }: SidebarProps) {
  const expanded = true;
  const { logout } = useAuth();

  // Estado para controlar e alternar o tema da aplicação
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sinutre.theme') || 'sinutre';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sinutre.theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'sinutre' ? 'dark' : 'sinutre'));
  };

  return (
    <aside className="drawer-side z-50">
      <label
        htmlFor={drawerId}
        aria-label="Fechar menu"
        className="drawer-overlay"
      />
      <div
        className={`bg-base-100 flex flex-col min-h-full border-r border-base-200 shadow-sm transition-all duration-300 justify-between ${
          expanded ? 'w-64 items-start' : 'w-20 items-center'
        }`}
      >
        <div>
          <SidebarBrand expanded={expanded} />
          <ul className="menu w-full grow pt-4 gap-2">
            {NAV_ITEMS.map(item => (
              <SidebarItem
                key={item.id}
                label={item.label}
                Icon={item.Icon}
                to={item.to}
                expanded={expanded}
              />
            ))}
          </ul>
        </div>

        {/* Rodapé da barra lateral contendo a troca de tema e o botão de sair */}
        <div className="w-full p-4 border-t border-base-200 flex flex-col gap-2">
          {/* Botão de alternância de tema */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium hover:bg-base-200 rounded-lg transition-colors"
          >
            {theme === 'sinutre' ? <Moon size={20} /> : <Sun size={20} />}
            {expanded && <span>{theme === 'sinutre' ? 'Modo Escuro' : 'Modo Claro'}</span>}
          </button>

          {/* Botão de Sair */}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <SignOut size={20} />
            {expanded && <span>Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
