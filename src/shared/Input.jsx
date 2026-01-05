export const Input = ({ placeholder, 
    value, 
    onChange, 
    label, 
    type, 
    disabled,
    name,
    max,
    min,
    required
}) => {
    return (
        <div className="flex flex-col space-y-2">
            {label && (
                <label className="text-sm font-semibold text-gray-300 block">{label}</label>
            )}
            <input
                className="border-2 border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 w-full transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                type={type ?? "text"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                name={name}
                max={ type === "number" ? max : undefined }
                min={ type === "number" ? min : undefined }
                required={required}
            />
        </div>
    );
};
