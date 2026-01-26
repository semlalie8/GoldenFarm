import React from 'react';

/**
 * Standard Styled Input
 */
const Input = ({ label, id, error, className = '', ...props }) => {
    return (
        <div className="form-group mb-4">
            {label && (
                <label htmlFor={id} className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`form-control w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default Input;
