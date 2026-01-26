import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaBook, FaSearch, FaFilter, FaPlus, FaChevronRight, FaChevronDown } from 'react-icons/fa';

const FinanceLedgerPage = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedClasses, setExpandedClasses] = useState(['1', '2', '3', '4', '5', '6', '7']);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const { data } = await axios.get('/api/finance/accounts');
            setAccounts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching ledger');
            setLoading(false);
        }
    };

    const toggleClass = (cls) => {
        if (expandedClasses.includes(cls)) {
            setExpandedClasses(expandedClasses.filter(c => c !== cls));
        } else {
            setExpandedClasses([...expandedClasses, cls]);
        }
    };

    const filteredAccounts = accounts.filter(acc =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.accountCode.includes(searchTerm)
    );

    const groupedAccounts = {};
    filteredAccounts.forEach(acc => {
        const cls = acc.accountCode[0];
        if (!groupedAccounts[cls]) groupedAccounts[cls] = [];
        groupedAccounts[cls].push(acc);
    });

    const classNames = {
        '1': 'Financement Permanent',
        '2': 'Actif Immobilisé',
        '3': 'Actif Circulant (hors trésorerie)',
        '4': 'Passif Circulant (hors trésorerie)',
        '5': 'Trésorerie',
        '6': 'Charges',
        '7': 'Produits'
    };

    if (loading) return <div className="p-5 text-center">Chargement du Plan Comptable...</div>;

    return (
        <div className="ledger-page">
            <style>{`
                .ledger-page { padding: 30px; background: #fff; min-height: 100vh; }
                .ledger-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                .ledger-title { display: flex; align-items: center; gap: 15px; }
                .ledger-title h1 { font-size: 1.4rem; color: #1c2d3d; margin: 0; }
                
                .ledger-toolbar { display: flex; gap: 15px; margin-bottom: 20px; padding: 10px; background: #f8fafc; border-radius: 8px; }
                .search-box { position: relative; flex: 1; }
                .search-box input { width: 100%; padding: 8px 35px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; }
                .search-box svg { position: absolute; left: 12px; top: 11px; color: #94a3b8; }
                
                .ledger-table { width: 100%; border-collapse: collapse; }
                .class-row { background: #f1f5f9; cursor: pointer; border-left: 4px solid #0070f2; }
                .class-row td { padding: 12px 20px; font-weight: 700; color: #1e293b; font-size: 0.9rem; }
                .account-row td { padding: 10px 20px 10px 50px; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; color: #475569; }
                .account-row:hover { background: #f8fafc; }
                
                .col-code { width: 120px; font-family: monospace; color: #0070f2; font-weight: 600; }
                .col-balance { text-align: right; font-weight: 700; color: #1e293b; }
                
                .sap-badge { padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
                .badge-asset { background: #e0f2fe; color: #0369a1; }
                .badge-liability { background: #fee2e2; color: #b91c1c; }
                .badge-equity { background: #fef3c7; color: #92400e; }
                .badge-revenue { background: #dcfce7; color: #15803d; }
                .badge-expense { background: #fce7f3; color: #9d174d; }
            `}</style>

            <div className="ledger-header">
                <div className="ledger-title">
                    <FaBook color="#0070f2" />
                    <h1>Grand Livre des Comptes (PCM)</h1>
                </div>
                <button className="sap-btn"><FaPlus /> Nouvel Écriture</button>
            </div>

            <div className="ledger-toolbar">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Rechercher un compte par code ou intitulé..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="sap-btn-outline"><FaFilter /> Filtres SAP</button>
            </div>

            <table className="ledger-table">
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #edf2f5' }}>
                        <th style={{ padding: '10px 20px', fontSize: '0.75rem', color: '#64748b' }}>PLAN COMPTABLE</th>
                        <th style={{ padding: '10px 20px', fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>SOLDE ACTUEL (MAD)</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(classNames).sort().map(cls => (
                        <React.Fragment key={cls}>
                            {groupedAccounts[cls] && (
                                <>
                                    <tr className="class-row" onClick={() => toggleClass(cls)}>
                                        <td colSpan="2">
                                            {expandedClasses.includes(cls) ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                                            <span style={{ marginLeft: '10px' }}>Classe {cls} : {classNames[cls]}</span>
                                        </td>
                                    </tr>
                                    {expandedClasses.includes(cls) && groupedAccounts[cls].map(acc => (
                                        <tr key={acc._id} className="account-row">
                                            <td>
                                                <span className="col-code">{acc.accountCode}</span>
                                                <span style={{ marginLeft: '10px' }}>{acc.name}</span>
                                                <span className={`sap-badge badge-${acc.category.toLowerCase()}`} style={{ marginLeft: '10px' }}>
                                                    {acc.category}
                                                </span>
                                            </td>
                                            <td className="col-balance">
                                                {acc.balance.toLocaleString()} DH
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FinanceLedgerPage;
