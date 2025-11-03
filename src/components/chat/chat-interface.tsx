"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { useChat } from "@/contexts/chat-context";
import { FlightTable } from "./flight-table";
import { cleanResponseText, extractTableData, FlightData } from "@/lib/chat-utils";
import { useSearchHistory } from "@/hooks/useSearchHistory";

export function ChatInterface() {
  const { messages, addMessage, sendMessageToDialogflow } = useChat();
  const { saveSearch, isAuthenticated } = useSearchHistory();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [structuredFlightsByText, setStructuredFlightsByText] = useState<Record<string, FlightData[]>>({});
  const [tableOnlyByText, setTableOnlyByText] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // No async post-processing; structuring is awaited before adding the AI message

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    
    addMessage({
      sender: "user",
      content: userMessage
    });
    setInputValue("");
    setIsLoading(true);

    try {
      // Detect requested maintenance type from the user's query
      const detectMaintenanceType = (text: string): 'A-Check' | 'B-Check' | 'C-Check' | 'D-Check' | undefined => {
        const t = text.toLowerCase();
        if (/(^|\W)a[-\s]?check(\W|$)/.test(t)) return 'A-Check';
        if (/(^|\W)b[-\s]?check(\W|$)/.test(t)) return 'B-Check';
        if (/(^|\W)c[-\s]?check(\W|$)/.test(t)) return 'C-Check';
        if (/(^|\W)d[-\s]?check(\W|$)/.test(t)) return 'D-Check';
        return undefined;
      };
      const requestedType = detectMaintenanceType(userMessage);

      // Detect "table-only" directive from the user's query
      const isTableOnlyRequested = (() => {
        const t = userMessage.toLowerCase();
        return (
          /only\s+table/.test(t) ||
          /table\s+only/.test(t) ||
          /just\s+the\s+table/.test(t) ||
          /do\s+not\s+give\s+me\s+anything\s+except\s+the\s+table/.test(t) ||
          /no\s+text/.test(t) ||
          /no\s+lines/.test(t) ||
          /only\s+show\s+the\s+table/.test(t) ||
          /just\s+show\s+the\s+table/.test(t)
        );
      })();

      // Send message to Dialogflow
      const aiResponse = await sendMessageToDialogflow(userMessage);

      // Ask Ollama/Gemma to structure the table synchronously before rendering
      try {
        const structRes = await fetch('/api/structure-table-ollama', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: aiResponse, requestedType })
        });
        if (structRes.ok) {
          const data = await structRes.json();
          if (Array.isArray(data?.flights)) {
            setStructuredFlightsByText(prev => ({ ...prev, [aiResponse]: data.flights }));
            if (isTableOnlyRequested) {
              setTableOnlyByText(prev => ({ ...prev, [aiResponse]: true }));
            }
          }
        }
      } catch (e) {
        console.warn('Ollama structuring failed; will fall back to local parsing at render.', e);
      }

      // Now add the AI message so content and table render together
      addMessage({ sender: "ai", content: aiResponse });

      // Save search history if user is authenticated
      if (isAuthenticated) {
        await saveSearch(userMessage, {
          response: aiResponse,
          timestamp: new Date().toISOString(),
          type: 'chat_query'
        });
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      addMessage({
        sender: "ai",
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => {
          const flightsFromGemma = structuredFlightsByText[message.content] || [];
          const fallback = extractTableData(message.content);
          const flights = flightsFromGemma.length > 0 ? flightsFromGemma : fallback.flights;
          const hasTable = flights.length > 0;
          const cleanedContent = cleanResponseText(message.content);
          const tableOnly = tableOnlyByText[message.content] === true;
          
          return (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-xs lg:max-w-4xl ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${message.sender === "user" ? "ml-3" : "mr-3"}`}>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex flex-col">
                  {/* Sender Name */}
                  <div className={`text-sm font-medium text-gray-700 mb-1 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                    {message.sender === "user" ? "User" : "AeroTrack AI"}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {/* Render flight table if data is present */}
                    {hasTable && message.sender === "ai" && (
                      <div className="mb-3">
                        {(() => {
                          const mType = flights[0]?.maintenanceType || 'A-Check';
                          const title = `${mType} Aircraft (${flights.length} flights)`;
                          return <FlightTable flights={flights} title={title} hideFooter={tableOnly} />;
                        })()}
                      </div>
                    )}
                    
                    {/* Render cleaned text content */}
                    {!tableOnly && (
                      <p className="text-sm whitespace-pre-wrap">{cleanedContent}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-xs lg:max-w-md">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-700 mb-1">AeroTrack AI</div>
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
          </div>

          {/* Input Field */}
          <div className="flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
