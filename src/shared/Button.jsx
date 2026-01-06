// Botón reutilizable con variantes de estilo
export const Button = ({ onClick, children, disabled, variant, type, className }) => {
    const baseStyles = "font-semibold px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
    
    const variants = {
        primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
    };

    const variantStyles = variants[variant] || variants.secondary;

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${className || ''}`}
            onClick={onClick}
            disabled={disabled}
            type={type ?? "button"}
        >
            {children}
        </button>
    );
}