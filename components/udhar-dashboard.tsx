'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import {
  ArrowDownLeft, ArrowUpRight, Check, ChevronRight, CircleHelp, HandCoins,
  LayoutDashboard, LogOut, Menu, Plus, Search, ShieldCheck, Users, Wallet, X,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'

type Customer = { id: string; user_id: string; name: string; phone: string | null; created_at: string }
type Entry = { id: string; customer_id: string; user_id: string; type: 'credit' | 'payment'; amount: number; note: string | null; transaction_date: string; created_at: string }
type LedgerRow = Entry & { balance: number }
type ModalKind = 'customer' | 'credit' | 'payment' | null

const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const money = (amount: number) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
const prettyDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export function UdharDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shopName, setShopName] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'due' | 'settled'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalKind>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [mobileNav, setMobileNav] = useState(false)

  const balances = useMemo(() => {
    const map = new Map<string, number>()
    for (const entry of entries) map.set(entry.customer_id, (map.get(entry.customer_id) ?? 0) + (entry.type === 'credit' ? Number(entry.amount) : -Number(entry.amount)))
    return map
  }, [entries])
  const totalDue = customers.reduce((sum, customer) => sum + Math.max(0, balances.get(customer.id) ?? 0), 0)
  const activeCount = customers.filter((customer) => (balances.get(customer.id) ?? 0) > 0).length
  const selectedCustomer = customers.find((customer) => customer.id === selectedId) ?? null
  const customerEntries = useMemo(() => entries.filter((entry) => entry.customer_id === selectedId).sort((a, b) => a.transaction_date.localeCompare(b.transaction_date) || a.created_at.localeCompare(b.created_at)), [entries, selectedId])
  const ledgerRows = useMemo(() => {
    let running = 0
    return customerEntries.map((entry) => {
      running += entry.type === 'credit' ? Number(entry.amount) : -Number(entry.amount)
      return { ...entry, balance: running }
    })
  }, [customerEntries])
  const filteredCustomers = customers.filter((customer) => {
    const balance = balances.get(customer.id) ?? 0
    return customer.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()) &&
      (filter === 'all' || (filter === 'due' ? balance > 0 : balance <= 0))
  })
  const thisMonthCollected = entries.filter((entry) => entry.type === 'payment' && entry.transaction_date.slice(0, 7) === todayISO().slice(0, 7)).reduce((sum, entry) => sum + Number(entry.amount), 0)
  const todaysCredit = entries.filter((entry) => entry.type === 'credit' && entry.transaction_date === todayISO()).reduce((sum, entry) => sum + Number(entry.amount), 0)
  const todaysPayments = entries.filter((entry) => entry.type === 'payment' && entry.transaction_date === todayISO()).reduce((sum, entry) => sum + Number(entry.amount), 0)

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const supabase = getSupabase()
      const [customerResult, entryResult] = await Promise.all([
        supabase.from('customers').select('id,user_id,name,phone,created_at').order('name'),
        supabase.from('transactions').select('id,customer_id,user_id,type,amount,note,transaction_date,created_at').order('transaction_date', { ascending: true }).order('created_at', { ascending: true }),
      ])
      if (customerResult.error) throw customerResult.error
      if (entryResult.error) throw entryResult.error
      setCustomers((customerResult.data ?? []) as Customer[])
      setEntries((entryResult.data ?? []) as Entry[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Data load nahi ho saka.')
    } finally { setLoading(false) }
  }, [user])

  useEffect(() => {
    let alive = true
    try {
      const supabase = getSupabase()
      supabase.auth.getSession().then(({ data, error: sessionError }) => {
        if (!alive) return
        if (sessionError) setError(sessionError.message)
        setUser(data.session?.user ?? null)
        setAuthReady(true)
      }).catch((e: unknown) => { if (alive) { setError(e instanceof Error ? e.message : 'Session load nahi hua.'); setAuthReady(true) } })
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
      return () => { alive = false; listener.subscription.unsubscribe() }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Supabase setup missing.')
      setAuthReady(true)
    }
  }, [])

  useEffect(() => { if (user) void loadData(); else { setCustomers([]); setEntries([]) } }, [user, loadData])

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setAuthBusy(true)
    try {
      const supabase = getSupabase()
      if (authMode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: { data: { shop_name: shopName.trim() } },
        })
        if (authError) throw authError
        if (!data.session) setNotice('Signup request bhej di gayi hai. Email inbox mein confirmation link check karein, phir login karein.')
        else setNotice('Account ban gaya. Apna pehla customer khata banayein.')
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (authError) throw authError
        setNotice('Login successful.')
      }
      setPassword('')
    } catch (e) { setError(e instanceof Error ? e.message : 'Login nahi ho saka.') }
    finally { setAuthBusy(false) }
  }

  async function signOut() {
    try { const { error: signOutError } = await getSupabase().auth.signOut(); if (signOutError) throw signOutError }
    catch (e) { setError(e instanceof Error ? e.message : 'Logout nahi ho saka.') }
  }

  function openModal(kind: ModalKind, forCustomer?: string) {
    setError(''); setSelectedId(null); setModal(kind); setCustomerId(forCustomer ?? '')
    setName(''); setPhone(''); setAmount(''); setDate(todayISO()); setNote('')
  }
  function closeModal() { setModal(null); setError('') }

  async function submitCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !name.trim()) return
    setBusy(true); setError('')
    try {
      const { data, error: insertError } = await getSupabase().from('customers').insert({
        user_id: user.id, name: name.trim(), phone: phone.trim() || null,
      }).select('id,user_id,name,phone,created_at').single()
      if (insertError) throw insertError
      setCustomers((current) => [...current, data as Customer].sort((a, b) => a.name.localeCompare(b.name)))
      setNotice(`${name.trim()} ka khata ban gaya.`); closeModal()
    } catch (e) { setError(e instanceof Error ? e.message : 'Customer save nahi hua.') }
    finally { setBusy(false) }
  }

  async function submitEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !customerId) { setError('Pehle customer chunein.'); return }
    const parsedAmount = Number(amount)
    if (!Number.isSafeInteger(parsedAmount) || parsedAmount <= 0) { setError('Rakam 1 ya usse zyada poore rupaye mein dalein.'); return }
    if (!date || date > todayISO()) { setError('Aane wali date par entry nahi kar sakte.'); return }
    const balanceOnDate = entries
      .filter((entry) => entry.customer_id === customerId && entry.transaction_date <= date)
      .reduce((sum, entry) => sum + (entry.type === 'credit' ? Number(entry.amount) : -Number(entry.amount)), 0)
    if (modal === 'payment' && parsedAmount > balanceOnDate) { setError(`Is tareekh tak sirf ${money(Math.max(0, balanceOnDate))} baaki hai. Isse zyada jama nahi kar sakte.`); return }
    setBusy(true); setError('')
    try {
      const type = modal === 'payment' ? 'payment' : 'credit'
      const { data, error: insertError } = await getSupabase().from('transactions').insert({
        user_id: user.id, customer_id: customerId, type, amount: parsedAmount,
        transaction_date: date, note: note.trim() || (type === 'credit' ? 'Udhar' : 'Jama rakam'),
      }).select('id,customer_id,user_id,type,amount,note,transaction_date,created_at').single()
      if (insertError) throw insertError
      setEntries((current) => [...current, data as Entry].sort((a, b) => a.transaction_date.localeCompare(b.transaction_date) || a.created_at.localeCompare(b.created_at)))
      setNotice(type === 'credit' ? 'Udhar khate mein darj ho gaya.' : 'Jama rakam darj ho gayi.')
      closeModal()
    } catch (e) { setError(e instanceof Error ? e.message : 'Transaction save nahi hua.') }
    finally { setBusy(false) }
  }

  if (!authReady) return <div className="auth-screen"><div className="auth-card"><HandCoins size={34} /><h1>ApnaKhata</h1><p>Secure khata load ho raha hai...</p></div></div>
  if (!user) return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={submitAuth}>
        <div className="auth-brand"><span className="brand-mark"><HandCoins size={22} /></span><span>Apna<span className="brand-light">Khata</span></span></div>
        <p className="auth-kicker">DUKAAN KA DIGITAL BAHI-KHATA</p>
        <h1>{authMode === 'login' ? 'Apni dukaan mein login karein' : 'Apni dukaan ka account banayein'}</h1>
        <p className="auth-copy">Aapke customers aur unka hisaab private aur secure rahega.</p>
        {authMode === 'signup' && <label>Dukaan ka naam<input required value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Jaise: Gupta General Store" /></label>}
        <label>Email address<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
        <label>Password<input required type="password" minLength={6} autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kam se kam 6 characters" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button auth-submit" disabled={authBusy}>{authBusy ? 'Please wait...' : authMode === 'login' ? 'Login karein' : 'Account banayein'}</button>
        <p className="auth-switch">{authMode === 'login' ? 'Naye dukandar hain?' : 'Pehle se account hai?'} <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError('') }}>{authMode === 'login' ? 'Sign up' : 'Login'}</button></p>
        <p className="auth-secure"><ShieldCheck size={14} /> Har dukaan ka data alag aur protected hai.</p>
        {notice && <p className="form-success">{notice}</p>}
      </form>
    </div>
  )

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><HandCoins size={21} /></div><span>Apna<span className="brand-light">Khata</span></span></div>
        <div className="shop-switch"><div className="shop-avatar">{(user.user_metadata?.shop_name || user.email || 'D').slice(0, 1).toUpperCase()}</div><div className="shop-name"><strong>{user.user_metadata?.shop_name || 'Meri dukaan'}</strong><span>{user.email}</span></div></div>
        <p className="nav-label">MENU</p>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="nav-item nav-active" href="#dashboard" onClick={() => setMobileNav(false)}><LayoutDashboard size={18} />Dashboard</a>
          <a className="nav-item" href="#customers" onClick={() => setMobileNav(false)}><Users size={18} />Grahak ke khate <span className="nav-count">{customers.length}</span></a>
          <a className="nav-item" href="#activity" onClick={() => setMobileNav(false)}><Wallet size={18} />Aaj ka len-den</a>
        </nav>
        <div className="sidebar-bottom"><div className="trust-card"><div className="trust-icon"><HandCoins size={18} /></div><strong>Hisaab, bilkul aasaan</strong><p>Har grahak ka udhar aur len-den ek jagah.</p><span>Supabase par secure data <ShieldCheck size={13} /></span></div><button className="nav-item logout-link" onClick={signOut}><LogOut size={17} />Logout</button><div className="profile"><div className="profile-avatar">{(user.email ?? 'D').slice(0, 1).toUpperCase()}</div><div><strong>{user.user_metadata?.shop_name || 'Dukaan maalik'}</strong><span>{user.email}</span></div></div></div>
      </aside>
      <main className="main-area" id="dashboard">
        <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Menu kholen" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div className="breadcrumb">Dukaan <ChevronRight size={15} /> <strong>Dashboard</strong></div></div><div className="top-actions"><span className="date-pill">{new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span><button className="help-button" onClick={() => setNotice('Khata banayein, customer chunein aur Udhar ya Jama entry darj karein.')}><CircleHelp size={17} />Madad</button></div></header>
        <div className="page-content">
          <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" />Aapki dukaan, aapka hisaab</div><h1>Namaste, {user.user_metadata?.shop_name || user.email?.split('@')[0]} ji</h1><p className="welcome-copy">Aaj ka udhar aur dukaan ka hisaab yahan dekhein.</p></div><button className="primary-button" onClick={() => openModal('credit')}><Plus size={18} />Udhar jodein</button></div>
          <div className="demo-notice"><ShieldCheck size={14} /><span>Real account: data aapke Supabase database mein save hota hai. Koi demo records nahi hain.</span><button onClick={() => void loadData()} disabled={loading}>{loading ? 'Load ho raha hai...' : 'Refresh'}</button></div>
          {error && <div className="inline-error" role="alert">{error}<button onClick={() => setError('')} aria-label="Error band karein"><X size={15} /></button></div>}
          <section className="stats-grid" aria-label="Dukaan ka saar">
            <article className="stat-card due-card"><div className="stat-top"><span className="stat-icon due-icon"><Wallet size={19} /></span></div><p className="stat-label">Kul baaki udhar</p><p className="stat-value">{money(totalDue)}</p><div className="stat-foot"><span>Sabhi customer khaton ka total</span></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon people-icon"><Users size={19} /></span></div><p className="stat-label">Udhar wale grahak</p><p className="stat-value">{activeCount}<span className="stat-unit"> grahak</span></p><div className="stat-foot"><span>{customers.length} total khate</span></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon paid-icon"><Check size={19} /></span></div><p className="stat-label">Is mahine jama hua</p><p className="stat-value">{money(thisMonthCollected)}</p><div className="stat-foot"><span>Is mahine ke payment records</span></div></article>
          </section>
          <section className="content-grid">
            <div className="panel customer-panel" id="customers"><div className="panel-heading"><div><div className="heading-title"><h2>Grahakon ke khate</h2><span className="count-badge">{customers.length}</span></div><p>Naam par click karke date-wise khata kholein.</p></div><button className="text-action" onClick={() => openModal('customer')}><Plus size={15} />Naya grahak</button></div>
              <div className="table-toolbar"><label className="search-field"><Search size={17} /><input aria-label="Naam se khata khojein" placeholder="Naam se khata khojein..." value={search} onChange={(e) => setSearch(e.target.value)} /><kbd>/</kbd></label><div className="filter-tabs">{(['all', 'due', 'settled'] as const).map((item) => <button key={item} className={filter === item ? 'filter-active' : ''} onClick={() => setFilter(item)}>{item === 'all' ? 'Sabhi' : item === 'due' ? 'Baaki hai' : 'Chukta'}</button>)}</div></div>
              <div className="customer-list"><div className="list-head"><span>Customer</span><span>Baaki rakam</span><span>Mobile</span><span /></div>
                {loading ? <div className="empty-state">Khate load ho rahe hain...</div> : filteredCustomers.length ? filteredCustomers.map((customer) => <div className="customer-row" key={customer.id}><button className="customer-identity" onClick={() => setSelectedId(customer.id)}><span className="customer-avatar sage">{customer.name.slice(0, 1).toUpperCase()}</span><span className="customer-meta"><strong>{customer.name}</strong><small>Khata kholein</small></span></button><div className="balance-cell"><strong className={(balances.get(customer.id) ?? 0) > 0 ? '' : 'zero-balance'}>{money(Math.max(0, balances.get(customer.id) ?? 0))}</strong>{(balances.get(customer.id) ?? 0) > 0 && <span className="due-tag">Baaki</span>}</div><span className="updated-cell">{customer.phone || '—'}</span><button className="row-action" aria-label={`${customer.name} ka khata kholen`} onClick={() => setSelectedId(customer.id)}><ChevronRight size={17} /></button></div>) : <div className="empty-state"><Search size={21} /><strong>{customers.length ? 'Koi khata nahi mila' : 'Abhi koi customer nahi hai'}</strong><span>{customers.length ? 'Doosra naam ya filter aazmaiye.' : 'Pehla customer jodne ke liye Naya grahak dabayein.'}</span></div>}
              </div><button className="view-all" onClick={() => { setFilter('all'); setSearch('') }}>Saare khate dekhein <ChevronRight size={15} /></button>
            </div>
            <aside className="right-column">
              <section className="panel quick-panel"><div className="side-panel-title"><div><h2>Jaldi kaam</h2><p>Roz ke kaam, jhatpat.</p></div></div>
                <button className="quick-action" onClick={() => openModal('credit')}><span className="quick-icon peach"><ArrowUpRight size={18} /></span><span><strong>Udhar darj karein</strong><small>Nayi baaki rakam jodein</small></span><ChevronRight size={17} /></button>
                <button className="quick-action" onClick={() => openModal('payment')}><span className="quick-icon mint"><ArrowDownLeft size={18} /></span><span><strong>Jama rakam lein</strong><small>Customer se payment darj karein</small></span><ChevronRight size={17} /></button>
                <button className="quick-action" onClick={() => openModal('customer')}><span className="quick-icon lavender"><Users size={18} /></span><span><strong>Naya grahak jodein</strong><small>Ek naya khata shuru karein</small></span><ChevronRight size={17} /></button>
                <div className="activity-summary"><div><span>Aaj udhar diya</span><strong className="activity-credit">{money(todaysCredit)}</strong></div><div><span>Aaj jama hua</span><strong className="activity-paid">{money(todaysPayments)}</strong></div></div>
              </section>
              <section className="panel activity-panel" id="activity"><div className="side-panel-title"><div><h2>Recent len-den</h2><p>Aapke latest records</p></div></div>
                <div className="activity-list">{entries.slice().sort((a, b) => b.transaction_date.localeCompare(a.transaction_date) || b.created_at.localeCompare(a.created_at)).slice(0, 6).map((entry) => { const customer = customers.find((item) => item.id === entry.customer_id); return <div className="activity-row" key={entry.id}><span className={`activity-mark ${entry.type}`} aria-hidden="true">{entry.type === 'credit' ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}</span><span className="activity-info"><strong>{customer?.name ?? 'Customer'}</strong><small>{entry.note || (entry.type === 'credit' ? 'Udhar' : 'Jama')} · {prettyDate(entry.transaction_date)}</small></span><strong className={entry.type === 'credit' ? 'activity-amount-credit' : 'activity-amount-paid'}>{entry.type === 'credit' ? '+' : '−'}{money(Number(entry.amount))}</strong></div> })}{!entries.length && <p className="no-history">Abhi koi len-den darj nahi hua.</p>}</div>
              </section>
            </aside>
          </section>
          <footer className="page-footer"><span>© 2026 ApnaKhata</span><span><ShieldCheck size={14} />Aapke khate, aapki nazar mein.</span><button onClick={signOut}><LogOut size={14} />Logout</button></footer>
        </div>
      </main>
      {mobileNav && <button className="nav-scrim" aria-label="Menu band karein" onClick={() => setMobileNav(false)} />}
      {notice && <div className="toast" role="status"><Check size={17} />{notice}<button aria-label="Band karein" onClick={() => setNotice('')}><X size={16} /></button></div>}
      {modal && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal() }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><span className="modal-kicker">APNA KHATA</span><h2 id="modal-title">{modal === 'customer' ? 'Naya grahak jodein' : modal === 'credit' ? 'Naya udhar darj karein' : 'Jama rakam darj karein'}</h2><p>{modal === 'customer' ? 'Grahak ki jaankari bhar kar khata banayein.' : 'Sahi khata chunein aur rakam bharein.'}</p></div><button className="icon-button" aria-label="Band karein" onClick={closeModal}><X size={19} /></button></div>
          {modal === 'customer' ? <form className="modal-form" onSubmit={submitCustomer}><label>Grahak ka naam<input autoFocus required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} placeholder="Grahak ka poora naam" /></label><label>Mobile number <span>(zaroori nahi)</span><input inputMode="numeric" maxLength={15} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile number" /></label>{error && <p className="form-error">{error}</p>}<div className="modal-actions"><button type="button" className="secondary-button" onClick={closeModal}>Radd karein</button><button className="primary-button" type="submit" disabled={busy}><Plus size={17} />{busy ? 'Save ho raha hai...' : 'Khata banayein'}</button></div></form> :
          <form className="modal-form" onSubmit={submitEntry}><label>Grahak chunein<select autoFocus required value={customerId} onChange={(e) => setCustomerId(e.target.value)}><option value="">Grahak ka naam chunein</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} {modal === 'payment' ? `— baaki ${money(Math.max(0, balances.get(customer.id) ?? 0))}` : ''}</option>)}</select></label><label>Rakam (₹)<input required type="number" min="1" step="1" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="500" /></label><label>Len-den ki tareekh<input required type="date" max={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} /></label><label>Vivaran <span>(zaroori nahi)</span><input maxLength={250} value={note} onChange={(e) => setNote(e.target.value)} placeholder={modal === 'credit' ? 'Jaise: Rashan ka samaan' : 'Jaise: Cash / UPI se jama'} /></label>{modal === 'payment' && customerId && <p className="payment-hint">Abhi baaki: {money(Math.max(0, balances.get(customerId) ?? 0))}. Jama rakam baaki se zyada nahi ho sakti.</p>}{error && <p className="form-error">{error}</p>}<div className="modal-actions"><button type="button" className="secondary-button" onClick={closeModal}>Radd karein</button><button className="primary-button" type="submit" disabled={busy || !customers.length}>{busy ? 'Save ho raha hai...' : modal === 'credit' ? 'Udhar jodein' : 'Payment darj karein'}</button></div></form>}
        </section></div>}
      {selectedCustomer && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedId(null) }}><section className="modal-card detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="modal-heading"><div><span className="modal-kicker">GRAHAK KA KHATA</span><h2 id="detail-title">{selectedCustomer.name}</h2><p>{selectedCustomer.phone || 'Mobile number nahi diya'}</p></div><button className="icon-button" aria-label="Band karein" onClick={() => setSelectedId(null)}><X size={19} /></button></div><div className="detail-balance"><span>Kul baaki rakam</span><strong>{money(Math.max(0, balances.get(selectedCustomer.id) ?? 0))}</strong></div><div className="detail-actions"><button className="primary-button" onClick={() => openModal('credit', selectedCustomer.id)}><Plus size={17} />Udhar jodein</button><button className="secondary-button" onClick={() => openModal('payment', selectedCustomer.id)}><Check size={17} />Payment lein</button></div><h3 className="detail-history-heading">Tareekh ke hisaab se len-den</h3><div className="ledger-table" role="table" aria-label={`${selectedCustomer.name} ka date-wise khata`}><div className="ledger-head" role="row"><span>Tareekh</span><span>Len-den</span><span>Rakam</span><span>Baaki</span></div>{ledgerRows.length ? ledgerRows.map((entry) => <div className="ledger-row" role="row" key={entry.id}><span className="ledger-date">{prettyDate(entry.transaction_date)}</span><span className="ledger-description"><strong>{entry.note || (entry.type === 'credit' ? 'Udhar' : 'Jama')}</strong><small>{entry.type === 'credit' ? 'Udhar chadha' : 'Rakam jama hui'}</small></span><b className={entry.type === 'credit' ? 'activity-amount-credit' : 'activity-amount-paid'}>{entry.type === 'credit' ? '+' : '−'}{money(Number(entry.amount))}</b><strong className="ledger-running">{money(entry.balance)}</strong></div>) : <p className="no-history">Abhi koi len-den nahi hua.</p>}</div></section></div>}
    </div>
  )
}
