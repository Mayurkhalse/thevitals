import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const ChatbotWidget = ({ selectedSite }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I can help you understand air quality data. Ask me anything!',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const qaPairs = {
    'what is no2': {
      response: 'NO₂ (Nitrogen Dioxide) is a harmful air pollutant primarily produced by vehicle emissions and industrial activities. Long-term exposure can cause respiratory problems.',
      relatedTo: ['pollution', 'health', 'emissions'],
    },
    'what is o3': {
      response: 'O₃ (Ozone) at ground level is a harmful air pollutant formed by chemical reactions between NOx and VOCs in sunlight. It can trigger asthma and reduce lung function.',
      relatedTo: ['pollution', 'health', 'weather'],
    },
    'how is aqi calculated': {
      response: 'Air Quality Index (AQI) is calculated based on concentrations of pollutants like NO₂, O₃, PM2.5, PM10, CO, and SO₂. Higher values indicate worse air quality. The scale typically ranges from 0-500.',
      relatedTo: ['aqi', 'calculation'],
    },
    'current levels': {
      response: selectedSite
        ? `At ${selectedSite.site_name}: NO₂ is ${selectedSite.no2_concentration.toFixed(1)} µg/m³, O₃ is ${selectedSite.o3_concentration.toFixed(1)} µg/m³, and AQI is ${selectedSite.air_quality_index} (${selectedSite.aqi_category}).`
        : 'Please select a monitoring site from the map to view current pollution levels.',
      relatedTo: ['current', 'data'],
    },
    'forecast': {
      response: selectedSite
        ? `24-hour forecast for ${selectedSite.site_name}: NO₂ expected to ${selectedSite.forecast_no2 < selectedSite.no2_concentration ? 'decrease' : 'increase'} to ${selectedSite.forecast_no2.toFixed(1)} µg/m³, O₃ expected to ${selectedSite.forecast_o3 < selectedSite.o3_concentration ? 'decrease' : 'increase'} to ${selectedSite.forecast_o3.toFixed(1)} µg/m³.`
        : 'Please select a monitoring site to view forecast data.',
      relatedTo: ['forecast', 'prediction'],
    },
    'health effects': {
      response: 'High levels of NO₂ and O₃ can cause respiratory issues, aggravate asthma, reduce lung function, and increase susceptibility to respiratory infections. Vulnerable groups include children, elderly, and people with pre-existing conditions.',
      relatedTo: ['health', 'safety'],
    },
    'what affects air quality': {
      response: 'Air quality is affected by traffic emissions, industrial activities, weather conditions (temperature, wind, humidity), seasonal variations, and geographic factors. High traffic intensity and low wind speeds typically worsen air quality.',
      relatedTo: ['factors', 'causes'],
    },
    'safety recommendations': {
      response: selectedSite && selectedSite.air_quality_index > 150
        ? 'Air quality is currently poor. Recommendations: Limit outdoor activities, wear N95 masks outdoors, keep windows closed, use air purifiers indoors, and stay hydrated.'
        : 'Current air quality levels are acceptable. However, sensitive groups should still monitor conditions and limit prolonged outdoor exertion during peak pollution hours.',
      relatedTo: ['health', 'safety', 'recommendations'],
    },
  };

  const findBestMatch = (userInput) => {
    const input = userInput.toLowerCase().trim();

    for (const [key, value] of Object.entries(qaPairs)) {
      if (input.includes(key) || key.includes(input)) {
        return value.response;
      }

      if (value.relatedTo.some(term => input.includes(term))) {
        return value.response;
      }
    }

    return "I'm not sure about that. You can ask me about NO₂, O₃, AQI calculation, current levels, forecast, health effects, factors affecting air quality, or safety recommendations.";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: findBestMatch(inputText),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);

    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'What is NO2?',
    'Current levels',
    'Forecast',
    'Health effects',
    'Safety recommendations',
  ];

  const handleQuickQuestion = (question) => {
    setInputText(question);
    handleSendMessage();
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-[1000] transition-all hover:scale-110"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-[1000] flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <div>
                <h3 className="font-semibold">Air Quality Assistant</h3>
                <p className="text-xs text-blue-100">Ask me about pollution data</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-gray-700" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputText(question);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="text-xs bg-white hover:bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-300 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about air quality..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
