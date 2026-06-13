import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Clock, 
  BookOpen, 
  MapPin, 
  Phone, 
  Info, 
  Coffee, 
  Tv, 
  Wind, 
  ShieldCheck, 
  Copy, 
  Check,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Home,
  Building2,
  Key,
  LogOut,
  Navigation,
  Utensils,
  ShoppingBag,
  Stethoscope,
  Landmark,
  Store,
  ArrowLeft,
  Dumbbell,
  Waves,
  Volume2,
  CigaretteOff,
  Trash2,
  Bath,
  PawPrint,
  Sparkles,
  Search,
  Star,
  Power,
  RotateCcw,
  Car,
  Zap,
  Users,
  Droplets,
  ArrowUpCircle,
  ArrowDownCircle,
  Hexagon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Place {
  id: number;
  name: string;
  category: string;
  address: string;
  icon: any;
  mapsUrl: string;
  wazeUrl: string;
}

type ViewState = 'home' | 'flat' | 'checkin' | 'guia' | 'checkout' | 'emergencia' | 'rules' | 'search';

// --- Components ---

const Logo = ({ size = 60, className = "" }: { size?: number, className?: string }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="#5d4017" strokeWidth="42" strokeLinecap="round">
      <path d="M256 450 V200" />
      <path d="M256 380 L130 270" />
      <path d="M256 380 L382 270" />
    </g>
    <circle cx="256" cy="160" r="95" fill="#f1b418" />
    <circle cx="110" cy="280" r="95" fill="#f1b418" />
    <circle cx="402" cy="280" r="95" fill="#f1b418" />
  </svg>
);

const Bandeirinhas = () => {
  const flags = Array.from({ length: 28 });
  return (
    <div className="absolute top-0 left-0 right-0 overflow-hidden flex justify-between h-8 pointer-events-none z-30 px-2 opacity-95">
      {flags.map((_, i) => {
        const isGreen = i % 2 === 0;
        const colorClass = isGreen ? 'bg-[#009b3a]' : 'bg-[#fedf00]';
        return (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.02, type: "spring", stiffness: 80 }}
            className={`w-2.5 sm:w-3.5 md:w-4.5 h-5 sm:h-6 origin-top ${colorClass} shadow-sm`}
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 75%, 0% 100%)',
              transform: `rotate(${(i % 3 === 0 ? 4 : (i % 3 === 1 ? -4 : 0))}deg)`
            }}
          />
        );
      })}
    </div>
  );
};

const NavButton = ({ title, icon: Icon, onClick, color = "bg-white" }: { title: string, icon: any, onClick: () => void, color?: string }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${color} p-6 rounded-2xl shadow-sm border border-ipe-brown/5 flex flex-col items-center justify-center gap-3 text-ipe-brown transition-all hover:shadow-md w-full`}
  >
    <div className="p-3 bg-ipe-gold/10 rounded-xl">
      <Icon size={32} />
    </div>
    <span className="font-bold text-sm uppercase tracking-wider">{title}</span>
  </motion.button>
);

const PageContainer = ({ children, title, onBack }: { children: React.ReactNode, title: string, onBack: () => void, key?: string }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="w-full"
  >
    <div className="flex items-center gap-4 mb-8">
      <button onClick={onBack} className="p-2 hover:bg-ipe-gold/10 rounded-full text-ipe-brown transition-colors">
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-3xl font-bold text-ipe-brown font-serif">{title}</h1>
    </div>
    {children}
  </motion.div>
);

const Card = ({ children, title, icon: Icon, className = "" }: { children: React.ReactNode, title: string, icon?: any, className?: string }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border border-ipe-brown/5 mb-6 ${className}`}>
    {title && (
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className="p-2 bg-ipe-gold/10 rounded-lg text-ipe-brown">
            <Icon size={24} />
          </div>
        )}
        <h2 className="text-xl font-bold text-ipe-brown">{title}</h2>
      </div>
    )}
    {children}
  </div>
);

const RecommendationItem = ({ name, type, distance, link, icon: Icon = MapPin }: { name: string, type: string, distance?: string, link?: string, icon?: any }) => (
  <a 
    href={link || "#"} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-between p-4 bg-ipe-bg rounded-xl mb-3 hover:bg-ipe-gold/10 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <div className="text-ipe-gold">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-bold text-ipe-brown group-hover:text-ipe-gold transition-colors">{name}</h3>
        <p className="text-xs text-ipe-muted">{type} {distance ? `• ${distance}` : ''}</p>
      </div>
    </div>
    {link && <ExternalLink size={18} className="text-ipe-muted group-hover:text-ipe-gold" />}
  </a>
);

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('home');
  const [activeCategory, setActiveCategory] = useState('TUDO');
  const [searchQuery, setSearchQuery] = useState('');
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string; rotation: number; shape: 'circle' | 'square' | 'soccer' }[]>([]);

  const triggerConfetti = () => {
    const colors = ['#009b3a', '#fedf00', '#002776', '#ffffff'];
    const newConfetti = Array.from({ length: 45 }).map((_, i) => ({
      id: Math.random() + i + Date.now(),
      x: Math.random() * 100, // percentage from left
      y: -15 - (Math.random() * 30), // starting above viewport
      color: colors[i % colors.length],
      rotation: Math.random() * 360,
      shape: (i % 6 === 0) ? 'soccer' : (i % 2 === 0 ? 'circle' : 'square') as any
    }));
    setConfetti(prev => [...prev, ...newConfetti]);
    setTimeout(() => {
      setConfetti(prev => prev.filter(c => !newConfetti.some(nc => nc.id === c.id)));
    }, 4500);
  };

  const amenities = [
    { icon: Wifi, label: 'Wi-Fi / Internet (Wifi)', category: 'COMODIDADES' },
    { icon: ShieldCheck, label: 'Portaria 24h', category: 'COMODIDADES' },
    { icon: Waves, label: 'Piscina Aquecida', category: 'COMODIDADES' },
    { icon: Dumbbell, label: 'Academia 24h', category: 'COMODIDADES' },
    { icon: RotateCcw, label: 'Lavanderia 24h', category: 'COMODIDADES' },
    { icon: Car, label: 'Manobrista', category: 'COMODIDADES' },
    { icon: Users, label: 'Sala Reuniões', category: 'COMODIDADES' },
    { icon: Zap, label: 'Recarga Elétrica', category: 'COMODIDADES' },
    { icon: Store, label: 'Mercadinho 24h', category: 'COMODIDADES' },
  ];

  const emergencyContacts = [
    { name: 'Polícia Militar', phone: '190' },
    { name: 'SAMU', phone: '192' },
    { name: 'Corpo de Bombeiros', phone: '193' },
    { name: 'Polícia Federal', phone: '194' },
    { name: 'Polícia Civil', phone: '197' },
    { name: 'Guarda Municipal', phone: '153' },
    { name: 'Hospital Estadual (HUGO)', phone: '(62) 3201-4455' },
    { name: 'DEAM (Mulher)', phone: '(62) 3201-2801' },
    { name: 'DEAI (Idoso)', phone: '(62) 3201-1501' },
    { name: 'Ministério Público GO', phone: '(62) 3243-8000' },
  ];

  const houseRules = [
    { title: 'Wi-Fi e Internet (Wifi)', content: 'Rede: Cond Crystal Place | Senha: crystal@2022 | Tensão Principal: 220V' },
    { title: 'Cafeteira Três Corações', content: 'Guia passo-a-passo para utilização da cafeteira de cápsulas. Atenção: Voltagem 220V.' },
    { title: 'Voltagem 220V', content: 'Todas as tomadas do flat são 220V. Verifique seus aparelhos antes de ligar para evitar danos.' },
    { title: 'Silêncio e Respeito', content: 'Pedimos que seja silencioso e discreto, especialmente à noite. Não é permitido transitar sem camisa nas áreas comuns.' },
    { title: 'Fumo Proibido', content: 'Não é permitido fumar no interior do apartamento. O local possui sensores de gás e fumaça.' },
    { title: 'Lixeiras', content: 'Ficam no hall dos elevadores à esquerda, em um espaço com porta antes dos elevadores.' },
    { title: 'Toalhas', content: 'Não utilize toalhas para limpeza de maquiagem ou chão.' },
    { title: 'Animais de Estimação', content: 'Pets são bem-vindos! Solicite o formulário online.' },
    { title: 'Saída do Apartamento', content: 'Sempre feche as janelas, desligue o Ar Condicionado e a TV.' }
  ];

  const categories = [
    'TUDO', 'RESTAURANTES', 'PANIFICADORA', 'FARMÁCIAS', 
    'SUPERMERCADOS', 'SHOPPINGS', 'LAZER', 'BANCOS', 
    'FEIRAS', 'EMERGÊNCIA MÉDICA'
  ];

  const places: Place[] = [
    {
      id: 1,
      name: 'Carne de Sol 1008',
      category: 'RESTAURANTES',
      address: 'R. 1008, St. Pedro Ludovico, Goiânia',
      icon: Utensils,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Carne+de+Sol+1008',
      wazeUrl: 'https://waze.com/ul?q=Carne+de+Sol+1008'
    },
    {
      id: 2,
      name: 'Areião Restaurante',
      category: 'RESTAURANTES',
      address: 'Térreo do Condomínio',
      icon: Utensils,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Areião+Restaurante',
      wazeUrl: 'https://waze.com/ul?q=Areião+Restaurante'
    },
    {
      id: 3,
      name: 'Bistrô CHICA DOIDA',
      category: 'RESTAURANTES',
      address: 'Térreo do Condomínio',
      icon: Utensils,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bistrô+CHICA+DOIDA',
      wazeUrl: 'https://waze.com/ul?q=Bistrô+CHICA+DOIDA'
    },
    {
      id: 4,
      name: 'Park Pães',
      category: 'PANIFICADORA',
      address: 'St. Pedro Ludovico, Goiânia',
      icon: Coffee,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Park+Pães',
      wazeUrl: 'https://waze.com/ul?q=Park+Pães'
    },
    {
      id: 5,
      name: 'Drogasil',
      category: 'FARMÁCIAS',
      address: 'St. Pedro Ludovico, Goiânia',
      icon: ShieldCheck,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Drogasil+Pedro+Ludovico',
      wazeUrl: 'https://waze.com/ul?q=Drogasil+Pedro+Ludovico'
    },
    {
      id: 6,
      name: 'HUGO - Hospital Estadual',
      category: 'EMERGÊNCIA MÉDICA',
      address: 'St. Pedro Ludovico, Goiânia',
      icon: Phone,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=HUGO+Hospital+Goiânia',
      wazeUrl: 'https://waze.com/ul?q=HUGO+Hospital+Goiânia'
    },
    {
      id: 7,
      name: 'Costa Atacadão',
      category: 'SUPERMERCADOS',
      address: 'St. Pedro Ludovico, Goiânia',
      icon: Search,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Costa+Atacadão+Goiânia',
      wazeUrl: 'https://waze.com/ul?q=Costa+Atacadão+Goiânia'
    },
    {
      id: 8,
      name: 'SmartStore',
      category: 'SUPERMERCADOS',
      address: 'Mezanino do Condomínio',
      icon: Search,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SmartStore+Condomínio',
      wazeUrl: 'https://waze.com/ul?q=SmartStore+Condomínio'
    },
    {
      id: 9,
      name: 'Goiânia Shopping',
      category: 'SHOPPINGS',
      address: 'Av. T-10, St. Bueno, Goiânia',
      icon: ShoppingBag,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Goiânia+Shopping',
      wazeUrl: 'https://waze.com/ul?q=Goiânia+Shopping'
    },
    {
      id: 10,
      name: 'Shopping Bougainville',
      category: 'SHOPPINGS',
      address: 'R. 9, St. Marista, Goiânia',
      icon: ShoppingBag,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Shopping+Bougainville',
      wazeUrl: 'https://waze.com/ul?q=Shopping+Bougainville'
    },
    {
      id: 11,
      name: 'Flamboyant Shopping',
      category: 'SHOPPINGS',
      address: 'Av. Dep. Jamel Cecílio, Goiânia',
      icon: ShoppingBag,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Flamboyant+Shopping',
      wazeUrl: 'https://waze.com/ul?q=Flamboyant+Shopping'
    },
    {
      id: 12,
      name: 'Parque Flamboyant',
      category: 'LAZER',
      address: 'Jardim Goiás, Goiânia',
      icon: Landmark,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Parque+Flamboyant',
      wazeUrl: 'https://waze.com/ul?q=Parque+Flamboyant'
    },
    {
      id: 13,
      name: 'Parque Vaca Brava',
      category: 'LAZER',
      address: 'St. Bueno, Goiânia',
      icon: Landmark,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Parque+Vaca+Brava',
      wazeUrl: 'https://waze.com/ul?q=Parque+Vaca+Brava'
    },
    {
      id: 14,
      name: 'Estádio Serra Dourada',
      category: 'LAZER',
      address: 'Jardim Goiás, Goiânia',
      icon: Landmark,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Estádio+Serra+Dourada',
      wazeUrl: 'https://waze.com/ul?q=Estádio+Serra+Dourada'
    },
    {
      id: 15,
      name: 'Centro Cultural Oscar Niemeyer',
      category: 'LAZER',
      address: 'Av. Dep. Jamel Cecílio, Goiânia',
      icon: Landmark,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Centro+Cultural+Oscar+Niemeyer',
      wazeUrl: 'https://waze.com/ul?q=Centro+Cultural+Oscar+Niemeyer'
    },
    {
      id: 16,
      name: 'Banco Itaú - Agência...',
      category: 'BANCOS',
      address: 'Goiânia, GO',
      icon: Building2,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Banco+Itaú+Goiânia',
      wazeUrl: 'https://waze.com/ul?q=Banco+Itaú+Goiânia'
    },
    {
      id: 17,
      name: 'Bradesco',
      category: 'BANCOS',
      address: 'Goiânia, GO',
      icon: Building2,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bradesco+Goiânia',
      wazeUrl: 'https://waze.com/ul?q=Bradesco+Goiânia'
    },
    {
      id: 18,
      name: 'Caixa',
      category: 'BANCOS',
      address: 'Goiânia, GO',
      icon: Building2,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Caixa+Goiânia',
      wazeUrl: 'https://waze.com/ul?q=Caixa+Goiânia'
    },
    {
      id: 19,
      name: 'Banco do Brasil - Ag...',
      category: 'BANCOS',
      address: 'Goiânia, GO',
      icon: Building2,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Banco+do+Brasil+Goiânia',
      wazeUrl: 'https://waze.com/ul?q=Banco+do+Brasil+Goiânia'
    },
    {
      id: 20,
      name: 'Feira da Lua',
      category: 'FEIRAS',
      address: 'Praça Tamandaré, Goiânia (Sábado)',
      icon: Store,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Feira+da+Lua+Goiânia',
      wazeUrl: 'https://waze.com/ul?q=Feira+da+Lua+Goiânia'
    },
    {
      id: 21,
      name: 'Feira do Sol',
      category: 'FEIRAS',
      address: 'Praça do Sol, Goiânia (Domingo)',
      icon: Store,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Feira+do+Sol+Goiânia',
      wazeUrl: 'https://waze.com/ul?q=Feira+do+Sol+Goiânia'
    },
    {
      id: 22,
      name: 'Região da 44',
      category: 'FEIRAS',
      address: 'Setor Norte Ferroviário, Goiânia',
      icon: Store,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Região+da+44+Goiânia',
      wazeUrl: 'https://waze.com/ul?q=Região+da+44+Goiânia'
    }
  ];

  const filteredPlaces = activeCategory === 'TUDO' 
    ? places 
    : places.filter(p => p.category === activeCategory);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => triggerConfetti(), 350);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-ipe-brown z-50">
        <motion.div 
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.9, 1, 0.9] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl"
        >
          <Logo size={50} />
        </motion.div>
        <h1 className="text-ipe-gold font-serif text-2xl font-bold tracking-[4px]">FLAT CRYSTAL 1701</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ipe-bg pb-24 relative overflow-x-hidden">
      <Bandeirinhas />

      {/* Confetti Container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            initial={{ y: `${c.y}vh`, x: `${c.x}vw`, rotate: c.rotation, opacity: 1 }}
            animate={{ 
              y: '105vh', 
              x: `${c.x + (Math.random() * 20 - 10)}vw`,
              rotate: c.rotation + 720,
              opacity: [1, 1, 0.8, 0]
            }}
            transition={{ duration: 2.5 + Math.random() * 1.5, ease: "linear" }}
            className="absolute"
            style={{ transformOrigin: 'center' }}
          >
            {c.shape === 'soccer' ? (
              <span className="text-lg">⚽</span>
            ) : (
              <div 
                className={c.shape === 'circle' ? 'rounded-full text-xs shadow-sm shadow-black/5' : 'text-xs shadow-sm shadow-black/5'}
                style={{ 
                  width: `${8 + Math.random() * 8}px`, 
                  height: `${8 + Math.random() * 8}px`, 
                  backgroundColor: c.color 
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center relative z-10">
        <button 
          onClick={() => { setView('home'); setSearchQuery(''); }} 
          className="cursor-pointer group inline-flex flex-col items-center focus:outline-none bg-transparent border-0"
        >
          <Logo size={80} className="mx-auto mb-6 bg-white p-3 rounded-full shadow-lg transition-transform group-hover:scale-105" />
          <h1 className="text-4xl font-bold text-ipe-brown font-serif group-hover:text-ipe-gold transition-colors">Flat Crystal 1701</h1>
          <p className="text-ipe-muted mt-2 italic group-hover:opacity-85 transition-opacity">Guia do Hóspede</p>
        </button>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mt-8 px-4 relative">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ipe-muted group-focus-within:text-ipe-gold transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar guia, regras, locais..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setView('search');
                } else if (view === 'search') {
                  setView('home');
                }
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setView('search');
              }}
              className="w-full pl-12 pr-10 py-4 bg-white rounded-2xl shadow-sm border border-ipe-brown/5 focus:outline-none focus:ring-2 focus:ring-ipe-gold/20 focus:border-ipe-gold transition-all text-ipe-brown placeholder:text-ipe-muted/60"
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  if (view === 'search') setView('home');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ipe-muted hover:text-ipe-brown"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* Sticky Mini Guide Navigation Bar - Smaller and Fixed on All Pages */}
        <div className="sticky top-0 bg-ipe-bg/95 backdrop-blur-md z-30 py-4 -mx-6 px-6 border-b border-ipe-brown/5 mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 md:grid md:grid-cols-6 md:pb-0 scroll-smooth">
              {[
                { id: 'flat' as ViewState, title: 'O Flat', sub: 'Wi-Fi e Infos', icon: Building2 },
                { id: 'checkin' as ViewState, title: 'Check-in', sub: 'Como Entrar', icon: Key },
                { id: 'guia' as ViewState, title: 'Guia Local', sub: 'Lugares', icon: Navigation },
                { id: 'checkout' as ViewState, title: 'Check-out', sub: 'Instruções', icon: LogOut },
                { id: 'rules' as ViewState, title: 'Regras', sub: 'Normas da Casa', icon: BookOpen },
                { id: 'emergencia' as ViewState, title: 'Emergência', sub: 'Contatos', icon: AlertCircle, isEmergency: true }
              ].map((item) => {
                const active = view === item.id;
                const isEmergency = item.isEmergency;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setView(item.id);
                      setSearchQuery('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 shrink-0 text-left cursor-pointer w-[140px] sm:w-auto ${
                      active 
                        ? 'bg-white border-ipe-gold shadow-md shadow-ipe-gold/5 z-10' 
                        : isEmergency 
                          ? 'bg-red-50/70 border-red-100 text-red-700 hover:bg-red-50' 
                          : 'bg-white/70 border-ipe-brown/5 hover:border-ipe-gold/20 hover:bg-white text-ipe-muted'
                    }`}
                  >
                    {/* Active Accent Decorator with World Cup Colors (Green & Gold) */}
                    {active && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#009b3a] to-[#fedf00] rounded-t-xl" />
                    )}
                    
                    <div className={`p-2 rounded-lg transition-colors shrink-0 ${
                      active 
                        ? 'bg-[#009b3a]/10 text-[#009b3a]' 
                        : isEmergency 
                          ? 'bg-red-100/60 text-red-600' 
                          : 'bg-ipe-gold/10 text-ipe-gold'
                    }`}>
                      <item.icon size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className={`text-[11px] font-bold uppercase tracking-wider truncate leading-tight ${
                        active ? 'text-ipe-brown' : isEmergency ? 'text-red-700' : 'text-ipe-brown/80'
                      }`}>
                        {item.title}
                      </h4>
                      <p className="text-[9px] text-ipe-muted leading-none font-medium mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.sub}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Card Copa do Mundo */}
              <div className="relative bg-white rounded-3xl p-6 shadow-sm border border-ipe-brown/5 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Visual background gradient and accents */}
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-yellow-100/20 to-transparent pointer-events-none" />
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#009b3a] via-[#fedf00] to-[#002776] rounded-l-full" />
                
                <div className="space-y-2 max-w-xl pl-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-[10px] font-black uppercase tracking-wider">
                    <span className="inline-block animate-bounce">⚽</span> Rumo ao Hexa!
                  </div>
                  <h3 className="text-xl font-bold font-serif text-ipe-brown leading-tight">
                    Flat Crystal 1701 No Clima da Copa! 🇧🇷
                  </h3>
                  <p className="text-xs text-ipe-muted leading-relaxed font-medium font-sans">
                    Aproveite cada lance da Copa do Mundo! Preparamos o flat com canais esportivos configurados na nossa <span className="font-bold text-green-700">Smart TV 65"</span> e ar condicionado silencioso para você vibrar com todo o conforto.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0 w-full md:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={triggerConfetti}
                    className="w-full md:w-auto px-5 py-3.5 bg-gradient-to-r from-[#009b3a] to-[#fedf00] text-green-950 hover:from-[#009b3a]/90 hover:to-[#fedf00]/95 font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Comemorar Gol!</span>
                    <span className="text-base animate-pulse">⚽🎉</span>
                  </motion.button>
                </div>
              </div>

              {/* Quick Info Dashboard - Highly Useful */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Wi-Fi Copy Box */}
                <div className="bg-white rounded-2xl p-5 border border-ipe-brown/5 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-ipe-gold/10 rounded-xl text-ipe-gold">
                      <Wifi size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ipe-muted uppercase tracking-wider">Wi-Fi do Apartamento</h4>
                      <p className="text-sm font-bold text-ipe-brown">Cond Crystal Place</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('Cond Crystal Place');
                        alert('Nome da rede copiado!');
                      }}
                      className="flex items-center justify-between px-3 py-2 bg-ipe-bg rounded-xl text-xs hover:bg-ipe-gold/10 text-ipe-brown font-medium border border-ipe-brown/5 group transition-colors"
                    >
                      <span className="opacity-70">Copiar Rede</span>
                      <Copy size={14} className="opacity-60 group-hover:opacity-100" />
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('crystal@2022');
                        alert('Senha copiada!');
                      }}
                      className="flex items-center justify-between px-3 py-2 bg-ipe-bg rounded-xl text-xs hover:bg-ipe-gold/10 text-ipe-brown font-medium border border-ipe-brown/5 group transition-colors"
                    >
                      <div className="text-left">
                        <span className="opacity-70 block text-[9px] uppercase tracking-wider leading-none">Senha</span>
                        <span className="font-bold">crystal@2022</span>
                      </div>
                      <Copy size={14} className="opacity-60 group-hover:opacity-100" />
                    </button>
                  </div>
                </div>

                {/* Lock Password Helper */}
                <div className="bg-white rounded-2xl p-5 border border-ipe-brown/5 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-ipe-gold/10 rounded-xl text-ipe-gold">
                      <Key size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ipe-muted uppercase tracking-wider">Porta de Entrada</h4>
                      <p className="text-sm font-bold text-ipe-brown">Sua Senha do Flat</p>
                    </div>
                  </div>
                  <div className="bg-ipe-bg p-3.5 rounded-xl border border-ipe-brown/5">
                    <p className="text-[10px] font-bold text-ipe-muted uppercase tracking-widest leading-none mb-1">Como usar</p>
                    <p className="text-[11px] text-ipe-brown leading-relaxed font-medium">
                      Digite <span className="font-bold text-ipe-gold">*DDD + celular#</span>
                    </p>
                    <p className="text-[9px] text-ipe-muted italic mt-1 font-medium">Ex: *6299151# • Ao sair puxe o trinco para cima para travar.</p>
                  </div>
                </div>

                {/* Checkout Reminders */}
                <div className="bg-white rounded-2xl p-5 border border-ipe-brown/5 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-ipe-gold/10 rounded-xl text-ipe-gold">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ipe-muted uppercase tracking-wider">Horários do Flat</h4>
                      <p className="text-sm font-bold text-ipe-brown">Check-in e Check-out</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-ipe-brown/5">
                      <span className="text-ipe-muted font-medium">Entrada (Check-in)</span>
                      <span className="font-bold text-ipe-brown">A partir das 14h</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-ipe-muted font-medium">Saída (Check-out)</span>
                      <span className="font-bold text-red-600">Até as 11h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Help Card */}
              <div className="p-6 bg-ipe-gold/5 border border-dashed border-ipe-gold/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h4 className="font-serif font-bold text-ipe-brown">Precisa de ajuda ou dicas extras?</h4>
                  <p className="text-xs text-ipe-muted mt-1">Navegue pelas abas acima ou envie uma mensagem diretamente para Wellington no WhatsApp.</p>
                </div>
                <a 
                  href="https://wa.me/5562991514568" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  <MessageCircle size={14} />
                  Falar no WhatsApp
                </a>
              </div>
            </motion.div>
          )}

          {view === 'flat' && (
            <PageContainer key="flat" title="O Flat" onBack={() => setView('home')}>
              {/* Wi-Fi Section - Prominent */}
              <div className="bg-ipe-brown text-white rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Wifi size={24} className="text-ipe-gold" />
                    </div>
                    <h2 className="text-xl font-bold font-serif">Conexão Wi-Fi</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 flex justify-between items-center group">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Rede</p>
                        <p className="font-bold">Cond Crystal Place</p>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText('Cond Crystal Place');
                          alert('Rede copiada!');
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Copy size={16} className="opacity-40" />
                      </button>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 flex justify-between items-center group">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Senha</p>
                        <p className="font-bold">crystal@2022</p>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText('crystal@2022');
                          alert('Senha copiada!');
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Copy size={16} className="opacity-40" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                    <Zap size={16} className="text-ipe-gold" />
                    <div>
                      <p className="text-[9px] uppercase tracking-wider opacity-60">Voltagem / Tensão</p>
                      <p className="text-sm font-bold">220V (Atenção ao ligar aparelhos)</p>
                    </div>
                  </div>
                </div>
                <Wifi className="absolute -right-10 -bottom-10 text-white/5 w-48 h-48 rotate-12" />
              </div>

              {/* Features Grid - Visual */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6 px-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-ipe-gold" />
                    <h3 className="text-xs font-bold text-ipe-muted uppercase tracking-[3px]">Comodidades do Condomínio</h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                    <Clock size={12} strokeWidth={2.5} />
                    <span className="text-[9px] font-bold uppercase tracking-tight">Academia, Lavanderia e Mercadinho 24h</span>
                  </div>
                </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-6">
                    {amenities.map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex flex-col items-center text-center gap-3 group"
                      >
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-ipe-gold border border-ipe-gold/5 shadow-sm group-hover:bg-ipe-gold group-hover:text-white transition-all duration-300">
                          <item.icon size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-ipe-brown leading-tight uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
              </div>

              <div className="space-y-16">
                {/* Rules Section */}
                <div className="px-2">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-ipe-brown text-white rounded-xl flex items-center justify-center">
                      <ShieldCheck size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-ipe-brown font-serif">Regras de Convivência</h2>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                    {[
                      "Voltagem do apartamento: 220V.",
                      "Não deixar lixo nos corredores.",
                      "Proibido pendurar roupas nas janelas.",
                      "Não deixar roupas ou objetos nas sacadas.",
                      "Visitas devem se identificar na recepção.",
                      "Silêncio obrigatório das 22h às 08h.",
                      "Somente manobristas movem os veículos.",
                      "Carrinhos de compras apenas no elevador de serviço."
                    ].map((rule, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <div className="w-5 h-5 rounded-full bg-ipe-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} className="text-ipe-gold" />
                        </div>
                        <span className="text-ipe-text leading-relaxed text-sm">
                          {rule.includes('220V') ? <span className="font-bold text-red-600">{rule}</span> : rule}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Amenities Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 px-2">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Dumbbell size={20} className="text-ipe-gold" />
                      <h3 className="font-bold text-ipe-brown uppercase tracking-widest text-xs">Academia</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Funcionamento 24 Horas.",
                        "Desligue luzes e ar ao sair.",
                        "Guarde os pesos no lugar.",
                        "Proibido crianças desacompanhadas."
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-ipe-text">
                          <div className="w-1.5 h-1.5 rounded-full bg-ipe-gold shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Waves size={20} className="text-ipe-gold" />
                      <h3 className="font-bold text-ipe-brown uppercase tracking-widest text-xs">Piscina & Sauna</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="py-3 border-b border-ipe-gold/10">
                        <p className="text-[10px] text-ipe-muted font-bold uppercase mb-1">Horário Piscina</p>
                        <p className="text-sm text-ipe-brown font-bold tracking-tight">06h às 23h (Diariamente)</p>
                      </div>
                      <ul className="space-y-2">
                        {[
                          "Proibido garrafas de vidro.",
                          "Não circular em trajes de banho."
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-ipe-text">
                            <div className="w-1.5 h-1.5 rounded-full bg-ipe-gold shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Coffee Guide (Fluid Sequence) */}
                <div className="pt-12 border-t border-ipe-gold/10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-ipe-gold/10 text-ipe-gold rounded-xl flex items-center justify-center">
                        <Coffee size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-ipe-brown font-serif tracking-tight">Modo de Preparo</h3>
                        <p className="text-[10px] text-ipe-muted font-bold mt-1 uppercase tracking-widest opacity-60">Cafeteira Três Corações</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 flex items-center gap-2 self-start md:self-center">
                      <Zap size={10} className="fill-current" />
                      <span className="text-[9px] font-bold uppercase tracking-tight">Tomada 220V</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { step: 1, title: 'ENERGIA', text: 'Conecte na tomada 220V.', icon: Zap, color: '#EAB308' },
                      { step: 2, title: 'ÁGUAS', text: 'Água filtrada no reservatório.', icon: Droplets, color: '#3B82F6' },
                      { step: 3, title: 'ABRIR', text: 'Levante a alavanca superior.', icon: ArrowUpCircle, color: '#64748B' },
                      { step: 4, title: 'CÁPSULA', text: 'Insira a cápsula no slot.', icon: Hexagon, color: '#92400E' },
                      { step: 5, title: 'FECHAR', text: 'Abaixe para perfurar.', icon: ArrowDownCircle, color: '#334155' },
                      { step: 6, title: 'PREPARO', text: 'Botão da cor da cápsula.', icon: Coffee, color: '#059669' }
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-5 p-5 bg-white rounded-[24px] border border-ipe-brown/5 shadow-sm hover:shadow-md transition-all group">
                        <div 
                          className="w-10 h-10 rounded-[14px] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-black/5"
                          style={{ backgroundColor: s.color }}
                        >
                          {s.step}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <s.icon size={12} style={{ color: s.color }} />
                            <h4 className="text-[11px] font-black text-ipe-brown tracking-widest leading-none">
                              {s.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-ipe-muted leading-tight font-medium opacity-80">
                            {s.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PageContainer>
          )}

          {view === 'checkin' && (
            <PageContainer key="checkin" title="Check-in" onBack={() => setView('home')}>
              {/* Fechadura Inteligente */}
              <div className="bg-ipe-brown rounded-2xl p-6 mb-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Key size={24} className="text-ipe-gold" />
                  </div>
                  <h2 className="text-xl font-bold font-serif">Fechadura Inteligente</h2>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-4 text-center">
                  <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Estrutura da Senha (7 dígitos)</p>
                  <div className="text-2xl font-bold tracking-[0.2em] text-ipe-gold mb-2">
                    *DDD PREFIXO#
                  </div>
                  <p className="text-[10px] opacity-50 italic">Exemplo para (62) 99151...: *6299151#</p>
                </div>

                <div className="flex gap-3 p-4 bg-white/10 rounded-xl border border-white/10">
                  <Info size={20} className="text-ipe-gold shrink-0" />
                  <p className="text-sm leading-relaxed">
                    Ao fechar a porta, <span className="font-bold">sempre trave a fechadura movendo a maçaneta para cima</span>, tanto ao entrar quanto ao sair.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Na recepção */}
                <Card title="Na recepção">
                  <p className="text-sm text-ipe-text leading-relaxed">
                    Identifique-se e receba o cartão para ativar a energia do apartamento. Todos os hóspedes devem apresentar documentos de identificação.
                  </p>
                </Card>

                {/* Como chegar */}
                <a 
                  href="https://maps.google.com/?q=Crystal+Place" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl p-6 shadow-sm border border-ipe-brown/5 flex items-center justify-between group hover:bg-ipe-gold/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-ipe-brown">Como chegar</h3>
                      <p className="text-xs text-ipe-muted">Crystal Place</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-ipe-muted group-hover:text-ipe-gold transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <div className="bg-ipe-gold/10 p-4 rounded-2xl border border-ipe-gold/20 flex gap-3">
                <Info className="text-ipe-gold shrink-0" />
                <p className="text-sm text-ipe-brown italic">O check-in inicia às 14:00. Caso precise entrar antes, consulte disponibilidade.</p>
              </div>
            </PageContainer>
          )}

          {view === 'guia' && (
            <PageContainer key="guia" title="Guia Local" onBack={() => setView('home')}>
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${
                      activeCategory === cat 
                        ? 'bg-ipe-brown text-white border-ipe-brown' 
                        : 'bg-white text-ipe-muted border-ipe-brown/10 hover:border-ipe-gold'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Places Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlaces.map(place => (
                  <div key={place.id} className="bg-white rounded-2xl p-4 shadow-sm border border-ipe-brown/5 flex items-center justify-between group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-3 bg-ipe-gold/5 text-ipe-gold rounded-xl shrink-0">
                        <place.icon size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-ipe-brown text-sm truncate">{place.name}</h3>
                        <p className="text-[10px] text-ipe-muted uppercase font-bold tracking-wider">{place.category}</p>
                        <p className="text-[10px] text-ipe-muted truncate">{place.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 shrink-0 ml-2">
                      <a 
                        href={place.mapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-ipe-brown text-white rounded-lg hover:bg-ipe-gold transition-colors"
                        title="Google Maps"
                      >
                        <Navigation size={16} />
                      </a>
                      <a 
                        href={place.wazeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-[#00B0FF] text-white rounded-lg text-[8px] font-bold hover:bg-[#0091EA] transition-colors text-center"
                      >
                        WAZE
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dica do Anfitrião */}
              <div className="mt-12 p-8 bg-white rounded-2xl border border-dashed border-ipe-brown/20 text-center">
                <p className="text-[10px] font-bold text-ipe-muted uppercase tracking-widest mb-2 italic">Dica do Anfitrião:</p>
                <p className="text-lg font-serif text-ipe-brown italic">
                  "O Bistrô Chica Doida tem a melhor picanha da região!"
                </p>
              </div>
            </PageContainer>
          )}

          {view === 'checkout' && (
            <PageContainer key="checkout" title="Check-out" onBack={() => setView('home')}>
              {/* Horário Limite */}
              <div className="bg-ipe-gold/20 border border-ipe-gold/30 rounded-2xl p-8 text-center mb-8">
                <p className="text-[10px] font-bold text-ipe-gold uppercase tracking-[3px] mb-2">Horário Limite</p>
                <h2 className="text-4xl font-serif font-bold text-ipe-brown">11h da manhã</h2>
              </div>

              {/* Checklist */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Check size={20} className="text-ipe-brown" />
                  <h3 className="font-serif font-bold text-ipe-brown">Checklist de Saída</h3>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-ipe-brown/5 overflow-hidden">
                  <div className="flex items-center gap-4 p-5 border-b border-ipe-brown/5">
                    <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                      <CigaretteOff size={18} />
                    </div>
                    <p className="text-sm font-medium text-ipe-brown">Desligar Ar Condicionado e TV</p>
                  </div>
                  
                  <div className="flex items-center gap-4 p-5 border-b border-ipe-brown/5">
                    <div className="p-2 bg-green-50 text-green-500 rounded-lg">
                      <Trash2 size={18} />
                    </div>
                    <p className="text-sm font-medium text-ipe-brown">Retirar o lixo e descartar no hall</p>
                  </div>
                  
                  <div className="flex items-center gap-4 p-5 border-b border-ipe-brown/5">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                      <LogOut size={18} />
                    </div>
                    <p className="text-sm font-medium text-ipe-brown">Deixar o cartão na recepção (térreo)</p>
                  </div>
                  
                  <div className="flex items-center gap-4 p-5">
                    <div className="p-2 bg-yellow-50 text-yellow-500 rounded-lg">
                      <Star size={18} />
                    </div>
                    <p className="text-sm font-medium text-ipe-brown">Verificar se esqueceu objetos (ex: carregadores)</p>
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-ipe-brown/5 text-center">
                <h3 className="text-xl font-bold text-ipe-brown mb-2">Sua opinião é importante!</h3>
                <p className="text-xs text-ipe-muted mb-8">Agradecemos sua atenção e feedback para melhorarmos sempre.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <a 
                    href="https://wa.me/5562991514568?text=Olá! Gostaria de deixar um feedback sobre minha estadia no Flat 1701."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                  >
                    <MessageCircle size={20} />
                    Enviar Observações via WhatsApp
                  </a>
                  
                  <div className="bg-ipe-bg rounded-xl p-4 flex flex-col items-center justify-center border border-ipe-brown/5">
                    <p className="text-[10px] font-bold text-ipe-muted uppercase tracking-wider mb-1">Contato do Anfitrião</p>
                    <p className="text-lg font-bold text-ipe-brown">(62) 99151-4568</p>
                  </div>
                </div>
              </div>
            </PageContainer>
          )}

          {view === 'emergencia' && (
            <PageContainer key="emergencia" title="Emergência" onBack={() => setView('home')}>
              <div className="space-y-6">
                {/* Top Alert */}
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3 items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <AlertCircle className="text-red-500" size={20} />
                  </div>
                  <p className="text-xs text-red-800 font-medium leading-relaxed">
                    Em caso de emergência, entre em contato imediatamente com os serviços competentes.
                  </p>
                </div>

                {/* Contacts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {emergencyContacts.map((contact, idx) => (
                    <a 
                      key={idx}
                      href={`tel:${contact.phone.replace(/\D/g, '')}`}
                      className="bg-white p-4 rounded-2xl border border-ipe-brown/5 shadow-sm flex items-center justify-between group hover:border-red-200 transition-all"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-ipe-brown mb-1">{contact.name}</h4>
                        <p className="text-sm font-bold text-red-600">{contact.phone}</p>
                      </div>
                      <div className="p-2 bg-red-50 text-red-600 rounded-full group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Phone size={16} />
                      </div>
                    </a>
                  ))}
                </div>

                {/* Bottom Info */}
                <div className="bg-ipe-bg p-4 rounded-2xl flex gap-3 items-center border border-ipe-brown/5">
                  <Info className="text-ipe-muted shrink-0" size={18} />
                  <p className="text-[10px] text-ipe-muted italic">
                    Estes números estão disponíveis 24h por dia para auxílio à população.
                  </p>
                </div>

                {/* Host Contact (Kept for utility) */}
                <Card title="Contato do Anfitrião" icon={Phone}>
                  <p className="text-sm text-ipe-text mb-4">Para questões não emergenciais relacionadas ao flat:</p>
                  <a 
                    href="https://wa.me/5562991514568" 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle size={20} />
                    WhatsApp Suporte
                  </a>
                </Card>
              </div>
            </PageContainer>
          )}

          {view === 'search' && (
            <PageContainer key="search" title="Resultados da Busca" onBack={() => {
              setView('home');
              setSearchQuery('');
            }}>
              <div className="space-y-8">
                {/* Search Results Summary */}
                <div className="px-2">
                  <p className="text-sm text-ipe-muted">
                    Mostrando resultados para: <span className="font-bold text-ipe-brown">"{searchQuery}"</span>
                  </p>
                </div>

                {/* Categories of Results */}
                {[
                  {
                    title: 'Guia Local',
                    icon: Navigation,
                    items: places.filter(p => 
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.address.toLowerCase().includes(searchQuery.toLowerCase())
                    ),
                    render: (place: Place) => (
                      <div key={place.id} className="bg-white rounded-2xl p-4 shadow-sm border border-ipe-brown/5 flex items-center justify-between group mb-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-3 bg-ipe-gold/5 text-ipe-gold rounded-xl shrink-0">
                            <place.icon size={20} />
                          </div>
                          <div className="overflow-hidden">
                            <h3 className="font-bold text-ipe-brown text-sm truncate">{place.name}</h3>
                            <p className="text-[10px] text-ipe-muted uppercase font-bold tracking-wider">{place.category}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setActiveCategory(place.category);
                            setView('guia');
                          }}
                          className="p-2 text-ipe-gold hover:bg-ipe-gold/10 rounded-lg transition-colors"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )
                  },
                  {
                    title: 'Regras e Infos',
                    icon: BookOpen,
                    items: houseRules.filter(r => 
                      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      r.content.toLowerCase().includes(searchQuery.toLowerCase())
                    ),
                    render: (rule: any, i: number) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-ipe-brown/5 mb-3 flex items-start gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                          <Info size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-ipe-brown">{rule.title}</h4>
                          <p className="text-xs text-ipe-text line-clamp-2 mt-1">{rule.content}</p>
                          <button 
                            onClick={() => {
                              if (rule.title.toLowerCase().includes('wi-fi')) setView('flat');
                              else if (rule.title.toLowerCase().includes('cafeteira')) setView('flat');
                              else setView('rules');
                            }}
                            className="text-[10px] text-ipe-gold font-bold uppercase tracking-wider mt-2 hover:underline"
                          >
                            Ver mais
                          </button>
                        </div>
                      </div>
                    )
                  },
                  {
                    title: 'Comodidades',
                    icon: Building2,
                    items: amenities.filter(a => a.label.toLowerCase().includes(searchQuery.toLowerCase())),
                    render: (item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl mb-3 border border-ipe-brown/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-ipe-gold/10 text-ipe-gold rounded-lg">
                            <item.icon size={18} />
                          </div>
                          <span className="text-sm font-bold text-ipe-brown">{item.label}</span>
                        </div>
                        <button onClick={() => setView('flat')} className="text-ipe-gold">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )
                  },
                  {
                    title: 'Emergência',
                    icon: AlertCircle,
                    items: emergencyContacts.filter(c => 
                      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.phone.toLowerCase().includes(searchQuery.toLowerCase())
                    ),
                    render: (contact: any, i: number) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-red-50 mb-3 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-ipe-brown">{contact.name}</h4>
                          <p className="text-xs font-bold text-red-600">{contact.phone}</p>
                        </div>
                        <button onClick={() => setView('emergencia')} className="p-2 bg-red-50 text-red-600 rounded-full">
                          <Phone size={14} />
                        </button>
                      </div>
                    )
                  }
                ].filter(section => section.items.length > 0).map((section, idx) => (
                  <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-2 mb-4 px-2">
                      <section.icon size={18} className="text-ipe-gold" />
                      <h3 className="text-xs font-bold text-ipe-muted uppercase tracking-[3px]">{section.title}</h3>
                    </div>
                    <div>
                      {section.items.map((item, i) => section.render(item, i))}
                    </div>
                  </div>
                ))}

                {/* No results */}
                {places.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()) || p.address.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                 houseRules.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.content.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                 amenities.filter(a => a.label.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                 emergencyContacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                   <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-ipe-brown/10">
                     <Search size={40} className="mx-auto text-ipe-muted/20 mb-4" />
                     <p className="text-ipe-muted">Nenhum resultado encontrado para sua busca.</p>
                     <button 
                      onClick={() => {
                        setSearchQuery('');
                        setView('home');
                      }}
                      className="mt-4 text-ipe-gold font-bold text-sm uppercase tracking-wider hover:underline"
                    >
                      Voltar ao Início
                    </button>
                   </div>
                 )}
              </div>
            </PageContainer>
          )}

          {view === 'rules' && (
            <PageContainer key="rules" title="Regras da casa" onBack={() => setView('home')}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-ipe-brown font-serif italic">"Mi casa su casa"</h2>
                <p className="text-sm text-ipe-muted italic mt-1">Cuidem do nosso espaço como se fosse a casa de vocês!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {houseRules.map((rule, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-ipe-brown/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-ipe-gold/10 text-ipe-gold rounded-lg">
                        {idx === 0 && <Volume2 size={20} />}
                        {idx === 1 && <CigaretteOff size={20} />}
                        {idx === 2 && <Trash2 size={20} />}
                        {idx === 3 && <Bath size={20} />}
                        {idx === 4 && <PawPrint size={20} />}
                        {idx === 5 && <LogOut size={20} />}
                      </div>
                      <h3 className="font-bold text-ipe-brown">{rule.title}</h3>
                    </div>
                    <p className="text-sm text-ipe-text leading-relaxed">
                      {rule.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3">
                <Info className="text-orange-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-orange-800">Limpeza Adicional</p>
                  <p className="text-sm text-orange-700">Troca de enxoval ou limpeza extra durante a estadia possui taxa de R$ 70,00.</p>
                </div>
              </div>
            </PageContainer>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-12 pt-12 pb-16 border-t border-ipe-brown/10">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-ipe-brown font-serif tracking-wider">WELLINGTON RODOVALHO FONSECA</h2>
            <p className="text-xs text-ipe-muted uppercase tracking-[3px] mt-1">Corretor de Imóveis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Documentação */}
            <div>
              <p className="text-[10px] font-bold text-ipe-muted uppercase tracking-wider mb-3">Documentação</p>
              <div className="space-y-1 text-xs text-ipe-brown">
                <p><span className="font-bold">CAEPF:</span> 269.462.701/001-49</p>
                <p><span className="font-bold">CRECI:</span> GO 42695</p>
                <p><span className="font-bold">CNAI:</span> 54826</p>
              </div>
            </div>

            {/* Digital */}
            <div>
              <p className="text-[10px] font-bold text-ipe-muted uppercase tracking-wider mb-3">Digital</p>
              <div className="space-y-1 text-xs text-ipe-brown">
                <a href="https://www.alugagoias.com.br" target="_blank" rel="noopener noreferrer" className="block hover:text-ipe-gold transition-colors underline underline-offset-4">www.alugagoias.com.br</a>
                <a href="mailto:contato@alugagoias.com.br" className="block hover:text-ipe-gold transition-colors underline underline-offset-4">contato@alugagoias.com.br</a>
              </div>
            </div>

            {/* Contato Direto */}
            <div className="flex flex-col items-center md:items-end">
              <p className="text-[10px] font-bold text-ipe-muted uppercase tracking-wider mb-3">Contato Direto</p>
              <a 
                href="https://wa.me/5562991514568" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-sm font-bold hover:bg-green-100 transition-colors"
              >
                <MessageCircle size={16} />
                (62) 99151-4568
              </a>
            </div>
          </div>

          <div className="mt-12 text-center opacity-30">
            <Logo size={24} className="mx-auto mb-2 grayscale" />
            <p className="text-[10px]">© 2024 Flat Crystal 1701. Todos os direitos reservados.</p>
          </div>
        </footer>
      </main>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
        {view !== 'home' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setView('home');
              scrollToTop();
            }}
            className="w-14 h-14 bg-ipe-brown text-white rounded-full shadow-lg flex items-center justify-center"
            title="Voltar ao Início"
          >
            <Home size={28} />
          </motion.button>
        )}
        <motion.a
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href="https://wa.me/5562991514568"
          className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center"
          title="WhatsApp"
        >
          <MessageCircle size={28} />
        </motion.a>
      </div>
    </div>
  );
}
