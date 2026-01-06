// Convierte estado a badge con color y letra
export const StatesActivity = ({type}) => {
    const stateConfig = {
        'up': {
            color: 'bg-blue-500',
            hoverColor: 'hover:bg-blue-600',
            text: 'S',
            textColor: 'text-white'
        },
        'induction': {
            color: 'bg-yellow-500',
            hoverColor: 'hover:bg-yellow-600',
            text: 'I',
            textColor: 'text-gray-900'
        },
        'perforation': {
            color: 'bg-green-500',
            hoverColor: 'hover:bg-green-600',
            text: 'P',
            textColor: 'text-white'
        },
        'down': {
            color: 'bg-red-500',
            hoverColor: 'hover:bg-red-600',
            text: 'B',
            textColor: 'text-white'
        },
        'downtime': {
            color: 'bg-gray-400',
            hoverColor: 'hover:bg-gray-500',
            text: 'D',
            textColor: 'text-gray-900'
        },
        'default': {
            color: 'bg-gray-300',
            hoverColor: 'hover:bg-gray-400',
            text: '-',
            textColor: 'text-gray-700'
        }
    };
    
    const config = stateConfig[type] || stateConfig['default'];
    
    return (
        <div className={`${config.color} ${config.hoverColor} ${config.textColor} p-2 rounded font-bold text-center transition-all duration-200 shadow-sm cursor-default min-w-8`}>
            {config.text}
        </div>
    );
}