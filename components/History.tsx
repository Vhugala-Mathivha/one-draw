import React from 'react';
import { Ticket } from '../types';
import { History as HistoryIcon } from 'lucide-react';

interface HistoryProps {
  tickets: Ticket[];
}

export const History: React.FC<HistoryProps> = ({ tickets }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
        <HistoryIcon className="w-5 h-5 text-gray-400" /> Previous Bets
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
            <tr>
              <th className="px-4 py-3 rounded-l-lg">Type</th>
              <th className="px-4 py-3">Numbers</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3 text-right rounded-r-lg">Prize</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No bets placed yet.</td></tr>
            )}
            {tickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-bold">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase ${ticket.type === 'PUNCH' ? 'bg-orange-100 text-orange-700' : 'bg-black text-white'}`}>
                        {ticket.type}
                    </span>
                </td>
                <td className="px-4 py-3 text-gray-600 font-mono">
                    {ticket.type === 'PUNCH' ? (
                        <span>Target: {ticket.numbers[0]} | Hit: {ticket.numbers[1]}</span>
                    ) : (
                        <span>
                            {ticket.numbers.slice(0, 5).join(', ')} 
                            <span className="text-orange-500 font-bold ml-2">[{ticket.numbers[5]}]</span>
                        </span>
                    )}
                </td>
                <td className="px-4 py-3">
                    {ticket.isWinner ? (
                        <span className="text-green-600 font-bold">WIN</span>
                    ) : (
                        <span className="text-gray-400">LOSS</span>
                    )}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold">
                    {ticket.isWinner ? `R${ticket.prize}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
