import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors border border-slate-200 dark:border-slate-700 hover:shadow-md"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'light' ? (
                <Moon size={20} className="text-slate-600" />
            ) : (
                <Sun size={20} className="text-yellow-400" />
            )}
        </motion.button>
    );
};

export default ThemeToggle;
