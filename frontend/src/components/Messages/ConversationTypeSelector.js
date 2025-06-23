import { ChevronDown, MessageCircle, Clock, Archive } from 'lucide-react';

const conversationTypes = [
  { key: 'chat', label: 'Chats', icon: MessageCircle },
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'archived', label: 'Archive', icon: Archive }
];

const ConversationTypeSelector = ({ 
  activeType, 
  onTypeChange, 
  isOpen, 
  onToggle,
  getCount 
}) => {
  const currentType = conversationTypes.find(type => type.key === activeType);
  const CurrentIcon = currentType?.icon || MessageCircle;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="border-none w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <CurrentIcon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {currentType?.label} ({getCount(activeType)})
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {conversationTypes.map((type) => {
            const Icon = type.icon;
            const count = getCount(type.key);
            
            return (
              <button
                key={type.key}
                onClick={() => {
                  onTypeChange(type.key);
                  onToggle();
                }}
                className={`border-none w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  activeType === type.key ? 'bg-white' : 'text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{type.label}</span>
                <span className="text-xs text-gray-500 ml-auto">({count})</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConversationTypeSelector;
