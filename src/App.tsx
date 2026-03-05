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
  Users
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

type ViewState = 'home' | 'flat' | 'checkin' | 'guia' | 'checkout' | 'emergencia' | 'rules';

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
    const timer = setTimeout(() => setLoading(false), 2000);
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
    <div className="min-h-screen bg-ipe-bg pb-24">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <Logo size={80} className="mx-auto mb-6 bg-white p-3 rounded-full shadow-lg" />
        <h1 className="text-4xl font-bold text-ipe-brown font-serif">Flat Crystal 1701</h1>
        <p className="text-ipe-muted mt-2 italic">Guia do Hóspede</p>
      </header>

      <main className="max-w-2xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <NavButton title="O Flat" icon={Building2} onClick={() => setView('flat')} />
              <NavButton title="Check-in" icon={Key} onClick={() => setView('checkin')} />
              <NavButton title="Guia Local" icon={Navigation} onClick={() => setView('guia')} />
              <NavButton title="Check-out" icon={LogOut} onClick={() => setView('checkout')} />
              <NavButton title="Regras da casa" icon={BookOpen} onClick={() => setView('rules')} />
              <NavButton title="Emergência" icon={AlertCircle} onClick={() => setView('emergencia')} color="bg-red-50" />
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
                        <p className="font-bold">Flat Crystal 1701 Guest</p>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText('Flat Crystal 1701 Guest');
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
                        <p className="font-bold">crystal_bem_vindo</p>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText('crystal_bem_vindo');
                          alert('Senha copiada!');
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Copy size={16} className="opacity-40" />
                      </button>
                    </div>
                  </div>
                </div>
                <Wifi className="absolute -right-10 -bottom-10 text-white/5 w-48 h-48 rotate-12" />
              </div>

              {/* Features Grid - Visual */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <Sparkles size={18} className="text-ipe-gold" />
                  <h3 className="text-xs font-bold text-ipe-muted uppercase tracking-[3px]">Comodidades do Condomínio</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: ShieldCheck, label: 'Portaria 24h' },
                    { icon: Waves, label: 'Piscina Aquecida' },
                    { icon: Dumbbell, label: 'Academia 24h' },
                    { icon: RotateCcw, label: 'Lavanderia OMO' },
                    { icon: Car, label: 'Manobrista' },
                    { icon: Users, label: 'Sala Reuniões' },
                    { icon: Zap, label: 'Recarga Elétrica' },
                    { icon: Store, label: 'Mercadinho' },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white p-5 rounded-2xl border border-ipe-brown/5 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md hover:border-ipe-gold/20 transition-all"
                    >
                      <div className="p-3 bg-ipe-gold/10 text-ipe-gold rounded-2xl">
                        <item.icon size={24} />
                      </div>
                      <span className="text-[10px] font-bold text-ipe-brown leading-tight uppercase tracking-wider">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Detailed Rules */}
              <div className="space-y-6">
                <Card title="Regras de Convivência" icon={ShieldCheck}>
                  <ul className="space-y-4 text-sm">
                    {[
                      "Não deixar roupas ou objetos nas sacadas.",
                      "Visitas devem se identificar na recepção.",
                      "Silêncio obrigatório das 22h às 08h.",
                      "Somente manobristas movem os veículos.",
                      "Carrinhos de compras apenas no elevador de serviço."
                    ].map((rule, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full bg-ipe-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} className="text-ipe-gold" />
                        </div>
                        <span className="text-ipe-text leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card title="Academia" icon={Dumbbell} className="mb-0">
                    <ul className="space-y-3 text-xs">
                      <li className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-ipe-gold mt-1.5 shrink-0" />
                        <span>Desligue luzes e ar ao sair.</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-ipe-gold mt-1.5 shrink-0" />
                        <span>Guarde os pesos no lugar.</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-ipe-gold mt-1.5 shrink-0" />
                        <span>Proibido crianças desacompanhadas.</span>
                      </li>
                    </ul>
                  </Card>

                  <Card title="Piscina & Sauna" icon={Waves} className="mb-0">
                    <div className="space-y-4">
                      <div className="p-3 bg-ipe-bg rounded-xl border border-ipe-brown/5">
                        <p className="text-[10px] text-ipe-muted font-bold uppercase mb-1">Horário Piscina</p>
                        <p className="text-xs text-ipe-brown font-bold">06h às 23h (Diariamente)</p>
                      </div>
                      <ul className="space-y-2 text-xs">
                        <li className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-ipe-gold mt-1.5 shrink-0" />
                          <span>Proibido garrafas de vidro.</span>
                        </li>
                        <li className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-ipe-gold mt-1.5 shrink-0" />
                          <span>Não circular em trajes de banho.</span>
                        </li>
                      </ul>
                    </div>
                  </Card>
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
                  <p className="text-[10px] opacity-50 italic">Exemplo para (62) 98545...: *6298545#</p>
                </div>

                <div className="flex gap-3 p-4 bg-white/10 rounded-xl border border-white/10">
                  <Info size={20} className="text-ipe-gold shrink-0" />
                  <p className="text-sm leading-relaxed">
                    Ao fechar a porta, <span className="font-bold">sempre trave a fechadura movendo a maçaneta para cima</span>, tanto ao entrar quanto ao sair.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a 
                    href="https://wa.me/5562985451980?text=Olá! Gostaria de deixar um feedback sobre minha estadia no Flat 1701."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                  >
                    <MessageCircle size={20} />
                    Enviar Observações via WhatsApp
                  </a>
                  
                  <div className="bg-ipe-bg rounded-xl p-4 flex flex-col items-center justify-center border border-ipe-brown/5">
                    <p className="text-[10px] font-bold text-ipe-muted uppercase tracking-wider mb-1">Contato do Anfitrião</p>
                    <p className="text-lg font-bold text-ipe-brown">(62) 98545-1980</p>
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
                  {[
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
                  ].map((contact, idx) => (
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
                    href="https://wa.me/5562985451980" 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle size={20} />
                    WhatsApp Suporte
                  </a>
                </Card>
              </div>
            </PageContainer>
          )}

          {view === 'rules' && (
            <PageContainer key="rules" title="Regras da casa" onBack={() => setView('home')}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-ipe-brown font-serif italic">"Mi casa su casa"</h2>
                <p className="text-sm text-ipe-muted italic mt-1">Cuidem do nosso espaço como se fosse a casa de vocês!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-ipe-brown/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Volume2 size={20} />
                    </div>
                    <h3 className="font-bold text-ipe-brown">Silêncio e Respeito</h3>
                  </div>
                  <p className="text-sm text-ipe-text leading-relaxed">
                    Pedimos que seja silencioso e discreto, especialmente à noite. Não é permitido transitar sem camisa nas áreas comuns.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-ipe-brown/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <CigaretteOff size={20} />
                    </div>
                    <h3 className="font-bold text-ipe-brown">Fumo Proibido</h3>
                  </div>
                  <p className="text-sm text-ipe-text leading-relaxed">
                    Não é permitido fumar no interior do apartamento. O local possui sensores de gás e fumaça.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-ipe-brown/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                      <Trash2 size={20} />
                    </div>
                    <h3 className="font-bold text-ipe-brown">Lixeiras</h3>
                  </div>
                  <p className="text-sm text-ipe-text leading-relaxed">
                    Ficam no hall dos elevadores à esquerda, em um espaço com porta antes dos elevadores.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-ipe-brown/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Bath size={20} />
                    </div>
                    <h3 className="font-bold text-ipe-brown">Toalhas</h3>
                  </div>
                  <p className="text-sm text-ipe-text leading-relaxed">
                    Não utilize toalhas para limpeza de maquiagem ou chão. Manchas irreparáveis serão cobradas para reposição.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-ipe-brown/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-stone-50 text-stone-600 rounded-lg">
                      <PawPrint size={20} />
                    </div>
                    <h3 className="font-bold text-ipe-brown">Animais de Estimação</h3>
                  </div>
                  <p className="text-sm text-ipe-text leading-relaxed">
                    Pets são bem-vindos! Solicite o formulário online e atente-se ao regimento interno do condomínio.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-ipe-brown/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <LogOut size={20} />
                    </div>
                    <h3 className="font-bold text-ipe-brown">Saída do Apartamento</h3>
                  </div>
                  <p className="text-sm text-ipe-text leading-relaxed">
                    Sempre feche as janelas, desligue o Ar Condicionado e a TV ao se ausentar.
                  </p>
                </div>
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
                href="https://wa.me/5562985451980" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-sm font-bold hover:bg-green-100 transition-colors"
              >
                <MessageCircle size={16} />
                (62) 98545-1980
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
          href="https://wa.me/5562985451980"
          className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center"
          title="WhatsApp"
        >
          <MessageCircle size={28} />
        </motion.a>
      </div>
    </div>
  );
}
