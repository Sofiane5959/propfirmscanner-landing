'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Plus,
  Loader2,
  Shield,
  ChevronLeft,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MoreVertical,
  X,
} from 'lucide-react';

// =============================================================================
// LOCALE DETECTION & TRANSLATIONS
// =============================================================================

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return 'en';
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    backToDashboard: 'Back to Dashboard',
    myAccounts: 'My Accounts',
    manageAccounts: 'Manage all your prop firm challenge accounts',
    addAccount: 'Add Account',
    noAccountsYet: 'No accounts yet',
    startTracking: 'Start tracking your prop firm challenges by adding your first account.',
    addFirstAccount: 'Add First Account',
    comingSoon: 'Coming Soon',
    comingSoonDesc: 'Advanced account management is coming soon for Pro users.',
    // Table headers
    account: 'Account',
    firm: 'Firm',
    balance: 'Balance',
    pl: 'P/L',
    drawdown: 'Drawdown',
    actions: 'Actions',
    // Actions
    edit: 'Edit',
    delete: 'Delete',
    // Stats
    totalAccounts: 'Total Accounts',
    totalBalance: 'Total Balance',
    totalPL: 'Total P/L',
    avgPL: 'Avg. P/L %',
    // Delete modal
    deleteAccount: 'Delete Account',
    deleteConfirm: 'Are you sure you want to delete',
    deleteWarning: 'This action cannot be undone.',
    cancel: 'Cancel',
    deleting: 'Deleting...',
  },
  fr: {
    backToDashboard: 'Retour au Tableau de Bord',
    myAccounts: 'Mes Comptes',
    manageAccounts: 'Gérez tous vos comptes de challenge prop firm',
    addAccount: 'Ajouter un Compte',
    noAccountsYet: 'Aucun compte encore',
    startTracking: 'Commencez à suivre vos challenges en ajoutant votre premier compte.',
    addFirstAccount: 'Ajouter Premier Compte',
    comingSoon: 'Bientôt Disponible',
    comingSoonDesc: 'La gestion avancée des comptes arrive bientôt pour les utilisateurs Pro.',
    account: 'Compte',
    firm: 'Firm',
    balance: 'Solde',
    pl: 'P/L',
    drawdown: 'Drawdown',
    actions: 'Actions',
    edit: 'Modifier',
    delete: 'Supprimer',
    totalAccounts: 'Total Comptes',
    totalBalance: 'Solde Total',
    totalPL: 'P/L Total',
    avgPL: 'P/L Moy. %',
    deleteAccount: 'Supprimer le Compte',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer',
    deleteWarning: 'Cette action est irréversible.',
    cancel: 'Annuler',
    deleting: 'Suppression...',
  },
  de: {
    backToDashboard: 'Zurück zum Dashboard',
    myAccounts: 'Meine Konten',
    manageAccounts: 'Verwalten Sie alle Ihre Prop-Firm-Challenge-Konten',
    addAccount: 'Konto Hinzufügen',
    noAccountsYet: 'Noch keine Konten',
    startTracking: 'Beginnen Sie mit dem Tracking Ihrer Challenges, indem Sie Ihr erstes Konto hinzufügen.',
    addFirstAccount: 'Erstes Konto Hinzufügen',
    comingSoon: 'Demnächst Verfügbar',
    comingSoonDesc: 'Erweiterte Kontoverwaltung kommt bald für Pro-Benutzer.',
    account: 'Konto',
    firm: 'Firma',
    balance: 'Saldo',
    pl: 'G/V',
    drawdown: 'Drawdown',
    actions: 'Aktionen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    totalAccounts: 'Gesamt Konten',
    totalBalance: 'Gesamtsaldo',
    totalPL: 'Gesamt G/V',
    avgPL: 'Durchschn. G/V %',
    deleteAccount: 'Konto Löschen',
    deleteConfirm: 'Sind Sie sicher, dass Sie löschen möchten',
    deleteWarning: 'Diese Aktion kann nicht rückgängig gemacht werden.',
    cancel: 'Abbrechen',
    deleting: 'Wird gelöscht...',
  },
  es: {
    backToDashboard: 'Volver al Panel',
    myAccounts: 'Mis Cuentas',
    manageAccounts: 'Gestiona todas tus cuentas de desafíos prop firm',
    addAccount: 'Agregar Cuenta',
    noAccountsYet: 'Sin cuentas aún',
    startTracking: 'Comienza a rastrear tus desafíos agregando tu primera cuenta.',
    addFirstAccount: 'Agregar Primera Cuenta',
    comingSoon: 'Próximamente',
    comingSoonDesc: 'La gestión avanzada de cuentas llegará pronto para usuarios Pro.',
    account: 'Cuenta',
    firm: 'Firma',
    balance: 'Saldo',
    pl: 'G/P',
    drawdown: 'Drawdown',
    actions: 'Acciones',
    edit: 'Editar',
    delete: 'Eliminar',
    totalAccounts: 'Total Cuentas',
    totalBalance: 'Saldo Total',
    totalPL: 'G/P Total',
    avgPL: 'G/P Prom. %',
    deleteAccount: 'Eliminar Cuenta',
    deleteConfirm: '¿Estás seguro de que quieres eliminar',
    deleteWarning: 'Esta acción no se puede deshacer.',
    cancel: 'Cancelar',
    deleting: 'Eliminando...',
  },
  pt: {
    backToDashboard: 'Voltar ao Painel',
    myAccounts: 'Minhas Contas',
    manageAccounts: 'Gerencie todas as suas contas de desafios prop firm',
    addAccount: 'Adicionar Conta',
    noAccountsYet: 'Nenhuma conta ainda',
    startTracking: 'Comece a acompanhar seus desafios adicionando sua primeira conta.',
    addFirstAccount: 'Adicionar Primeira Conta',
    comingSoon: 'Em Breve',
    comingSoonDesc: 'Gerenciamento avançado de contas em breve para usuários Pro.',
    account: 'Conta',
    firm: 'Firma',
    balance: 'Saldo',
    pl: 'L/P',
    drawdown: 'Drawdown',
    actions: 'Ações',
    edit: 'Editar',
    delete: 'Excluir',
    totalAccounts: 'Total Contas',
    totalBalance: 'Saldo Total',
    totalPL: 'L/P Total',
    avgPL: 'L/P Méd. %',
    deleteAccount: 'Excluir Conta',
    deleteConfirm: 'Tem certeza que deseja excluir',
    deleteWarning: 'Esta ação não pode ser desfeita.',
    cancel: 'Cancelar',
    deleting: 'Excluindo...',
  },
  ar: {
    backToDashboard: 'العودة للوحة التحكم',
    myAccounts: 'حساباتي',
    manageAccounts: 'إدارة جميع حسابات تحديات شركات التداول',
    addAccount: 'إضافة حساب',
    noAccountsYet: 'لا توجد حسابات بعد',
    startTracking: 'ابدأ في تتبع تحدياتك بإضافة حسابك الأول.',
    addFirstAccount: 'إضافة أول حساب',
    comingSoon: 'قريباً',
    comingSoonDesc: 'إدارة الحسابات المتقدمة قادمة قريباً لمستخدمي Pro.',
    account: 'الحساب',
    firm: 'الشركة',
    balance: 'الرصيد',
    pl: 'الربح/الخسارة',
    drawdown: 'السحب',
    actions: 'الإجراءات',
    edit: 'تعديل',
    delete: 'حذف',
    totalAccounts: 'إجمالي الحسابات',
    totalBalance: 'إجمالي الرصيد',
    totalPL: 'إجمالي الربح/الخسارة',
    avgPL: 'متوسط الربح/الخسارة %',
    deleteAccount: 'حذف الحساب',
    deleteConfirm: 'هل أنت متأكد من حذف',
    deleteWarning: 'لا يمكن التراجع عن هذا الإجراء.',
    cancel: 'إلغاء',
    deleting: 'جاري الحذف...',
  },
  hi: {
    backToDashboard: 'डैशबोर्ड पर वापस',
    myAccounts: 'मेरे अकाउंट्स',
    manageAccounts: 'अपने सभी प्रॉप फर्म चैलेंज अकाउंट्स प्रबंधित करें',
    addAccount: 'अकाउंट जोड़ें',
    noAccountsYet: 'अभी कोई अकाउंट नहीं',
    startTracking: 'अपना पहला अकाउंट जोड़कर अपने चैलेंज ट्रैक करना शुरू करें।',
    addFirstAccount: 'पहला अकाउंट जोड़ें',
    comingSoon: 'जल्द आ रहा है',
    comingSoonDesc: 'Pro उपयोगकर्ताओं के लिए उन्नत अकाउंट प्रबंधन जल्द आ रहा है।',
    account: 'अकाउंट',
    firm: 'फर्म',
    balance: 'बैलेंस',
    pl: 'लाभ/हानि',
    drawdown: 'ड्रॉडाउन',
    actions: 'कार्रवाई',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    totalAccounts: 'कुल अकाउंट्स',
    totalBalance: 'कुल बैलेंस',
    totalPL: 'कुल लाभ/हानि',
    avgPL: 'औसत लाभ/हानि %',
    deleteAccount: 'अकाउंट हटाएं',
    deleteConfirm: 'क्या आप वाकई हटाना चाहते हैं',
    deleteWarning: 'यह क्रिया पूर्ववत नहीं की जा सकती।',
    cancel: 'रद्द करें',
    deleting: 'हटाया जा रहा है...',
  },
};


interface Account {
  id: string;
  account_name: string;
  firm_name: string;
  initial_balance: number;
  current_balance: number;
  max_drawdown: number;
  daily_loss_limit: number;
  profit_target: number;
  current_daily_loss: number;
  challenge_end_date: string | null;
  created_at: string;
}

export default function AccountsListPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];
  
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('challenge_accounts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setAccounts(data || []);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoadingAccounts(false);
      }
    };

    if (user) {
      fetchAccounts();
    }
  }, [user, supabase]);

  // Delete account
  const handleDelete = async () => {
    if (!accountToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('challenge_accounts')
        .delete()
        .eq('id', accountToDelete.id);
      
      if (error) throw error;
      
      setAccounts(accounts.filter(a => a.id !== accountToDelete.id));
      setDeleteModalOpen(false);
      setAccountToDelete(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.backToDashboard}
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              {t.myAccounts}
            </h1>
            <p className="text-gray-400 mt-1">
              {t.manageAccounts}
            </p>
          </div>
          <Link
            href={`/${locale}/dashboard/accounts/new`}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t.addAccount}
          </Link>
        </div>

        {/* Accounts List */}
        {loadingAccounts ? (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-12 text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{t.noAccountsYet}</h2>
            <p className="text-gray-400 mb-6">
              {t.startTracking}
            </p>
            <Link
              href={`/${locale}/dashboard/accounts/new`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t.addFirstAccount}
            </Link>
          </div>
        ) : (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="text-left p-4 text-gray-400 font-medium">{t.account}</th>
                  <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">{t.firm}</th>
                  <th className="text-right p-4 text-gray-400 font-medium">{t.balance}</th>
                  <th className="text-right p-4 text-gray-400 font-medium hidden sm:table-cell">{t.pl}</th>
                  <th className="text-right p-4 text-gray-400 font-medium hidden lg:table-cell">{t.drawdown}</th>
                  <th className="text-center p-4 text-gray-400 font-medium w-20">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const profit = account.current_balance - account.initial_balance;
                  const profitPercent = (profit / account.initial_balance) * 100;
                  const isProfit = profit >= 0;
                  
                  const maxDrawdownAmount = account.initial_balance * (account.max_drawdown / 100);
                  const currentDrawdown = Math.max(0, account.initial_balance - account.current_balance);
                  const drawdownPercent = maxDrawdownAmount > 0 ? (currentDrawdown / maxDrawdownAmount) * 100 : 0;
                  
                  return (
                    <tr key={account.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">{account.account_name}</p>
                          <p className="text-sm text-gray-500 md:hidden">{account.firm_name}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-gray-300">{account.firm_name}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-medium text-white">
                          ${account.current_balance.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 text-right hidden sm:table-cell">
                        <div className={`flex items-center justify-end gap-1 ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-medium">
                            {isProfit ? '+' : ''}{profitPercent.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right hidden lg:table-cell">
                        <div className={`flex items-center justify-end gap-1 ${
                          drawdownPercent >= 80 ? 'text-red-500' : 
                          drawdownPercent >= 50 ? 'text-yellow-500' : 'text-gray-400'
                        }`}>
                          {drawdownPercent >= 80 && <AlertTriangle className="w-4 h-4" />}
                          <span>{drawdownPercent.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="relative flex justify-center">
                          <button
                            onClick={() => setMenuOpen(menuOpen === account.id ? null : account.id)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                          
                          {menuOpen === account.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setMenuOpen(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                                <Link
                                  href={`/${locale}/dashboard/accounts/${account.id}/edit`}
                                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                                  onClick={() => setMenuOpen(null)}
                                >
                                  <Pencil className="w-4 h-4" />
                                  {t.edit}
                                </Link>
                                <button
                                  onClick={() => {
                                    setAccountToDelete(account);
                                    setDeleteModalOpen(true);
                                    setMenuOpen(null);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors w-full"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  {t.delete}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Summary */}
        {accounts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <p className="text-gray-400 text-sm">{t.totalAccounts}</p>
              <p className="text-2xl font-bold text-white">{accounts.length}</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <p className="text-gray-400 text-sm">{t.totalBalance}</p>
              <p className="text-2xl font-bold text-white">
                ${accounts.reduce((sum, a) => sum + a.current_balance, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <p className="text-gray-400 text-sm">{t.totalPL}</p>
              {(() => {
                const totalPL = accounts.reduce((sum, a) => sum + (a.current_balance - a.initial_balance), 0);
                return (
                  <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString()}
                  </p>
                );
              })()}
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <p className="text-gray-400 text-sm">{t.avgPL}</p>
              {(() => {
                const avgPL = accounts.reduce((sum, a) => {
                  return sum + ((a.current_balance - a.initial_balance) / a.initial_balance * 100);
                }, 0) / accounts.length;
                return (
                  <p className={`text-2xl font-bold ${avgPL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {avgPL >= 0 ? '+' : ''}{avgPL.toFixed(1)}%
                  </p>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && accountToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteModalOpen(false)} />
          <div className="relative bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{t.deleteAccount}</h2>
              <p className="text-gray-400 mb-6">
                {t.deleteConfirm} <strong className="text-white">{accountToDelete.account_name}</strong>? 
                {t.deleteWarning}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.deleting}
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      {t.delete}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
