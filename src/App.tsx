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
  ArrowLeft,
  Dumbbell,
  Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type ViewState = 'home' | 'flat' | 'checkin' | 'guia' | 'checkout' | 'emergencia';

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
              <NavButton title="Emergência" icon={AlertCircle} onClick={() => setView('emergencia')} color="bg-red-50" />
              
              <div className="sm:col-span-2 mt-4">
                <Card title="Wi-Fi" icon={Wifi}>
                  <div className="flex justify-between items-center p-3 bg-ipe-bg rounded-xl mb-2">
                    <div>
                      <p className="text-xs text-ipe-muted uppercase font-bold">Rede</p>
                      <p className="font-medium text-ipe-brown">Flat Crystal 1701 Guest</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-ipe-bg rounded-xl">
                    <div>
                      <p className="text-xs text-ipe-muted uppercase font-bold">Senha</p>
                      <p className="font-medium text-ipe-brown">crystal_bem_vindo</p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {view === 'flat' && (
            <PageContainer key="flat" title="O Flat" onBack={() => setView('home')}>
              <Card title="Características do Condomínio" icon={Building2}>
                <div className="space-y-4 text-ipe-text">
                  <p>O Flat Crystal 1701 oferece uma infraestrutura completa e serviços de alta qualidade para sua estadia:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Portaria 24 horas com segurança monitorada.</li>
                    <li>Piscina aquecida localizada no mezanino.</li>
                    <li>Academia climatizada com funcionamento 24 horas.</li>
                    <li>Lavanderia compartilhada (sistema OMO).</li>
                    <li>Serviço de manobrista disponível para sua conveniência.</li>
                    <li>Sala de reuniões (utilização cobrada à parte).</li>
                    <li>Estação de recarga para veículos elétricos no estacionamento interno (utilização não inclusa no valor da reserva).</li>
                  </ul>
                </div>
              </Card>
              <Card title="Regras de Convivência" icon={ShieldCheck}>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <Check size={16} className="text-ipe-gold shrink-0" />
                    <span>Não deixar roupas, placas ou cartazes nas sacadas dos apartamentos.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="text-ipe-gold shrink-0" />
                    <span>As visitas precisam se identificar na recepção e só adentrar após a biometria.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="text-ipe-gold shrink-0" />
                    <span>Evitar barulhos excessivos, principalmente no período das 22h até as 08h.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="text-ipe-gold shrink-0" />
                    <span>Somente os manobristas têm permissão para manobrar os carros.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="text-ipe-gold shrink-0" />
                    <span>Carrinhos de compras apenas pelo elevador de serviço.</span>
                  </li>
                </ul>
              </Card>

              <Card title="Regras da Academia" icon={Dumbbell}>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <Check size={16} className="text-ipe-gold shrink-0" />
                    <span>Ao sair, desligue as luzes, o ar-condicionado e guarde os pesos no lugar.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="text-ipe-gold shrink-0" />
                    <span>Não jogar os pesos no chão.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="text-ipe-gold shrink-0" />
                    <span>Não solte os equipamentos de uma vez para evitar que batam.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="text-ipe-gold shrink-0" />
                    <span>Não é permitido crianças desacompanhadas.</span>
                  </li>
                </ul>
              </Card>

              <Card title="Piscina & Sauna" icon={Waves}>
                <div className="space-y-4">
                  <div className="p-3 bg-ipe-gold/5 rounded-xl border border-ipe-gold/10">
                    <p className="text-xs text-ipe-muted uppercase font-bold mb-1">Horários</p>
                    <p className="text-sm text-ipe-brown font-medium">Piscina: Segunda a Domingo • 06h às 23h</p>
                    <p className="text-sm text-ipe-brown font-medium">Sauna: 09h às 21h (Solicitar chave na recepção)</p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-2">
                      <Check size={16} className="text-ipe-gold shrink-0" />
                      <span>Não é permitido criança desacompanhada.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check size={16} className="text-ipe-gold shrink-0" />
                      <span>Não é permitido garrafas nas bordas da piscina.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check size={16} className="text-ipe-gold shrink-0" />
                      <span>Não circular nas áreas comuns com trajes de banho.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check size={16} className="text-ipe-gold shrink-0" />
                      <span>Proibido barulho excessivo das 22h às 08h.</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </PageContainer>
          )}

          {view === 'checkin' && (
            <PageContainer key="checkin" title="Check-in" onBack={() => setView('home')}>
              <Card title="Instruções de Chegada" icon={Key}>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-ipe-gold text-white flex items-center justify-center font-bold shrink-0">1</div>
                    <div>
                      <h3 className="font-bold text-ipe-brown">Identificação</h3>
                      <p className="text-sm text-ipe-muted">Ao chegar, identifique-se na portaria principal com seu documento original.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-ipe-gold text-white flex items-center justify-center font-bold shrink-0">2</div>
                    <div>
                      <h3 className="font-bold text-ipe-brown">Acesso ao Bloco</h3>
                      <p className="text-sm text-ipe-muted">O porteiro liberará sua entrada para o elevador social.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-ipe-gold text-white flex items-center justify-center font-bold shrink-0">3</div>
                    <div>
                      <h3 className="font-bold text-ipe-brown">Fechadura Eletrônica</h3>
                      <p className="text-sm text-ipe-muted">Digite a senha enviada no seu WhatsApp no teclado da porta e pressione #.</p>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="bg-ipe-gold/10 p-4 rounded-2xl border border-ipe-gold/20 flex gap-3">
                <Info className="text-ipe-gold shrink-0" />
                <p className="text-sm text-ipe-brown italic">O check-in inicia às 14:00. Caso precise entrar antes, consulte disponibilidade.</p>
              </div>
            </PageContainer>
          )}

          {view === 'guia' && (
            <PageContainer key="guia" title="Guia Local" onBack={() => setView('home')}>
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-ipe-brown mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-ipe-gold" /> Pontos Turísticos
                  </h3>
                  <RecommendationItem name="Parque das Flores" type="Lazer & Natureza" distance="1.2km" />
                  <RecommendationItem name="Museu de Arte Moderna" type="Cultura" distance="2.5km" />
                </section>

                <section>
                  <h3 className="text-lg font-bold text-ipe-brown mb-4 flex items-center gap-2">
                    <Stethoscope size={20} className="text-ipe-gold" /> Farmácias Próximas
                  </h3>
                  <RecommendationItem name="Drogaria São Paulo" type="Farmácia 24h" distance="300m" icon={Stethoscope} />
                  <RecommendationItem name="Pague Menos" type="Farmácia" distance="500m" icon={Stethoscope} />
                </section>

                <section>
                  <h3 className="text-lg font-bold text-ipe-brown mb-4 flex items-center gap-2">
                    <Landmark size={20} className="text-ipe-gold" /> Bancos
                  </h3>
                  <RecommendationItem name="Banco Itaú" type="Agência & Caixa" distance="400m" icon={Landmark} />
                  <RecommendationItem name="Bradesco" type="Agência" distance="600m" icon={Landmark} />
                </section>

                <section>
                  <h3 className="text-lg font-bold text-ipe-brown mb-4 flex items-center gap-2">
                    <Utensils size={20} className="text-ipe-gold" /> Restaurantes
                  </h3>
                  <RecommendationItem name="Bistrô do Sol" type="Cozinha Contemporânea" distance="200m" icon={Utensils} />
                  <RecommendationItem name="Pizzaria Napoli" type="Italiana" distance="450m" icon={Utensils} />
                </section>

                <section>
                  <h3 className="text-lg font-bold text-ipe-brown mb-4 flex items-center gap-2">
                    <ShoppingBag size={20} className="text-ipe-gold" /> Shoppings
                  </h3>
                  <RecommendationItem name="Shopping Crystal Center" type="Compras & Cinema" distance="800m" icon={ShoppingBag} />
                  <RecommendationItem name="Plaza Mall" type="Compras" distance="1.5km" icon={ShoppingBag} />
                </section>
              </div>
            </PageContainer>
          )}

          {view === 'checkout' && (
            <PageContainer key="checkout" title="Check-out" onBack={() => setView('home')}>
              <Card title="Instruções de Saída" icon={LogOut}>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-ipe-gold mt-2 shrink-0" />
                    <p className="text-sm text-ipe-text">O horário limite é às 11:00.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-ipe-gold mt-2 shrink-0" />
                    <p className="text-sm text-ipe-text">Desligue o ar-condicionado, luzes e eletrônicos.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-ipe-gold mt-2 shrink-0" />
                    <p className="text-sm text-ipe-text">Certifique-se de que a porta esteja trancada ao sair.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-ipe-gold mt-2 shrink-0" />
                    <p className="text-sm text-ipe-text">Envie uma mensagem avisando que desocupou o flat.</p>
                  </div>
                </div>
              </Card>
            </PageContainer>
          )}

          {view === 'emergencia' && (
            <PageContainer key="emergencia" title="Emergência" onBack={() => setView('home')}>
              <div className="space-y-4">
                <a href="tel:190" className="flex items-center justify-between p-6 bg-white rounded-2xl border border-red-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-ipe-brown">Polícia Militar</h3>
                      <p className="text-sm text-ipe-muted">Ligue 190</p>
                    </div>
                  </div>
                  <Phone size={20} className="text-red-400" />
                </a>
                <a href="tel:192" className="flex items-center justify-between p-6 bg-white rounded-2xl border border-red-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                      <Stethoscope size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-ipe-brown">SAMU</h3>
                      <p className="text-sm text-ipe-muted">Ligue 192</p>
                    </div>
                  </div>
                  <Phone size={20} className="text-red-400" />
                </a>
                <a href="tel:193" className="flex items-center justify-between p-6 bg-white rounded-2xl border border-red-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                      <Wind size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-ipe-brown">Bombeiros</h3>
                      <p className="text-sm text-ipe-muted">Ligue 193</p>
                    </div>
                  </div>
                  <Phone size={20} className="text-red-400" />
                </a>
                <Card title="Contato do Anfitrião" icon={Phone}>
                  <p className="text-sm text-ipe-text mb-4">Para questões urgentes relacionadas ao flat:</p>
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
