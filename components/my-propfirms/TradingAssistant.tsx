'use client';

import { Lightbulb } from 'lucide-react';

interface TradingAssistantProps {
  messages: string[];
}

export function TradingAssistant({ messages }: TradingAssistantProps) {
  if (messages.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
        <Lightbulb className="w-4 h-4 text-yellow-500" />
        Trading Assistant
      </h2>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <ul className="space-y-3">
          {messages.map((message, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-300">{message}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
