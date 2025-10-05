import React, { useState, useRef } from 'react';
import type { ClothingItem } from '../types';

interface VoiceStylistProps {
  wardrobe: ClothingItem[];
}

interface Message {
  role: string;
  text: string;
  recommendedItems?: ClothingItem[];
}

export default function VoiceStylist({ wardrobe }: VoiceStylistProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userInput, setUserInput] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const greetUser = async () => {
    const greetingText = `Your wardrobe is in! I see ${wardrobe.length} items. What event are you looking for, and what's the weather like?`;
    setMessages([{ role: 'ai', text: greetingText }]);
    await playTTS(greetingText);
  };

  // Initialize speech recognition
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          console.log('Speech recognition started');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Recognized:', transcript);
          setUserInput(transcript);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          console.log('Speech recognition ended');
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const playTTS = async (text: string) => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('TTS failed');
      
      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (err) {
      console.error('TTS error:', err);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || isProcessing) return;

    const prompt = userInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setUserInput('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/stylist-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, wardrobeSummaries: wardrobe })
      });

      if (!res.ok) throw new Error('Stylist session failed');
      const { reply } = await res.json();
      
      // Find matching wardrobe items by description with fuzzy matching
      const recommendedItems: ClothingItem[] = [];
      if (reply.itemDescriptions && Array.isArray(reply.itemDescriptions)) {
        console.log('AI recommended items:', reply.itemDescriptions);
        
        reply.itemDescriptions.forEach((desc: string) => {
          // Normalize and extract keywords
          const descWords = desc.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
          
          // Find best matching item by comparing word overlap
          let bestMatch: ClothingItem | null = null;
          let bestScore = 0;
          
          wardrobe.forEach(item => {
            const itemWords = item.description.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
            const categoryWords = item.category.toLowerCase().split(/\s+/);
            
            // Count matching words
            let score = 0;
            descWords.forEach(word => {
              if (itemWords.includes(word)) score += 2;
              if (categoryWords.includes(word)) score += 1;
            });
            
            if (score > bestScore) {
              bestScore = score;
              bestMatch = item;
            }
          });
          
          if (bestMatch && bestScore > 2) {
            console.log(`Matched "${desc}" to "${bestMatch.description}" (score: ${bestScore})`);
            recommendedItems.push(bestMatch);
          } else {
            console.warn(`No match found for "${desc}"`);
          }
        });
      }
      
      const responseText = `${reply.name}. ${reply.justification}`;
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: responseText,
        recommendedItems: recommendedItems.length > 0 ? recommendedItems : undefined
      }]);
      
      await playTTS(responseText);
    } catch (err: any) {
      console.error('Error in stylist session:', err);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I had trouble processing that. Please try again.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    if (wardrobe.length > 0 && messages.length === 0) {
      greetUser();
    }
  }, [wardrobe]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-[#1a1d2e] to-[#0b0f1a] rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#ff3cac] to-[#00f5d4] bg-clip-text text-transparent">
        Voice Stylist
      </h2>

      {/* Wardrobe Display */}
      {wardrobe.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Your Wardrobe ({wardrobe.length} items)</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-64 overflow-y-auto p-2 bg-[#0b0f1a] rounded-lg">
            {wardrobe.map((item) => (
              <div key={item.id} className="relative group">
                <img
                  src={item.image}
                  alt={item.description}
                  className="w-full h-24 object-cover rounded-lg border border-[#00f5d4]/30 group-hover:border-[#00f5d4] transition-all"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center p-1">
                  <p className="text-xs text-white text-center line-clamp-3">{item.description}</p>
                </div>
                <div className="mt-1 text-xs text-center">
                  <span className="inline-block px-2 py-0.5 bg-[#00f5d4]/20 text-[#00f5d4] rounded-full text-[10px]">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`p-4 rounded-lg ${msg.role === 'ai' ? 'bg-[#00f5d4]/10 border border-[#00f5d4]/30' : 'bg-[#ff3cac]/10 border border-[#ff3cac]/30'}`}>
            <p className="text-sm font-semibold mb-1 text-[#00f5d4]">{msg.role === 'ai' ? 'AI Stylist' : 'You'}</p>
            <p className="text-white">{msg.text}</p>
            
            {/* Display recommended outfit items */}
            {msg.recommendedItems && msg.recommendedItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#00f5d4]/30">
                <p className="text-sm font-semibold text-[#00f5d4] mb-2">Recommended Items:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {msg.recommendedItems.map((item) => (
                    <div key={item.id} className="relative group">
                      <img
                        src={item.image}
                        alt={item.description}
                        className="w-full h-32 object-cover rounded-lg border-2 border-[#00f5d4]/50 group-hover:border-[#00f5d4] transition-all"
                      />
                      <div className="mt-2">
                        <p className="text-xs text-white line-clamp-2">{item.description}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#00f5d4]/30 text-[#00f5d4] rounded-full text-[10px]">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {isProcessing && (
          <div className="p-4 rounded-lg bg-[#00f5d4]/10 border border-[#00f5d4]/30">
            <p className="text-sm text-[#00f5d4] animate-pulse">Thinking...</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your request or describe the event/weather..."
          className="flex-1 px-4 py-3 bg-[#1a1d2e] border border-[#00f5d4]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00f5d4]"
          disabled={isProcessing || isListening}
        />
        
        {/* Microphone Button */}
        {isSpeechSupported && (
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`px-4 py-3 rounded-lg font-semibold transition-all ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                : 'bg-[#1a1d2e] border border-[#00f5d4]/30 text-[#00f5d4] hover:bg-[#00f5d4]/10'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        <button
          type="submit"
          disabled={!userInput.trim() || isProcessing || isListening}
          className="px-6 py-3 bg-gradient-to-r from-[#ff3cac] to-[#00f5d4] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>

      <audio ref={audioRef} className="hidden" />

      {isListening && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-center">
          <p className="text-red-400 font-semibold animate-pulse">🎤 Listening... Speak now!</p>
        </div>
      )}

      {wardrobe.length === 0 && (
        <p className="text-center text-gray-400 mt-4">Upload your wardrobe first to start chatting!</p>
      )}
    </div>
  );
}
