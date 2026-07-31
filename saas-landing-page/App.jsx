import { useEffect, useState } from 'react';

const features = [
  ['Automate routine work', 'Connect your tools and turn repetitive processes into dependable workflows.'],
  ['See what matters', 'Track activity, bottlenecks, and results from one clear operational dashboard.'],
  ['Scale without chaos', 'Standardize delivery with reusable systems that stay easy to maintain.'],
];

const plans = [
  { name: 'Starter', price: '$19', note: 'For solo operators', items: ['3 workflows', 'Email support', 'Basic analytics'] },
  { name: 'Growth', price: '$49', note: 'For growing teams', items: ['Unlimited workflows', 'Priority support', 'Advanced analytics'], featured: true },
  { name: 'Scale', price: '$99', note: 'For larger operations', items: ['SSO and controls', 'Dedicated onboarding', 'Custom reporting'] },
];

function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-pressed={dark}
      aria-label="Toggle dark mode"
    >
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  function submitContact(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();

    if (!/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
      setStatus('error');
      return;
    }

    setStatus('success');
    event.currentTarget.reset();
  }

  return (
    <div className="min-h-screen bg-white text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#top" className="text-lg font-black tracking-tight">FlowPilot</a>
          <nav className="hidden gap-7 text-sm font-medium md:flex" aria-label="Primary navigation">
            <a className="hover:text-indigo-600" href="#features">Features</a>
            <a className="hover:text-indigo-600" href="#pricing">Pricing</a>
            <a className="hover:text-indigo-600" href="#contact">Contact</a>
          </nav>
          <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_35%)]" />
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
              Operations that run themselves
            </p>
            <h1 className="text-balance text-5xl font-black tracking-tight sm:text-7xl">
              Move faster without adding more busywork.
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              FlowPilot connects your tools, automates repetitive workflows, and gives your team a clear view of what needs attention.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="#contact" className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Start free
              </a>
              <a href="#features" className="rounded-xl border border-slate-300 px-6 py-3 font-bold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900">
                Explore features
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-500">No credit card required. Cancel anytime.</p>
          </div>
        </section>

        <section id="features" className="border-y border-slate-200 bg-slate-50 px-6 py-24 dark:border-slate-800 dark:bg-slate-900/40 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="font-bold text-indigo-600">Built for clarity</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">A simpler operating system for your team.</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map(([title, description], index) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-indigo-100 font-black text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{index + 1}</div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="font-bold text-indigo-600">Trusted workflow</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">One place to see progress and act.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Replace scattered status checks with live operational visibility. Every workflow keeps a clear history, owner, and next action.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-4">
                {[['42%', 'less admin'], ['3.1×', 'faster delivery'], ['99.9%', 'workflow uptime']].map(([value, label]) => (
                  <div key={label}>
                    <dt className="text-2xl font-black">{value}</dt>
                    <dd className="text-sm text-slate-500">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 shadow-2xl dark:border-slate-800">
              <div className="rounded-2xl bg-slate-900 p-6 text-white">
                <div className="flex items-center justify-between">
                  <p className="font-bold">Live operations</p>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">All systems normal</span>
                </div>
                <div className="mt-6 space-y-3">
                  {['Lead qualification', 'Client onboarding', 'Weekly reporting'].map((item, index) => (
                    <div key={item} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                      <div>
                        <p className="font-semibold">{item}</p>
                        <p className="mt-1 text-xs text-slate-400">Last run {index + 2} minutes ago</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-300">Completed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-slate-50 px-6 py-24 dark:bg-slate-900/40 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-4xl font-black tracking-tight">Straightforward pricing</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Start small and upgrade only when the extra capacity matters.</p>
            <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
              {plans.map((plan) => (
                <article key={plan.name} className={`relative rounded-2xl border p-7 ${plan.featured ? 'border-indigo-500 bg-white shadow-xl dark:bg-slate-950' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'}`}>
                  {plan.featured && <span className="absolute right-5 top-5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Most popular</span>}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">{plan.note}</p>
                  <p className="mt-6 text-4xl font-black">{plan.price}<span className="text-base font-medium text-slate-500"> / month</span></p>
                  <ul className="mt-7 space-y-3 text-sm">
                    {plan.items.map((item) => <li key={item}>✓ {item}</li>)}
                  </ul>
                  <a href="#contact" className={`mt-8 block rounded-xl px-5 py-3 text-center font-bold ${plan.featured ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900'}`}>
                    Choose {plan.name}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-6 py-24 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-12 rounded-3xl bg-slate-950 p-8 text-white sm:p-12 lg:grid-cols-2">
            <div>
              <p className="font-bold text-indigo-300">Talk to us</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">See how FlowPilot fits your workflow.</h2>
              <p className="mt-5 leading-7 text-slate-300">Share what you want to automate. We will respond with a practical starting point.</p>
            </div>
            <form onSubmit={submitContact} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold">Work email</label>
                <input id="email" name="email" type="email" required className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30" placeholder="you@company.com" />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-bold">What would you like to automate?</label>
                <textarea id="message" name="message" minLength={10} required rows={4} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30" placeholder="Describe the workflow or problem." />
              </div>
              <button type="submit" className="w-full rounded-xl bg-indigo-500 px-5 py-3 font-bold transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300">Send request</button>
              {status === 'error' && <p role="alert" className="text-sm text-rose-300">Enter a valid email and at least 10 characters.</p>}
              {status === 'success' && <p role="status" className="text-sm text-emerald-300">Thanks. Your request has been recorded.</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-6 py-8 text-sm text-slate-500 dark:border-slate-800 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row">
          <p>© 2026 FlowPilot. All rights reserved.</p>
          <div className="flex gap-5"><a href="#top">Privacy</a><a href="#top">Terms</a></div>
        </div>
      </footer>
    </div>
  );
}
