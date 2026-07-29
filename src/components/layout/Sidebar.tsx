// import { useState } from 'react';
import { NAV_ITEMS } from '@/constants/navigation';
import { SidebarBrand } from './SidebarBrand';
import { SidebarItem } from './SidebarItem';
import { useAuth } from '@/contexts/AuthContext'; // 1. Importa o hook de autenticação
import { SignOut } from '@phosphor-icons/react'; // 2. Importa o ícone de sair (ou outro de sua preferência)

interface SidebarProps {
  drawerId: string;
}

export function Sidebar({ drawerId }: SidebarProps) {
  // const [activeId, setActiveId] = useState<string>('home');
  const expanded = true;
  const { logout } = useAuth(); // 3. Pega a função logout do contexto

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

        {/* 4. Botão de Sair adicionado no rodapé da barra lateral */}
        <div className="w-full p-4 border-t border-base-200">
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
