import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { MessageCircle, Send, User, Stethoscope, X } from 'lucide-react';

interface ChatbotProps {
  userId: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'system',
      message: 'Hello! I\'m here to help with your menstrual health questions. You can chat with qualified MBBS students for medical guidance.',
      timestamp: new Date().toISOString(),
      isFromMBBS: true,
      mbbs_student_id: 'system'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnectedToMBBS, setIsConnectedToMBBS] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      userId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      isFromMBBS: false
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate MBBS student response (in real app, this would be real-time)
    setTimeout(() => {
      const responses = [
        "Thank you for your question. Based on what you've described, this seems like a common concern. Can you provide more details about your symptoms?",
        "I understand your concern. Menstrual irregularities can have various causes. Have you noticed any patterns or triggers?",
        "This is a good question about menstrual health. Let me provide some general guidance, but remember this doesn't replace an in-person consultation.",
        "I appreciate you reaching out. For symptoms like these, it's important to track them consistently. Are you experiencing any pain or discomfort?",
        "Based on your query, I'd recommend monitoring your cycle closely. If symptoms persist, consider consulting a gynecologist in person."
      ];

      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'mbbs-student-1',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        isFromMBBS: true,
        mbbs_student_id: 'mbbs-student-1'
      };

      setMessages(prev => [...prev, response]);
      setIsConnectedToMBBS(true);
    }, 2000);
  };

  const connectToMBBS = () => {
    const connectMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'system',
      message: 'Connecting you to an available MBBS student... Please wait.',
      timestamp: new Date().toISOString(),
      isFromMBBS: true,
      mbbs_student_id: 'system'
    };

    setMessages(prev => [...prev, connectMessage]);

    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'mbbs-student-1',
        message: 'Hello! I\'m Dr. Priya, a final year MBBS student. I\'m here to help with your menstrual health questions. How can I assist you today?',
        timestamp: new Date().toISOString(),
        isFromMBBS: true,
        mbbs_student_id: 'mbbs-student-1'
      };

      setMessages(prev => [...prev, welcomeMessage]);
      setIsConnectedToMBBS(true);
    }, 3000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-full shadow-lg transition-colors z-40"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-rose-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Medical Chat</h3>
                <p className="text-xs text-rose-100">
                  {isConnectedToMBBS ? 'Connected to MBBS Student' : 'Chat Support'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-rose-600 p-1 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromMBBS ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.isFromMBBS
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.isFromMBBS ? (
                      <Stethoscope className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    <span className="text-xs opacity-75">
                      {message.isFromMBBS ? 'MBBS Student' : 'You'}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            {!isConnectedToMBBS && (
              <button
                onClick={connectToMBBS}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-2 text-sm transition-colors"
              >
                Connect to MBBS Student
              </button>
            )}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 text-center">
              For educational purposes only. Not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;