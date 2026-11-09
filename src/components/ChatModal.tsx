import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, MessageCircle } from 'lucide-react';
import { Ride } from '../types';

export const ChatModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
}> = ({ isOpen, onClose, ride }) => {
  const { currentUser, chatMessages, sendChatMessage } = useApp();
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const currentRideMessages = chatMessages.filter(m => m.rideId === ride.id);

  const quickChips = currentUser.role === 'driver'
    ? [
        "I'm at the pickup point in Cart #01!",
        "Traffic near the canteen, ETA 2 mins",
        "Please look for the green cart with lights",
        "I have arrived outside"
      ]
    : [
        "I'm waiting near the main gate entrance",
        "Wearing a blue backpack and glasses",
        "Coming down from the 2nd floor, 1 min",
        "Standing right next to the library quad"
      ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendChatMessage(ride.id, text.trim());
    setInputText('');
  };

  const isDriver = currentUser.role === 'driver';
  const partnerName = isDriver ? ride.riderName : (ride.driverName || 'Driver');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-charcoal-900 border border-charcoal-700 shadow-2xl flex flex-col h-[520px] overflow-hidden text-gray-100">
        {/* Header */}
        <div className="p-4 border-b border-charcoal-800 bg-charcoal-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-campus-600/20 text-campus-400 border border-campus-500/30 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white font-['Plus_Jakarta_Sans']">
                  Chat with {partnerName}
                </h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-gray-400">
                Trip: {ride.pickup} → {ride.drop}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {currentRideMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-2">
              <MessageCircle className="w-8 h-8 text-charcoal-600 mx-auto" />
              <p className="text-xs">No messages yet. Send a quick update!</p>
            </div>
          ) : (
            currentRideMessages.map(msg => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-gray-400 mb-0.5 px-1 font-semibold">
                    {isMe ? 'You' : msg.senderName}
                  </span>
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed shadow ${
                      isMe
                        ? 'bg-campus-600 text-white rounded-br-none'
                        : 'bg-charcoal-800 text-gray-100 border border-charcoal-700 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-500 mt-0.5 px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Chips */}
        <div className="px-3 py-2 bg-charcoal-850/80 border-t border-charcoal-800 flex gap-1.5 overflow-x-auto scrollbar-none">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="shrink-0 px-2.5 py-1 rounded-xl bg-charcoal-800 hover:bg-campus-600/20 hover:text-campus-300 border border-charcoal-750 text-[10px] text-gray-300 font-medium transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="p-3 border-t border-charcoal-800 bg-charcoal-900 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message to driver / rider..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-charcoal-800 border border-charcoal-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-campus-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-campus-600 hover:bg-campus-500 text-white transition-all shadow shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
