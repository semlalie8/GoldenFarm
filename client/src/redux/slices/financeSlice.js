import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    transactions: [
        { id: 1, date: '2026-01-15', account: '5141', label: 'Versement Initial', debit: 1200000, credit: 0 },
        { id: 2, date: '2026-01-15', account: '1111', label: 'Constitution Capital', debit: 0, credit: 1200000 },
        { id: 3, date: '2026-01-20', account: '2332', label: 'Installation Solar Pumps', debit: 450000, credit: 0 },
        { id: 4, date: '2026-01-20', account: '4411', label: 'Facture Fournisseur SOL-AR', debit: 0, credit: 450000 },
        { id: 5, date: '2026-01-22', account: '6111', label: 'Achat Semences Bio', debit: 85000, credit: 0 },
        { id: 6, date: '2026-01-22', account: '7121', label: 'Vente Tomates Export (HT)', debit: 0, credit: 210000 },
        { id: 7, date: '2026-01-22', account: '4455', label: 'TVA Facturée s/Ventes', debit: 0, credit: 42000 },
        { id: 8, date: '2026-01-23', account: '3455', label: 'TVA Récupérable s/Charges', debit: 17000, credit: 0 },
    ],
    loading: false,
    error: null
};

const financeSlice = createSlice({
    name: 'finance',
    initialState,
    reducers: {
        addTransaction: (state, action) => {
            state.transactions = [...state.transactions, action.payload];
        },
        removeTransaction: (state, action) => {
            state.transactions = state.transactions.filter(t => t.id !== action.payload);
        },
        setTransactions: (state, action) => {
            state.transactions = action.payload;
        },
        setFinanceLoading: (state, action) => {
            state.loading = action.payload;
        },
        setFinanceError: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const {
    addTransaction,
    removeTransaction,
    setTransactions,
    setFinanceLoading,
    setFinanceError
} = financeSlice.actions;

export default financeSlice.reducer;
