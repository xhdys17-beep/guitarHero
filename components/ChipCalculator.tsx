
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Trash2, Calculator, Send, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Language } from '../types.ts';

interface Player {
  id: string;
  name: string;
  endingChips: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

const ChipCalculator: React.FC<{ onBack: () => void; lang: Language }> = ({ onBack, lang }) => {
  const [initialChips, setInitialChips] = useState<number | string>(1000);
  const [chipValue, setChipValue] = useState<number | string>(0.1);
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: '玩家 1', endingChips: 1000 },
    { id: '2', name: '玩家 2', endingChips: 1000 },
    { id: '3', name: '玩家 3', endingChips: 1000 },
  ]);
  const [copied, setCopied] = useState(false);

  const addPlayer = () => {
    setPlayers([...players, { id: Date.now().toString(), name: `玩家 ${players.length + 1}`, endingChips: Number(initialChips) || 0 }]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 2) return;
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers(players.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const numInitialChips = Number(initialChips) || 0;
  const numChipValue = Number(chipValue) || 0;

  const totalEndingChips = players.reduce((sum, p) => sum + p.endingChips, 0);
  const totalExpectedChips = numInitialChips * players.length;
  const isBalanced = Math.abs(totalEndingChips - totalExpectedChips) < 0.001;

  // Real-time calculation logic
  const settlements = useMemo(() => {
    if (!isBalanced || numChipValue === 0) return [];

    const balances = players.map(p => ({
      name: p.name,
      amount: (p.endingChips - numInitialChips) * numChipValue
    }));

    const winners = balances.filter(b => b.amount > 0.001).sort((a, b) => b.amount - a.amount);
    const losers = balances.filter(b => b.amount < -0.001).sort((a, b) => a.amount - b.amount);

    const result: Settlement[] = [];
    let wIdx = 0;
    let lIdx = 0;

    const winnersCopy = winners.map(w => ({ ...w }));
    const losersCopy = losers.map(l => ({ ...l, amount: Math.abs(l.amount) }));

    while (wIdx < winnersCopy.length && lIdx < losersCopy.length) {
      const winner = winnersCopy[wIdx];
      const loser = losersCopy[lIdx];
      const amount = Math.min(winner.amount, loser.amount);

      if (amount > 0) {
        result.push({ from: loser.name, to: winner.name, amount: Number(amount.toFixed(2)) });
      }

      winner.amount -= amount;
      loser.amount -= amount;

      if (winner.amount < 0.001) wIdx++;
      if (loser.amount < 0.001) lIdx++;
    }

    return result;
  }, [players, numInitialChips, numChipValue, isBalanced]);

  const generateNotificationText = () => {
    const header = `💰 【筹码结算单】\n----------------\n`;
    const body = settlements.map(s => `${s.from} 转 ${s.to} ${s.amount}元`).join('\n');
    const footer = `\n----------------\n结算总计: ${totalEndingChips} 筹码`;
    return header + body + footer;
  };

  const copyToClipboard = () => {
    const text = generateNotificationText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      e.target.value = '';
    } else {
      e.target.select();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20 md:pb-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-3 bg-white border-2 border-slate-100 rounded-2xl hover:border-slate-900 transition-all active:scale-95 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">筹码计算器</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Poker Settlement</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black">
            <Calculator size={14} />
            自动计算中
          </div>
        </div>

        {/* Global Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">初始筹码 (每人)</label>
            <input 
              type="number"
              value={initialChips}
              onFocus={handleFocus}
              onChange={(e) => setInitialChips(e.target.value)}
              className="w-full text-xl md:text-2xl font-black text-slate-900 bg-slate-50 px-4 py-3 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">每颗价值 (元)</label>
            <input 
              type="number"
              step="0.01"
              value={chipValue}
              onFocus={handleFocus}
              onChange={(e) => setChipValue(e.target.value)}
              className="w-full text-xl md:text-2xl font-black text-slate-900 bg-slate-50 px-4 py-3 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Players List */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6 md:mb-8">
             <h2 className="text-lg md:text-xl font-black text-slate-900">玩家数据</h2>
             <button 
                onClick={addPlayer}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 md:px-6 py-2 rounded-xl font-black text-xs hover:bg-orange-600 transition-all active:scale-95 shadow-md shadow-orange-100"
             >
               <Plus size={16} /> 添加玩家
             </button>
          </div>

          <div className="space-y-3 md:space-y-4">
            {players.map((player) => (
              <div key={player.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center bg-slate-50 p-4 rounded-2xl group transition-all hover:bg-white hover:shadow-md hover:ring-1 hover:ring-slate-100">
                <div className="flex-1 min-w-0">
                   <input 
                     type="text"
                     value={player.name}
                     onChange={(e) => updatePlayer(player.id, { name: e.target.value })}
                     className="w-full bg-transparent font-black text-slate-700 focus:outline-none text-sm md:text-base truncate"
                     placeholder="姓名"
                   />
                </div>
                <div className="flex items-center gap-2 sm:w-48">
                   <span className="text-[9px] font-black text-slate-400 uppercase shrink-0">结算筹码</span>
                   <input 
                     type="number"
                     value={player.endingChips}
                     onFocus={handleFocus}
                     onChange={(e) => updatePlayer(player.id, { endingChips: Number(e.target.value) })}
                     className="w-full bg-white px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-none font-black text-sm transition-all"
                   />
                </div>
                <div className="flex justify-end sm:w-10">
                  <button 
                    onClick={() => removePlayer(player.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Balance Checker */}
          <div className={`mt-8 p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-2 ${isBalanced ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
            <div className="flex items-center gap-2">
              {isBalanced ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span className="text-[10px] font-black uppercase tracking-tight">
                {isBalanced ? '筹码完全相等' : `收支不平衡 (误差: ${Math.round((totalEndingChips - totalExpectedChips) * 100) / 100})`}
              </span>
            </div>
            <span className="font-mono text-sm font-bold bg-white/50 px-3 py-1 rounded-lg">
              当前合计: {totalEndingChips} / 应为: {totalExpectedChips}
            </span>
          </div>
        </div>

        {/* Settlement Results */}
        <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <h2 className="text-xl md:text-2xl font-black text-slate-900">转账方案</h2>
             {settlements.length > 0 && (
               <button 
                onClick={copyToClipboard}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all shadow-sm ${copied ? 'bg-green-500 text-white' : 'bg-white border-2 border-slate-100 text-slate-900 hover:border-slate-900'}`}
               >
                 {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                 {copied ? '已复制文本' : '一键复制结算通知'}
               </button>
             )}
          </div>

          {!isBalanced ? (
             <div className="bg-white p-12 rounded-[32px] border-2 border-dashed border-slate-200 text-center space-y-3">
                <Calculator size={40} className="mx-auto text-slate-200" />
                <p className="text-slate-400 font-bold text-sm">请配平筹码以显示转账方案</p>
             </div>
          ) : settlements.length === 0 ? (
            <div className="bg-white p-12 rounded-[32px] border-2 border-dashed border-slate-200 text-center space-y-3">
                <CheckCircle size={40} className="mx-auto text-green-200" />
                <p className="text-green-600 font-bold text-sm">所有人筹码相同，无需转账</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {settlements.map((s, idx) => (
                 <div key={idx} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-slate-400 uppercase">付款明细</span>
                       <div className="flex items-center gap-2 md:gap-3">
                          <span className="font-black text-slate-900 text-sm md:text-base">{s.from}</span>
                          <div className="h-0.5 w-4 bg-orange-200 rounded-full" />
                          <span className="text-[10px] font-black text-orange-500">支付给</span>
                          <div className="h-0.5 w-4 bg-orange-200 rounded-full" />
                          <span className="font-black text-slate-900 text-sm md:text-base">{s.to}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="block text-[10px] font-black text-orange-500 uppercase">金额</span>
                       <span className="text-lg md:text-xl font-black text-slate-900">{s.amount}<span className="text-[10px] ml-1">元</span></span>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChipCalculator;
