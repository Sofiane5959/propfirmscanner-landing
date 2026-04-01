"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];
function getLocaleFromPath(pathname: string): Locale {
  const s = pathname.split('/')[1];
  return locales.includes(s as Locale) ? (s as Locale) : 'en';
}

interface Challenge {
  id: string;
  name: string;
  account_size: number;
  steps: string;
  max_drawdown: number;
  max_daily_loss: number;
  phase1_profit_target: number;
  phase2_profit_target: number | null;
  price: number;
  discounted_price: number | null;
  consistency_rule: string | null;
}

// All fields stored as strings to allow free typing
interface FormData {
  account_name: string;
  firm_name: string;
  initial_balance: string;
  challenge_end_date: string;
  max_drawdown: string;
  daily_loss_limit: string;
  profit_target: string;
  current_balance: string;
  current_daily_loss: string;
}

const defaultForm: FormData = {
  account_name: "",
  firm_name: "",
  initial_balance: "",
  challenge_end_date: "",
  max_drawdown: "",
  daily_loss_limit: "",
  profit_target: "",
  current_balance: "",
  current_daily_loss: "0",
};

export default function NewAccountPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const supabase = createClientComponentClient();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firmNames, setFirmNames] = useState<string[]>([]);
  const [accountSizes, setAccountSizes] = useState<number[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [loadingFirms, setLoadingFirms] = useState(true);

  // Load firms on mount
  useEffect(() => {
    async function loadFirms() {
      const { data } = await supabase
        .from("prop_firm_challenges")
        .select("firm_name")
        .order("firm_name");
      if (data) {
        const unique = Array.from(new Set(data.map((d: any) => d.firm_name))).sort() as string[];
        setFirmNames(unique);
      }
      setLoadingFirms(false);
    }
    loadFirms();
  }, []);

  // Load account sizes when firm changes
  useEffect(() => {
    if (!form.firm_name || form.firm_name === "__other__") return;
    async function loadSizes() {
      const { data } = await supabase
        .from("prop_firm_challenges")
        .select("account_size")
        .eq("firm_name", form.firm_name);
      if (data) {
        const unique = Array.from(new Set(data.map((d: any) => d.account_size))).sort((a: any, b: any) => a - b) as number[];
        setAccountSizes(unique);
      }
    }
    loadSizes();
  }, [form.firm_name]);

  // Load challenges when firm + size selected
  useEffect(() => {
    if (!form.firm_name || !form.initial_balance || form.firm_name === "__other__") return;
    async function loadChallenges() {
      const { data } = await supabase
        .from("prop_firm_challenges")
        .select("*")
        .eq("firm_name", form.firm_name)
        .eq("account_size", Number(form.initial_balance))
        .order("steps");
      if (data) setChallenges(data);
    }
    loadChallenges();
  }, [form.firm_name, form.initial_balance]);

  const handleFirmChange = (firmName: string) => {
    setForm({ ...defaultForm, firm_name: firmName, account_name: form.account_name });
    setAccountSizes([]);
    setChallenges([]);
    setSelectedChallenge(null);
  };

  const handleChallengeSelect = (c: Challenge) => {
    setSelectedChallenge(c);
    setForm((prev) => ({
      ...prev,
      max_drawdown: String(c.max_drawdown ?? ""),
      daily_loss_limit: String(c.max_daily_loss ?? "0"),
      profit_target: String(c.phase1_profit_target ?? ""),
    }));
  };

  // Store everything as string — conversion only happens at submit
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error: dbError } = await supabase.from("challenge_accounts").insert({
        user_id: user.id,
        account_name: form.account_name,
        firm_name: form.firm_name,
        initial_balance: Number(form.initial_balance),
        current_balance: Number(form.current_balance) || Number(form.initial_balance),
        max_drawdown: Number(form.max_drawdown),
        daily_loss_limit: Number(form.daily_loss_limit),
        profit_target: Number(form.profit_target),
        current_daily_loss: Number(form.current_daily_loss) || 0,
        challenge_end_date: form.challenge_end_date || null,
      });
      if (dbError) throw dbError;
      router.push(`/${locale}/dashboard?added=true`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const canGoNext = () => {
    if (step === 1) return form.account_name.trim() !== "" && form.firm_name !== "" && form.initial_balance !== "";
    if (step === 2) return form.max_drawdown !== "" && form.profit_target !== "";
    return true;
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
            s === step ? "bg-blue-600 text-white ring-4 ring-blue-600/20"
            : s < step ? "bg-green-500 text-white"
            : "bg-gray-700 text-gray-400"
          }`}>
            {s < step ? "✓" : s}
          </div>
          {s < 3 && <div className={`w-12 h-0.5 ${s < step ? "bg-green-500" : "bg-gray-700"}`} />}
        </div>
      ))}
    </div>
  );

  const Step1 = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Account Name</label>
        <input
          type="text" name="account_name" value={form.account_name}
          onChange={handleChange} placeholder="e.g. FTMO 100K Phase 1"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Prop Firm
          <span className="ml-2 text-xs text-gray-500">— {firmNames.length} firms, 764 real challenges</span>
        </label>
        <select
          name="firm_name" value={form.firm_name}
          onChange={(e) => handleFirmChange(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">{loadingFirms ? "Loading…" : "Select a firm…"}</option>
          {firmNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
          <option value="__other__">Other (manual entry)</option>
        </select>
      </div>

      {form.firm_name && form.firm_name !== "__other__" && accountSizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Account Size</label>
          <select
            name="initial_balance" value={form.initial_balance}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select size…</option>
            {accountSizes.map((size) => (
              <option key={size} value={String(size)}>${size.toLocaleString()}</option>
            ))}
          </select>
        </div>
      )}

      {form.firm_name === "__other__" && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Initial Balance</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              name="initial_balance"
              value={form.initial_balance}
              onChange={handleChange}
              placeholder="100000"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-8 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Challenge End Date <span className="text-xs text-gray-500">(optional)</span>
        </label>
        <input
          type="date"
          name="challenge_end_date"
          value={form.challenge_end_date}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition [color-scheme:dark]"
        />
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-5">
      {challenges.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Challenge Type
            <span className="ml-2 text-xs text-gray-500">— auto-fills rules</span>
          </label>
          <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
            {challenges.map((c) => (
              <button
                key={c.id}
                onClick={() => handleChallengeSelect(c)}
                className={`text-left px-4 py-3 rounded-lg border transition text-sm ${
                  selectedChallenge?.id === c.id
                    ? "border-blue-500 bg-blue-900/30 text-white"
                    : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
                }`}
              >
                <div className="font-medium truncate">{c.name}</div>
                <div className="text-xs text-gray-400 mt-0.5 flex gap-3">
                  <span>{c.steps.replace("_", "-")}</span>
                  <span>DD {c.max_drawdown}%</span>
                  <span>Daily {c.max_daily_loss ?? "—"}%</span>
                  <span>Target {c.phase1_profit_target}%</span>
                  {(c.discounted_price || c.price) && (
                    <span className="text-green-400">${c.discounted_price ?? c.price}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedChallenge && (
        <div className="bg-green-900/20 border border-green-700/40 rounded-lg px-4 py-2 text-xs text-green-400">
          ✓ Rules auto-filled from propfirmmatch.com real data
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Max Total Drawdown <span className="text-xs text-gray-500">%</span>
        </label>
        <input
          type="text" inputMode="decimal" name="max_drawdown" value={form.max_drawdown}
          onChange={handleChange} placeholder="10"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Daily Loss Limit <span className="text-xs text-gray-500">% (0 = no limit)</span>
        </label>
        <input
          type="text" inputMode="decimal" name="daily_loss_limit" value={form.daily_loss_limit}
          onChange={handleChange} placeholder="5"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Profit Target <span className="text-xs text-gray-500">% phase 1</span>
        </label>
        <input
          type="text" inputMode="decimal" name="profit_target" value={form.profit_target}
          onChange={handleChange} placeholder="10"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Current Balance <span className="text-xs text-gray-500">(blank = starting balance)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            name="current_balance"
            value={form.current_balance}
            onChange={handleChange}
            placeholder={form.initial_balance || "100000"}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-8 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Today&apos;s Loss So Far <span className="text-xs text-gray-500">$</span>
        </label>
        <input
          type="text"
          inputMode="numeric"
          name="current_daily_loss"
          value={form.current_daily_loss}
          onChange={handleChange}
          placeholder="0"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-700/50 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="bg-gray-800/60 rounded-lg p-4 text-sm space-y-1.5">
        <p className="font-medium text-gray-300 mb-2">Summary</p>
        {[
          ["Firm", form.firm_name],
          ["Account", form.account_name],
          ["Balance", `$${Number(form.initial_balance || 0).toLocaleString()}`],
          ["Max Drawdown", `${form.max_drawdown}%`],
          ["Daily Loss", !form.daily_loss_limit || form.daily_loss_limit === "0" ? "No limit" : `${form.daily_loss_limit}%`],
          ["Profit Target", `${form.profit_target}%`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between text-gray-400">
            <span>{label}</span>
            <span className="text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const stepLabels = ["General Info", "Challenge Rules", "Current Metrics"];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Add Challenge Account</h1>
          <p className="text-gray-400 text-sm mt-1">{stepLabels[step - 1]}</p>
        </div>
        <StepIndicator />
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition font-medium"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canGoNext()}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold transition"
              >
                {loading ? "Saving…" : "Add Account"}
              </button>
            )}
          </div>
        </div>
        <div className="text-center mt-4">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-400 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
