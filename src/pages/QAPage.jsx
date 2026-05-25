import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';
import { Send, Bot, User } from 'lucide-react';

export default function QAPage() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content:
        'Xin chào 👋 Tôi là trợ lý AI nha khoa. Tôi có thể hỗ trợ bạn về dịch vụ, giá cả và chăm sóc răng miệng.',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const messageText = input;

    // User message
    const userMessage = {
      role: 'user',
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(messageText);

      // Bot response
      const botMessage = {
        role: 'bot',
        content: response.data,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: '❌ Xin lỗi, hệ thống đang gặp lỗi. Vui lòng thử lại sau.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#0f172a] flex flex-col">
      {/* Header */}
      <div className="bg-[#111827] border-b border-gray-800 px-6 py-4 flex items-center gap-3 shadow-lg">
        <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center">
          <Bot className="text-white" size={24} />
        </div>

        <div>
          <h1 className="text-white font-bold text-lg">
            AI Dental Assistant
          </h1>
          <p className="text-green-400 text-sm flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            Đang hoạt động
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-b from-[#0f172a] to-[#111827]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              message.role === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            {/* Avatar Bot */}
            {message.role === 'bot' && (
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                <Bot size={20} className="text-white" />
              </div>
            )}

            {/* Message */}
            <div
              className={`max-w-[80%] md:max-w-[65%] px-5 py-3 rounded-3xl shadow-lg ${
                message.role === 'user'
                  ? 'bg-teal-500 text-white rounded-br-md'
                  : 'bg-[#1e293b] text-gray-100 rounded-bl-md border border-gray-700'
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                {message.content}
              </p>
            </div>

            {/* Avatar User */}
            {message.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                <User size={20} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>

            <div className="bg-[#1e293b] border border-gray-700 px-5 py-4 rounded-3xl rounded-bl-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#111827] border-t border-gray-800 px-4 py-4">
        <form
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center bg-[#1e293b] border border-gray-700 rounded-full px-3 py-2 shadow-xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={loading}
              className="flex-1 bg-transparent text-white placeholder-gray-400 px-3 py-2 outline-none"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 transition-all flex items-center justify-center"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </form>

        {/* Quick Suggestions */}
        <div className="max-w-4xl mx-auto mt-4 flex flex-wrap gap-2">
          {[
            'Niềng răng giá bao nhiêu?',
            'Tư vấn implant',
            'Cách chăm sóc răng',
            'Đặt lịch khám',
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => setInput(item)}
              className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-gray-300 rounded-full text-sm transition-all border border-gray-700"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}