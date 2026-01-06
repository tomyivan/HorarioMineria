// Input reutilizable con validación visual
export const Input = ({ placeholder, 
    value, 
    onChange, 
    label, 
    type, 
    disabled,
    name,
    required,
    validation
}) => {
    return (
        <div className="flex flex-col w-full">
            {label && (
                <label className="text-sm font-semibold text-gray-300 block mb-2">{label}</label>
            )}
            <input
                className={`border-2 border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 w-full transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed
                    ${validation ? " border-red-500 focus:border-red-500 focus:ring-red-400" : ""}`}
                type={type ?? "text"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                name={name}
                required={required}
            />
            <small className="text-red-400 text-xs block mt-1">
                {validation?.label || ""}
            </small>
        </div>
    );
};
