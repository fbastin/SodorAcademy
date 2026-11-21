import React, { useState } from 'react';
import { User as UserIcon, Lock, Mail, Upload, CheckCircle, Shield } from 'lucide-react';
import { apiService, User } from '../services/apiService';
import { useLang } from '../i18n';
import { Engine } from '../components/ui';

// Logging in is optional: without an account the Academy keeps progress in the
// browser. An account (a name, a PIN and a parent's email) keeps it on the server.

const S = {
  en: {
    login_title: 'Log in', register_title: 'Create an account',
    login_sub: 'Find your progress on any device.', register_sub: 'A name, a simple PIN and a parent’s email.',
    name: 'Child’s name', email: 'Parent’s email', pin: 'Simple PIN or password',
    forgot: 'Forgot the PIN?', working: 'Just a moment…', login: 'Log in', register: 'Create the account',
    to_register: 'New here? Create an account', to_login: 'Already have an account? Log in',
    or: 'or', restore: 'Restore from a backup file', bad_file: 'This file is not a Sodor Academy backup.',
    back: '← Keep exploring without an account',
    check_title: 'Check the email', check_sub: (e: string) => `A 6-digit code was sent to ${e}.`,
    code: '6-digit code', validate: 'Validate the account', back_login: '← Back to log in',
    recover_title: 'Recover the account', recover_sub1: 'Enter the name and the email to receive a code.',
    recover_sub2: 'Enter the code and the new PIN.', send_code: 'Send the code', new_pin: 'New PIN', reset: 'Change the PIN',
    done_title: 'PIN changed!', done_sub: 'You can now log in with the new PIN.', cancel: '← Cancel',
  },
  fr: {
    login_title: 'Se connecter', register_title: 'Créer un compte',
    login_sub: 'Pour retrouver ta progression sur tous tes appareils.', register_sub: 'Un prénom, un code simple et le courriel d’un parent.',
    name: 'Prénom de l’enfant', email: 'Courriel d’un parent', pin: 'Code simple ou mot de passe',
    forgot: 'Code oublié ?', working: 'Un instant…', login: 'Se connecter', register: 'Créer le compte',
    to_register: 'Nouveau ? Crée un compte', to_login: 'Déjà un compte ? Connecte-toi',
    or: 'ou', restore: 'Restaurer une sauvegarde', bad_file: 'Ce fichier n’est pas une sauvegarde de Sodor Academy.',
    back: '← Continuer sans compte',
    check_title: 'Vérifie le courriel', check_sub: (e: string) => `Un code à 6 chiffres a été envoyé à ${e}.`,
    code: 'Code à 6 chiffres', validate: 'Valider le compte', back_login: '← Retour à la connexion',
    recover_title: 'Retrouver le compte', recover_sub1: 'Entre le prénom et le courriel pour recevoir un code.',
    recover_sub2: 'Entre le code et le nouveau code d’accès.', send_code: 'Envoyer le code', new_pin: 'Nouveau code', reset: 'Changer le code',
    done_title: 'Code changé !', done_sub: 'Tu peux te connecter avec le nouveau code.', cancel: '← Annuler',
  },
};

function useS() {
  const { lang } = useLang();
  return S[lang];
}

const inputCls = 'w-full pl-11 pr-4 py-3 bg-white rounded-xl border-[2.5px] border-ink shadow-[inset_0_3px_0_rgba(23,35,61,.08)] font-semibold outline-none focus-visible:outline-3 focus-visible:outline-[#2464d6]';

function Field({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="relative block">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/50" aria-hidden="true">{icon}</span>
      <input {...props} aria-label={props.placeholder} className={inputCls} />
    </label>
  );
}

function Shell({ icon, title, sub, children }: { icon: React.ReactNode; title: string; sub: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="card-ink p-6 sm:p-9 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-2xl bg-sky border-[2.5px] border-ink shadow-[0_4px_0_#17233d] flex items-center justify-center mx-auto mb-5">
          {icon}
        </div>
        <h1 className="text-3xl font-extrabold mb-1">{title}</h1>
        <p className="text-ink/65 mb-6">{sub}</p>
        {children}
      </div>
    </div>
  );
}

const Err = ({ text }: { text: string }) => text ? <p role="alert" className="text-bad font-bold text-sm">{text}</p> : null;

export function LoginView({ onLogin, onShowValidation, onShowRecovery, onBack }: {
  onLogin: (user: User, token: string, isNewUser: boolean) => void;
  onShowValidation: (name: string, email: string) => void;
  onShowRecovery: () => void;
  onBack: () => void;
}) {
  const s = useS();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        await apiService.register(name, pin, email);
        onShowValidation(name, email);
      } else {
        const user = await apiService.login(name, pin);
        onLogin(user, user.token!, false);
      }
    } catch (err: any) {
      if (err.type === 'VALIDATION_REQUIRED') onShowValidation(err.userName || name, err.email);
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const user = await apiService.importData(data);
        onLogin(user, user.token!, false);
      } catch {
        setError(s.bad_file);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Shell icon={<Engine size={56} number="1" />} title={isRegistering ? s.register_title : s.login_title} sub={isRegistering ? s.register_sub : s.login_sub}>
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
        <Field icon={<UserIcon size={19} />} type="text" placeholder={s.name} value={name} onChange={e => setName(e.target.value)} required autoComplete="username" />
        {isRegistering && (
          <Field icon={<Mail size={19} />} type="email" placeholder={s.email} value={email} onChange={e => setEmail(e.target.value)} required />
        )}
        <Field icon={<Lock size={19} />} type="password" placeholder={s.pin} value={pin} onChange={e => setPin(e.target.value)} required autoComplete={isRegistering ? 'new-password' : 'current-password'} />
        {!isRegistering && (
          <div className="text-right">
            <button type="button" onClick={onShowRecovery} className="text-sm font-bold text-[#2464d6] hover:underline">{s.forgot}</button>
          </div>
        )}
        <Err text={error} />
        <button type="submit" disabled={loading} className="chunky blue big w-full">
          {loading ? s.working : (isRegistering ? s.register : s.login)}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3 items-center">
        <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="font-bold text-[#2464d6] hover:underline text-sm">
          {isRegistering ? s.to_login : s.to_register}
        </button>
        <div className="flex items-center gap-3 w-full text-ink/40 text-xs font-bold uppercase tracking-widest">
          <span className="h-0.5 flex-1 bg-ink/10" />{s.or}<span className="h-0.5 flex-1 bg-ink/10" />
        </div>
        <label className="chunky cursor-pointer text-sm">
          <Upload size={16} aria-hidden="true" /> {s.restore}
          <input type="file" accept=".json" onChange={handleImport} className="sr-only" />
        </label>
        <button onClick={onBack} className="mt-2 font-bold text-ink/70 hover:text-ink text-sm">{s.back}</button>
      </div>
    </Shell>
  );
}

export function ValidationView({ name, email, onValidated, onCancel }: {
  name: string;
  email: string;
  onValidated: () => void;
  onCancel: () => void;
}) {
  const s = useS();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiService.validateEmail(name, email, code);
      onValidated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell icon={<Mail size={44} />} title={s.check_title} sub={s.check_sub(email)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" inputMode="numeric" placeholder={s.code} aria-label={s.code} value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full text-center tracking-[0.6em] text-2xl py-3 bg-white rounded-xl border-[2.5px] border-ink font-extrabold outline-none"
          required
        />
        <Err text={error} />
        <button type="submit" disabled={loading || code.length !== 6} className="chunky blue big w-full">
          {loading ? s.working : s.validate}
        </button>
      </form>
      <button onClick={onCancel} className="mt-6 font-bold text-ink/70 hover:text-ink text-sm">{s.back_login}</button>
    </Shell>
  );
}

export function RecoveryView({ onCancel }: { onCancel: () => void }) {
  const s = useS();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const run = async (e: React.FormEvent, fn: () => Promise<void>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await fn(); } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  if (success) {
    return (
      <Shell icon={<CheckCircle size={44} className="text-good" />} title={s.done_title} sub={s.done_sub}>
        <button onClick={onCancel} className="chunky blue big w-full">{s.login}</button>
      </Shell>
    );
  }

  return (
    <Shell icon={<Shield size={44} />} title={s.recover_title} sub={step === 'request' ? s.recover_sub1 : s.recover_sub2}>
      <form
        onSubmit={e => run(e, step === 'request'
          ? async () => { await apiService.requestRecovery(name, email); setStep('reset'); }
          : async () => { await apiService.resetPin(name, email, code, newPin); setSuccess(true); })}
        className="space-y-3.5 text-left"
      >
        {step === 'request' && (
          <Field icon={<UserIcon size={19} />} type="text" placeholder={s.name} value={name} onChange={e => setName(e.target.value)} required />
        )}
        <Field icon={<Mail size={19} />} type="email" placeholder={s.email} value={email} onChange={e => setEmail(e.target.value)} disabled={step === 'reset'} required />
        {step === 'reset' && (
          <>
            <input
              type="text" inputMode="numeric" placeholder={s.code} aria-label={s.code} value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full text-center tracking-[0.4em] text-xl py-3 bg-white rounded-xl border-[2.5px] border-ink font-extrabold outline-none"
              required
            />
            <Field icon={<Lock size={19} />} type="password" placeholder={s.new_pin} value={newPin} onChange={e => setNewPin(e.target.value)} required autoComplete="new-password" />
          </>
        )}
        <Err text={error} />
        <button type="submit" disabled={loading} className="chunky blue big w-full">
          {loading ? s.working : (step === 'request' ? s.send_code : s.reset)}
        </button>
      </form>
      <button onClick={onCancel} className="mt-6 font-bold text-ink/70 hover:text-ink text-sm">{s.cancel}</button>
    </Shell>
  );
}
