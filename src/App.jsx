import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Home, Users, Calendar, DollarSign, BarChart2, LogOut, Plus, ChevronLeft, ChevronRight, Edit, Trash2, X, Eye, AlertCircle, CheckCircle, ArrowRight, ShieldCheck, Zap, BarChart3, Clock, Smartphone } from 'lucide-react';

// --- DADOS SIMULADOS (MOCK - Substituir por chamadas de API) ---
const initialData = {
  users: [{ id: 1, nome: "Ana Pereira", email: "ana.personal@email.com", password: "123" }],
  clients: [
    { id: 1, userId: 1, nome: "Carlos Silva", contato: "11987654321", plano: "3x por semana", valor: 350.00, ativo: true, plan_start_date: "2025-09-01", plan_end_date: "2025-09-30", trainings_per_week: 3 },
    { id: 2, userId: 1, nome: "Mariana Costa", contato: "21912345678", plano: "Consultoria Online", valor: 200.00, ativo: true, plan_start_date: "2025-08-15", plan_end_date: "2025-09-14", trainings_per_week: 0 },
    { id: 3, userId: 1, nome: "João Pedro", contato: "31955558888", plano: "2x por semana", valor: 280.00, ativo: false, plan_start_date: "2025-08-10", plan_end_date: "2025-09-09", trainings_per_week: 2 },
    { id: 4, userId: 1, nome: "Beatriz Lima", contato: "48988776655", plano: "5x por semana", valor: 550.00, ativo: true, plan_start_date: "2025-09-01", plan_end_date: "2025-09-30", trainings_per_week: 5 },
  ],
  trainings: [
    { id: 1, userId: 1, clienteId: 1, titulo: "Treino de Pernas", data_hora: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), status: 'concluido' },
    { id: 2, userId: 1, clienteId: 2, titulo: "Avaliação Física", data_hora: new Date().toISOString(), status: 'pendente' },
    { id: 3, userId: 1, clienteId: 4, titulo: "Treino de Superiores", data_hora: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), status: 'pendente' },
    { id: 4, userId: 1, clienteId: 1, titulo: "Treino Funcional", data_hora: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), status: 'cancelado' },
    { id: 5, userId: 1, clienteId: 4, titulo: "Cardio", data_hora: new Date().toISOString(), status: 'concluido' },
  ],
  payments: [
    { id: 1, userId: 1, clienteId: 1, valor: 350.00, data_vencimento: "2025-09-05", data_pagamento: "2025-09-01", status: 'pago' },
    { id: 2, userId: 1, clienteId: 2, valor: 200.00, data_vencimento: "2025-08-15", data_pagamento: "2025-08-14", status: 'pago' },
    { id: 3, userId: 1, clienteId: 3, valor: 280.00, data_vencimento: "2025-09-10", data_pagamento: null, status: 'pendente' },
    { id: 4, userId: 1, clienteId: 4, valor: 550.00, data_vencimento: "2025-09-01", data_pagamento: "2025-08-30", status: 'pago' },
    { id: 5, userId: 1, clienteId: 1, valor: 350.00, data_vencimento: "2025-08-05", data_pagamento: "2025-08-01", status: 'pago' },
  ]
};

// --- COMPONENTES DA UI ---
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  return (<div className={`fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 z-50 animate-fade-in-up ${bgColor}`}><Icon size={24} /><span>{message}</span></div>);
};

const StatCard = ({ title, value, icon, color, onClick }) => (
  <div onClick={onClick} className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform hover:scale-105 cursor-pointer">
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    <div><p className="text-sm text-gray-500">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold text-gray-800">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button></div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// --- PÁGINAS DE AUTENTICAÇÃO E LANDING PAGE ---
const LandingPage = ({ setAuthState, setAuthPage }) => {
  const FAQItem = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border-b py-4">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left font-semibold"><span>{q}</span><ChevronRight className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} /></button>
        {isOpen && <p className="mt-2 text-gray-600 pr-4">{a}</p>}
      </div>
    );
  };
  return (
    <div className="bg-white text-gray-800">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-30 shadow-sm"><nav className="container mx-auto px-6 py-4 flex justify-between items-center"><h1 className="text-2xl font-bold text-indigo-600">Personal Trainer Pro</h1><button onClick={() => { setAuthState('loggedOut'); setAuthPage('login'); }} className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition-colors">Login</button></nav></header>
      <main>
        <section id="hero" className="pt-32 pb-20 text-center bg-gray-50"><div className="container mx-auto px-6"><h2 className="text-4xl md:text-5xl font-extrabold mb-4">Controle sua agenda, clientes e ganhos.</h2><p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Sistema inteligente para personal trainers: organize sua rotina e aumente seus resultados.</p><button onClick={() => { setAuthState('loggedOut'); setAuthPage('register'); }} className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-transform hover:scale-105">Comece grátis por 7 dias</button><p className="mt-2 text-sm text-gray-500">Não precisa de cartão de crédito.</p></div></section>
        <section id="benefits" className="py-20"><div className="container mx-auto px-6"><div className="grid md:grid-cols-3 gap-8 text-center">{[{icon:<Calendar/>, t:"Agenda Interativa"},{icon:<Users/>, t:"Gestão de Alunos"},{icon:<DollarSign/>, t:"Controle Financeiro"},{icon:<BarChart3/>, t:"Relatórios Automáticos"},{icon:<Clock/>, t:"Alertas e Lembretes"},{icon:<Smartphone/>, t:"100% Online e Mobile"}].map(b=><div key={b.t} className="p-6 bg-gray-50 rounded-xl"><div className="text-indigo-600 inline-block p-3 bg-indigo-100 rounded-full mb-4">{b.icon}</div><h3 className="font-bold text-xl mb-2">{b.t}</h3></div>)}</div></div></section>
        <section id="pricing" className="py-20 bg-gray-50"><div className="container mx-auto px-6 text-center"><h2 className="text-3xl font-bold mb-12">Planos e Preços</h2><div className="flex flex-col md:flex-row justify-center items-center gap-8"><div className="border rounded-xl p-8 w-full max-w-sm bg-white shadow-lg"><h3 className="text-2xl font-bold mb-2">Teste Grátis</h3><p className="text-4xl font-bold mb-4">R$ 0<span className="text-lg font-normal">/7 dias</span></p><ul className="space-y-2 text-gray-600 mb-6"><li>✓ Acesso total ao sistema</li><li>✓ Sem cartão de crédito</li><li>✓ Cancelamento automático</li></ul><button onClick={() => { setAuthState('loggedOut'); setAuthPage('register'); }} className="w-full px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg font-semibold">Começar Agora</button></div><div className="border-2 border-indigo-600 rounded-xl p-8 w-full max-w-sm bg-white shadow-2xl relative"><p className="absolute -top-4 bg-indigo-600 text-white px-4 py-1 rounded-full font-semibold">MAIS POPULAR</p><h3 className="text-2xl font-bold mb-2">Profissional</h3><p className="text-4xl font-bold mb-4">R$ 49<span className="text-lg font-normal">/mês</span></p><ul className="space-y-2 text-gray-600 mb-6"><li>✓ Acesso ilimitado à plataforma</li><li>✓ Suporte prioritário</li><li>✓ Atualizações contínuas</li></ul><button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold">Assinar Plano Pro</button></div></div></div></section>
        <section id="faq" className="py-20"><div className="container mx-auto px-6 max-w-3xl"><h2 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2><FAQItem q="Preciso cadastrar cartão para testar?" a="Não. O teste de 7 dias é 100% gratuito e sem compromisso." /><FAQItem q="O que acontece após os 7 dias?" a="Você poderá escolher se deseja assinar. Caso contrário, seu acesso é pausado, mas seus dados ficam salvos." /><FAQItem q="O sistema funciona no celular?" a="Sim! É totalmente responsivo e funciona perfeitamente em qualquer dispositivo." /></div></section>
      </main>
      <footer className="bg-gray-800 text-white py-8"><div className="container mx-auto px-6 text-center text-sm">© 2025 Personal Trainer Pro. Todos os direitos reservados.</div></footer>
    </div>
  );
};

const AuthPage = ({ onLogin, onRegister, setAuthPage, authPage, showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleLoginSubmit = (e) => { e.preventDefault(); onLogin(email, password); };
  const handleRegisterSubmit = (e) => { e.preventDefault(); onRegister(name, email, password); };
  const handleForgotSubmit = (e) => { e.preventDefault(); setIsForgotPassword(false); showToast("E-mail de recuperação enviado!", "success"); };

  if (isForgotPassword) {
    return (<div className="w-screen h-screen flex justify-center items-center bg-gray-100 p-4"><div className="w-full max-w-sm text-center"><h1 className="text-2xl font-bold text-indigo-600 mb-2">Recuperar Senha</h1><p className="text-gray-600 mb-8">Digite seu e-mail para continuar.</p><div className="bg-white p-8 rounded-xl shadow-md"><form onSubmit={handleForgotSubmit} className="space-y-6"><input type="email" placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" /><button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">Enviar</button></form><p className="text-sm mt-6"><button onClick={() => setIsForgotPassword(false)} className="font-semibold text-indigo-600">Voltar para o Login</button></p></div></div></div>);
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">Personal Trainer Pro</h1>
        <p className="text-gray-600 mb-8">{authPage === 'login' ? 'Bem-vindo(a) de volta!' : 'Crie sua conta para começar.'}</p>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <form onSubmit={authPage === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-6">
            {authPage === 'register' && <input type="text" placeholder="Seu nome completo" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />}
            <input type="email" placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
            <input type="password" placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">{authPage === 'login' ? 'Entrar' : 'Criar Conta Grátis'}</button>
          </form>
          {authPage === 'login' && <p className="text-sm mt-4"><button onClick={() => setIsForgotPassword(true)} className="font-semibold text-indigo-600">Esqueceu a senha?</button></p>}
          <p className="text-sm text-gray-500 mt-6">{authPage === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'} <button onClick={() => setAuthPage(authPage === 'login' ? 'register' : 'login')} className="font-semibold text-indigo-600">{authPage === 'login' ? 'Cadastre-se' : 'Faça Login'}</button></p>
        </div>
      </div>
    </div>
  );
};

// --- PÁGINAS DO SISTEMA ---
const DashboardPage = ({ user, clients, trainings, payments, setCurrentPage }) => {
    const activeClients = clients.filter(c => c.ativo).length;
    const monthlyEarnings = payments.filter(p => p.status === 'pago' && new Date(p.data_pagamento).getMonth() === new Date().getMonth()).reduce((sum, p) => sum + p.valor, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const todayTrainings = trainings.filter(t => new Date(t.data_hora).toDateString() === new Date().toDateString()).sort((a,b) => new Date(a.data_hora) - new Date(b.data_hora));
    const pendingPayments = payments.filter(p => p.status === 'pendente');

    const getStatusChip = (status) => {
        switch (status) {
            case 'concluido': return <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Concluído</span>;
            case 'pendente': return <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Pendente</span>;
            case 'cancelado': return <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-full">Cancelado</span>;
        }
    };
    
    const trainingsThisMonth = trainings.filter(t => new Date(t.data_hora).getMonth() === new Date().getMonth());
    const performanceData = [
        { name: 'Realizados', value: trainingsThisMonth.filter(t => t.status === 'concluido').length },
        { name: 'Planejados', value: trainingsThisMonth.filter(t => t.status !== 'concluido').length }
    ];
    const COLORS = ['#10b981', '#f59e0b'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vinda, {user.nome.split(' ')[0]}!</h1>
      <p className="text-gray-500 mb-8">Aqui está um resumo da sua atividade.</p>
      
      {pendingPayments.length > 0 && 
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-6" role="alert">
          <p className="font-bold">Atenção!</p>
          <p>Você tem {pendingPayments.length} pagamento(s) pendente(s). <button onClick={() => setCurrentPage('pagamentos')} className="font-bold underline">Ver pagamentos</button>.</p>
        </div>
      }

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Ganhos no Mês" value={monthlyEarnings} icon={<DollarSign className="text-green-500" />} color="bg-green-100" onClick={() => setCurrentPage('pagamentos')} />
        <StatCard title="Clientes Ativos" value={activeClients} icon={<Users className="text-blue-500" />} color="bg-blue-100" onClick={() => setCurrentPage('clients')} />
        <StatCard title="Treinos Hoje" value={todayTrainings.length} icon={<Calendar className="text-indigo-500" />} color="bg-indigo-100" onClick={() => setCurrentPage('agenda')} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6"><div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md"><h2 className="text-xl font-bold text-gray-800 mb-4">Agenda de Hoje</h2>{todayTrainings.length > 0 ? (<ul className="space-y-4">{todayTrainings.map(t => { const client = clients.find(c => c.id === t.clienteId); return (<li key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p className="font-semibold text-gray-700">{t.titulo} com {client?.nome}</p><p className="text-sm text-gray-500">{new Date(t.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p></div>{getStatusChip(t.status)}</li>);})}</ul>) : (<p className="text-center text-gray-500 py-8">Nenhum treino agendado para hoje.</p>)}</div><div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md"><h2 className="text-xl font-bold text-gray-800 mb-4">Desempenho Mensal</h2><div style={{width: '100%', height: 200}}><ResponsiveContainer><PieChart><Pie data={performanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>{performanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></div></div>
    </div>
  );
};

const ClientsPage = ({ clients, setClients, trainings, payments, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    const handleOpenModal = (client = null) => { setCurrentClient(client); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setCurrentClient(null); };
    const handleOpenHistory = (client) => { setCurrentClient(client); setIsHistoryModalOpen(true); };
    
    const handleSaveClient = (clientData) => {
        if (!clientData.nome || !clientData.plano || !clientData.valor) { showToast("Nome, plano e valor são obrigatórios.", "error"); return; }
        if (currentClient) {
            setClients(clients.map(c => c.id === currentClient.id ? { ...c, ...clientData, valor: parseFloat(clientData.valor) } : c));
            showToast("Cliente atualizado com sucesso!", "success");
        } else {
            setClients([...clients, { id: Math.max(...clients.map(c => c.id), 0) + 1, userId: 1, ativo: true, ...clientData, valor: parseFloat(clientData.valor) }]);
            showToast("Cliente adicionado com sucesso!", "success");
        }
        handleCloseModal();
    };
    
    const confirmDeleteClient = () => {
        setClients(clients.filter(c => c.id !== clientToDelete));
        setIsDeleteModalOpen(false); setClientToDelete(null);
        showToast("Cliente removido.", "success");
    };
    
    const filteredClients = clients.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const ClientForm = ({ client, onSave, onCancel }) => {
        const predefinedPlans = ["3x por semana", "5x por semana"];
        const getInitialSelectedPlan = () => {
            if (client && predefinedPlans.includes(client.plano)) return client.plano;
            if (client && client.plano) return "Outro";
            return ""; 
        };

        const [formData, setFormData] = useState({ 
            nome: client?.nome || '', 
            contato: client?.contato || '', 
            plano: client?.plano || '', 
            valor: client?.valor || '', 
            plan_start_date: client?.plan_start_date || '', 
            plan_end_date: client?.plan_end_date || '', 
            trainings_per_week: client?.trainings_per_week || 0 
        });
        
        const [selectedPlan, setSelectedPlan] = useState(getInitialSelectedPlan());

        const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        
        const handlePlanDropdownChange = (e) => {
            const value = e.target.value;
            setSelectedPlan(value);
            if (value !== "Outro") {
                setFormData(prev => ({ ...prev, plano: value }));
            } else {
                setFormData(prev => ({ ...prev, plano: "" }));
            }
        };

        const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
        
        return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-700">Nome do Aluno</label>
                <input type="text" name="nome" placeholder="Nome completo" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"/>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Contato (Telefone/Email)</label>
                <input type="text" name="contato" placeholder="Contato" value={formData.contato} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"/>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700">Plano</label>
                <select value={selectedPlan} onChange={handlePlanDropdownChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500">
                    <option value="" disabled>Selecione um plano</option>
                    {predefinedPlans.map(p => <option key={p} value={p}>{p}</option>)}
                    <option value="Outro">Outro (personalizado)</option>
                </select>
            </div>
            
            {selectedPlan === "Outro" && (
                <div>
                     <label className="text-sm font-medium text-gray-700">Nome do Plano Personalizado</label>
                    <input type="text" name="plano" placeholder="Ex: Consultoria + Acompanhamento" value={formData.plano} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"/>
                </div>
            )}
            
            <div>
                <label className="text-sm font-medium text-gray-700">Valor Mensal (R$)</label>
                <input type="number" name="valor" placeholder="Ex: 350.00" step="0.01" value={formData.valor} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"/>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Nº de Treinos por Semana</label>
                <input type="number" name="trainings_per_week" placeholder="Ex: 3" value={formData.trainings_per_week} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700">Início do Plano</label><input type="date" name="plan_start_date" value={formData.plan_start_date} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"/></div>
                <div><label className="text-sm font-medium text-gray-700">Fim do Plano</label><input type="date" name="plan_end_date" value={formData.plan_end_date} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"/></div>
            </div>
            <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button></div>
        </form>
        );
    }

    return (<div><div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8"><div><h1 className="text-3xl font-bold text-gray-800">Meus Clientes</h1><p className="text-gray-500">Gerencie seus clientes em um só lugar.</p></div><button onClick={() => handleOpenModal()} className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"><Plus size={20} /><span>Adicionar Cliente</span></button></div><div className="mb-6"><input type="text" placeholder="Buscar cliente por nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div><div className="hidden sm:block bg-white rounded-xl shadow-md overflow-x-auto"><table className="w-full text-left"><thead className="bg-gray-50 border-b"><tr><th className="p-4">Nome</th><th className="p-4">Plano</th><th className="p-4">Valor</th><th className="p-4">Status</th><th className="p-4">Ações</th></tr></thead><tbody>{filteredClients.map(client => (<tr key={client.id} className="border-b hover:bg-gray-50"><td className="p-4 font-medium text-gray-800">{client.nome}</td><td className="p-4 text-gray-600">{client.plano}</td><td className="p-4 text-gray-600">{client.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td><td className="p-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${client.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{client.ativo ? 'Ativo' : 'Inativo'}</span></td><td className="p-4"><div className="flex space-x-2"><button onClick={() => handleOpenHistory(client)} className="text-gray-500 hover:text-gray-700"><Eye size={18} /></button><button onClick={() => handleOpenModal(client)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button><button onClick={() => { setClientToDelete(client.id); setIsDeleteModalOpen(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button></div></td></tr>))}</tbody></table></div><div className="sm:hidden space-y-4">{filteredClients.map(client => (<div key={client.id} className="bg-white rounded-xl shadow-md p-4"><div className="flex justify-between items-start"><div><p className="font-bold text-gray-800">{client.nome}</p><p className="text-sm text-gray-600">{client.plano} - {client.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div><span className={`text-xs font-semibold px-2 py-1 rounded-full ${client.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{client.ativo ? 'Ativo' : 'Inativo'}</span></div><div className="flex justify-end space-x-3 mt-4 pt-3 border-t"><button onClick={() => handleOpenHistory(client)} className="text-gray-500 hover:text-gray-700"><Eye size={20} /></button><button onClick={() => handleOpenModal(client)} className="text-blue-500 hover:text-blue-700"><Edit size={20} /></button><button onClick={() => { setClientToDelete(client.id); setIsDeleteModalOpen(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button></div></div>))}</div><Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentClient ? "Editar Cliente" : "Novo Cliente"}><ClientForm client={currentClient} onSave={handleSaveClient} onCancel={handleCloseModal} /></Modal><Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Exclusão"><div><p className="text-gray-600 mb-6">Tem certeza que deseja remover este cliente?</p><div className="flex justify-end space-x-3"><button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button><button onClick={confirmDeleteClient} className="px-4 py-2 bg-red-600 text-white rounded-lg">Remover</button></div></div></Modal><Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title={`Histórico de ${currentClient?.nome}`}><div><h4 className="font-bold mb-2">Treinos</h4><ul className="space-y-2 mb-4">{trainings.filter(t => t.clienteId === currentClient?.id).map(t => <li key={t.id}>{new Date(t.data_hora).toLocaleDateString()} - {t.titulo} ({t.status})</li>)}</ul><h4 className="font-bold mb-2">Pagamentos</h4><ul className="space-y-2">{payments.filter(p => p.clienteId === currentClient?.id).map(p => <li key={p.id}>{new Date(p.data_vencimento).toLocaleDateString()} - {p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ({p.status})</li>)}</ul></div></Modal></div>);
};

// ... restante do código permanece o mesmo

const AgendaPage = ({ trainings, clients, setTrainings, payments, showToast }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);
    
    const hasClientPaid = (clientId) => {
        const clientPayments = payments.filter(p => p.clienteId === clientId && p.status === 'pago');
        if (clientPayments.length === 0) return false;
        const client = clients.find(c => c.id === clientId);
        const today = new Date();
        return new Date(client.plan_start_date) <= today && new Date(client.plan_end_date) >= today;
    };
    
    const handleSaveTraining = (formData) => {
        const { clienteId, titulo, horario, dataInicio, dataFim, diasSemana } = formData;
        if (!clienteId || !titulo || !horario || !dataInicio || !dataFim || Object.values(diasSemana).every(v => !v)) {
            showToast("Preencha todos os campos.", "error"); return;
        }
        if (!hasClientPaid(parseInt(clienteId))) {
            showToast("Cliente com pagamento pendente não pode agendar.", "error"); return;
        }

        const newTrainings = [];
        let currentDate = new Date(dataInicio);
        const endDate = new Date(dataFim);
        const [hours, minutes] = horario.split(':');
        currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());
        endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());
        let lastId = Math.max(...trainings.map(t => t.id), 0);

        while (currentDate <= endDate) {
            if (diasSemana[currentDate.getDay()]) {
                const trainingDateTime = new Date(currentDate);
                trainingDateTime.setHours(hours, minutes);
                lastId++;
                newTrainings.push({ id: lastId, userId: 1, clienteId: parseInt(clienteId), titulo, data_hora: trainingDateTime.toISOString(), status: 'pendente' });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        setTrainings(prev => [...prev, ...newTrainings]);
        setIsModalOpen(false);
        showToast(`${newTrainings.length} treinos agendados!`, "success");
    };
    
    const updateTrainingStatus = (trainingId, status) => {
        setTrainings(trainings.map(t => t.id === trainingId ? {...t, status} : t));
        showToast(`Treino marcado como ${status}!`, "success");
    };
    
    const calendarDays = useMemo(() => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const days = []; for (let i = 0; i < startOfMonth.getDay(); i++) { days.push(null); }
        for (let i = 1; i <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(); i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        } return days;
    }, [currentDate]);

    const trainingsByDay = useMemo(() => {
        const map = {};
        trainings.forEach(t => {
            const client = clients.find(c => c.id === t.clienteId);
            if (!client || !hasClientPaid(client.id)) return; // Regra de negócio: só mostra se pago
            
            const localDate = new Date(t.data_hora);
            if (localDate.getMonth() === currentDate.getMonth()) {
                const day = localDate.getDate();
                if (!map[day]) map[day] = [];
                map[day].push(t);
            }
        });
        return map;
    }, [trainings, currentDate, clients, payments]);

    const getStatusColor = (status) => status === 'concluido' ? 'bg-green-500' : status === 'pendente' ? 'bg-yellow-500' : 'bg-red-500';

    const TrainingForm = ({ clients, onSave, onCancel }) => {
        const [formData, setFormData] = useState({ clienteId: '', titulo: '', horario: '', dataInicio: '', dataFim: '', diasSemana: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 0: false } });
        const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
        const handleDayChange = e => setFormData(p => ({ ...p, diasSemana: { ...p.diasSemana, [e.target.name]: e.target.checked } }));
        const handleSubmit = e => { e.preventDefault(); onSave(formData); };
        const weekDays = [ {l: 'S', v: '1'}, {l: 'T', v: '2'}, {l: 'Q', v: '3'}, {l: 'Q', v: '4'}, {l: 'S', v: '5'}, {l: 'S', v: '6'}, {l: 'D', v: '0'}];

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <select name="clienteId" value={formData.clienteId} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md">{!formData.clienteId && <option value="">Selecione um cliente</option>}{clients.filter(c => c.ativo).map(c => <option key={c.id} value={c.id} disabled={!hasClientPaid(c.id)}>{c.nome} {!hasClientPaid(c.id) && "(Pagamento pendente)"}</option>)}</select>
                <input type="text" name="titulo" placeholder="Título (Ex: Treino de Pernas)" value={formData.titulo} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md"/>
                <div className="flex justify-between items-center gap-1">{weekDays.map(d => <label key={d.v} className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer ${formData.diasSemana[d.v] ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}><input type="checkbox" name={d.v} checked={formData.diasSemana[d.v]} onChange={handleDayChange} className="hidden"/>{d.l}</label>)}</div>
                <input type="time" name="horario" value={formData.horario} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md"/>
                <div className="grid grid-cols-2 gap-4"><input type="date" name="dataInicio" value={formData.dataInicio} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md"/><input type="date" name="dataFim" value={formData.dataFim} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md"/></div>
                <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Agendar Treinos</button></div>
            </form>
        );
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div><h1 className="text-3xl font-bold text-gray-800">Agenda de Treinos</h1><p className="text-gray-500">Apenas treinos de clientes com planos pagos são exibidos.</p></div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"><Plus size={20}/><span>Agendar Treinos</span></button>
            </div>
            <div className="bg-white rounded-xl shadow-md p-2 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft/></button>
                    <h2 className="text-xl font-bold text-center text-gray-800 capitalize">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight/></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-500 text-xs sm:text-sm">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d} className="py-2">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, i) => (
                        <div key={i} className={`h-24 sm:h-28 border rounded-md p-1 ${day ? 'bg-white' : 'bg-gray-50'}`}>
                            {day && <>
                                <span className={`text-sm ${new Date(day).toDateString() === new Date().toDateString() ? 'bg-indigo-600 text-white rounded-full px-2 py-0.5' : ''}`}>{day.getDate()}</span>
                                <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                                    {(trainingsByDay[day.getDate()] || []).map(t => {
                                        const client = clients.find(c => c.id === t.clienteId);
                                        return <div key={t.id} onClick={() => {setSelectedTraining(t); setIsDetailModalOpen(true);}} title={`${t.titulo} com ${client?.nome}`} className={`text-xs p-1 rounded text-white truncate cursor-pointer ${getStatusColor(t.status)}`}>{client?.nome.split(' ')[0]}</div>
                                    })}
                                </div>
                            </>}
                        </div>
                    ))}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agendar Treinos Recorrentes"><TrainingForm clients={clients} onSave={handleSaveTraining} onCancel={() => setIsModalOpen(false)} /></Modal>
            {selectedTraining && <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detalhes do Treino">
                <div>
                    <p><strong>Cliente:</strong> {clients.find(c => c.id === selectedTraining.clienteId)?.nome}</p>
                    <p><strong>Título:</strong> {selectedTraining.titulo}</p>
                    <p><strong>Data:</strong> {new Date(selectedTraining.data_hora).toLocaleString('pt-BR')}</p>
                    <p className="capitalize"><strong>Status:</strong> {selectedTraining.status}</p>
                    <div className="mt-6 flex justify-center space-x-2">
                        <button onClick={() => updateTrainingStatus(selectedTraining.id, 'concluido')} className="px-3 py-1 bg-green-500 text-white rounded">Concluído</button>
                        <button onClick={() => updateTrainingStatus(selectedTraining.id, 'pendente')} className="px-3 py-1 bg-yellow-500 text-white rounded">Pendente</button>
                        <button onClick={() => updateTrainingStatus(selectedTraining.id, 'cancelado')} className="px-3 py-1 bg-red-500 text-white rounded">Cancelado</button>
                    </div>
                </div>
            </Modal>}
        </div>
    )
};

const PagamentosPage = ({ payments, clients, setPayments, showToast }) => {
    const getStatusChip = (status) => {
        if(status === 'pago') return <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Pago</span>;
        if(status === 'pendente') return <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Pendente</span>;
        return <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-full">Atrasado</span>;
    };
    
    const handleMarkAsPaid = (paymentId) => {
        setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'pago', data_pagamento: new Date().toISOString().split('T')[0] } : p));
        showToast("Pagamento confirmado!", "success");
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Financeiro</h1>
                <p className="text-gray-500">Controle os pagamentos dos seus clientes.</p>
            </div>

             {/* Tabela para Desktop */}
            <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b"><tr><th className="p-4">Cliente</th><th className="p-4">Valor</th><th className="p-4">Vencimento</th><th className="p-4">Status</th><th className="p-4">Ação</th></tr></thead>
                    <tbody>
                        {payments.map(payment => {
                            const client = clients.find(c => c.id === payment.clienteId);
                            return (
                                <tr key={payment.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{client?.nome}</td>
                                    <td className="p-4">{payment.valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                                    <td className="p-4">{new Date(payment.data_vencimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                    <td className="p-4">{getStatusChip(payment.status)}</td>
                                    <td className="p-4">{payment.status !== 'pago' && <button onClick={() => handleMarkAsPaid(payment.id)} className="text-sm px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Marcar como Pago</button>}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Cards para Celular */}
            <div className="sm:hidden space-y-4">
                {payments.map(payment => {
                    const client = clients.find(c => c.id === payment.clienteId);
                    return (
                        <div key={payment.id} className="bg-white rounded-xl shadow-md p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800">{client?.nome}</p>
                                    <p className="text-sm text-gray-600">{payment.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                    <p className="text-xs text-gray-500">Venc: {new Date(payment.data_vencimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                </div>
                                {getStatusChip(payment.status)}
                            </div>
                            {payment.status !== 'pago' && (
                                <div className="mt-4 pt-3 border-t">
                                    <button onClick={() => handleMarkAsPaid(payment.id)} className="w-full text-sm px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Marcar como Pago</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
};

const RelatoriosPage = ({ payments, trainings, clients }) => {
    const monthlyData = useMemo(() => {
        const data = {};
        payments.filter(p => p.status === 'pago').forEach(p => {
            const month = new Date(p.data_pagamento).toLocaleString('pt-BR', { month: 'short' });
            if (!data[month]) data[month] = 0; data[month] += p.valor;
        });
        return Object.entries(data).map(([name, Ganhos]) => ({ name, Ganhos }));
    }, [payments]);

    const earningsByClient = useMemo(() => {
        const data = {};
        payments.filter(p => p.status === 'pago').forEach(p => {
            const clientName = clients.find(c => c.id === p.clienteId)?.nome || 'Desconhecido';
            if(!data[clientName]) data[clientName] = 0;
            data[clientName] += p.valor;
        });
        return Object.entries(data).map(([name, Ganhos]) => ({ name, Ganhos }));
    }, [payments, clients]);
    
    const performanceData = [
        { name: 'Realizados', value: trainings.filter(t => t.status === 'concluido').length },
        { name: 'Planejados', value: trainings.filter(t => t.status !== 'concluido').length }
    ];
    const COLORS = ['#10b981', '#f59e0b'];

    const handleExport = () => {
        let csvContent = "data:text/csv;charset=utf-8,Cliente,Valor,Vencimento,Status,Data Pagamento\n";
        payments.forEach(p => {
            const clientName = clients.find(c => c.id === p.clienteId)?.nome || '';
            csvContent += `${clientName.replace(',',';')},${p.valor},${p.data_vencimento},${p.status},${p.data_pagamento || ''}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "relatorio_pagamentos.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div><h1 className="text-3xl font-bold text-gray-800">Relatórios</h1><p className="text-gray-500">Analise seu desempenho.</p></div>
                <button onClick={handleExport} className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition-colors">Exportar CSV</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md"><h2 className="text-xl font-bold text-gray-800 mb-4">Ganhos Mensais</h2><div style={{ width: '100%', height: 300 }}><ResponsiveContainer><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(v) => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} /><Legend /><Bar dataKey="Ganhos" fill="#4f46e5" /></BarChart></ResponsiveContainer></div></div>
                <div className="bg-white p-6 rounded-xl shadow-md"><h2 className="text-xl font-bold text-gray-800 mb-4">Treinos Realizados vs. Planejados</h2><div style={{width: '100%', height: 300}}><ResponsiveContainer><PieChart><Pie data={performanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>{performanceData.map((e, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></div>
                <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2"><h2 className="text-xl font-bold text-gray-800 mb-4">Ganhos por Cliente</h2><div style={{ width: '100%', height: 300 }}><ResponsiveContainer><BarChart data={earningsByClient} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="name" width={80} /><Tooltip formatter={(v) => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} /><Legend /><Bar dataKey="Ganhos" fill="#10b981" /></BarChart></ResponsiveContainer></div></div>
            </div>
        </div>
    )
};

const Sidebar = ({ currentPage, setCurrentPage, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home }, { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'agenda', label: 'Agenda', icon: Calendar }, { id: 'pagamentos', label: 'Pagamentos', icon: DollarSign },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart2 },
  ];
  return (
    <aside className="w-16 hover:w-64 transition-all duration-300 bg-gray-900 text-white flex-col min-h-screen group hidden sm:flex fixed sm:relative z-30">
        <div className="p-4 text-center border-b border-gray-700 h-20 flex items-center justify-center"><h2 className="text-2xl font-bold tracking-wider transition-opacity opacity-0 group-hover:opacity-100 duration-200">PRO</h2></div>
        <nav className="flex-1 mt-6"><ul className="space-y-2">
          {navItems.map(item => (<li key={item.id} className="px-4"><button onClick={() => setCurrentPage(item.id)} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors justify-center sm:justify-start ${currentPage === item.id ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}><item.icon size={20} /><span className="font-semibold transition-opacity opacity-0 group-hover:opacity-100 delay-150 duration-200 whitespace-nowrap">{item.label}</span></button></li>))}
        </ul></nav>
        <div className="p-4 border-t border-gray-700"><button onClick={onLogout} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors justify-center sm:justify-start"><LogOut size={20} /><span className="font-semibold transition-opacity opacity-0 group-hover:opacity-100 delay-150 duration-200">Sair</span></button></div>
    </aside>
  );
}

const BottomNavBar = ({ currentPage, setCurrentPage }) => {
    const navItems = [ { id: 'dashboard', label: 'Início', icon: Home }, { id: 'clients', label: 'Clientes', icon: Users }, { id: 'agenda', label: 'Agenda', icon: Calendar }, { id: 'pagamentos', label: 'Ganhos', icon: DollarSign } ];
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg sm:hidden z-30"><div className="flex justify-around">{navItems.map(item => (<button key={item.id} onClick={() => setCurrentPage(item.id)} className={`flex-1 flex flex-col items-center p-2 transition-colors ${currentPage === item.id ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'}`}><item.icon size={24} /><span className="text-xs mt-1">{item.label}</span></button>))}</div></nav>
    );
};

// --- COMPONENTE PRINCIPAL (APP) ---
export default function App() {
  const [authState, setAuthState] = useState('landing'); // landing, loggedOut, loggedIn
  const [authPage, setAuthPage] = useState('login'); // login, register
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const [users, setUsers] = useState(initialData.users);
  const [clients, setClients] = useState(initialData.clients);
  const [trainings, setTrainings] = useState(initialData.trainings);
  const [payments, setPayments] = useState(initialData.payments);
  
  useEffect(() => { const handleResize = () => setIsMobile(window.innerWidth < 640); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []);
  
  const showToast = (message, type) => setToast({ message, type });

  const handleLogin = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) { setUser(foundUser); setAuthState('loggedIn'); showToast("Login realizado com sucesso!", "success"); } 
    else { showToast("E-mail ou senha inválidos.", "error"); }
  };
  
  const handleRegister = (name, email, password) => {
    if (users.find(u => u.email === email)) { showToast("Este e-mail já está em uso.", "error"); return; }
    const newUser = { id: users.length + 1, nome: name, email, password };
    setUsers([...users, newUser]);
    setUser(newUser);
    setAuthState('loggedIn');
    showToast("Conta criada com sucesso! Bem-vindo(a).", "success");
  }

  const handleLogout = () => { setUser(null); setAuthState('landing'); };

  if (authState === 'landing') return <LandingPage setAuthState={setAuthState} setAuthPage={setAuthPage} />;
  
  if (authState === 'loggedOut') return (<><AuthPage onLogin={handleLogin} onRegister={handleRegister} setAuthPage={setAuthPage} authPage={authPage} showToast={showToast} /><Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} /></>);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage user={user} clients={clients} trainings={trainings} payments={payments} setCurrentPage={setCurrentPage} />;
      case 'clients': return <ClientsPage clients={clients} setClients={setClients} trainings={trainings} payments={payments} showToast={showToast} />;
      case 'agenda': return <AgendaPage trainings={trainings} clients={clients} setTrainings={setTrainings} payments={payments} showToast={showToast} />;
      case 'pagamentos': return <PagamentosPage payments={payments} clients={clients} setPayments={setPayments} showToast={showToast} />;
      case 'relatorios': return <RelatoriosPage payments={payments} trainings={trainings} clients={clients} />;
      default: return <DashboardPage user={user} clients={clients} trainings={trainings} payments={payments} setCurrentPage={setCurrentPage} />;
    }
  };
  
  return (
    <div className="flex bg-gray-100 min-h-screen font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
      <main className={`flex-1 p-4 sm:p-8 overflow-y-auto ${isMobile ? 'pb-20' : 'sm:ml-16'}`}>
        {renderPage()}
      </main>
      {isMobile && <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); body { font-family: 'Inter', sans-serif; } .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; } @keyframes fadeInUp { from { opacity: 0; transform: translate3d(0, 20px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }`}</style>
    </div>
  );
}


