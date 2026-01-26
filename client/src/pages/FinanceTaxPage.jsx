import React, { useState } from 'react';
import { FaBalanceScale, FaLandmark, FaCalculator, FaFilePdf, FaHistory } from 'react-icons/fa';

const FinanceTaxPage = () => {
    const [taxYear, setTaxYear] = useState('2026');

    return (
        <div className="tax-page">
            <style>{`
                .tax-page { padding: 30px; background: #fdfdfd; min-height: 100vh; }
                .tax-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                .tax-header h1 { font-size: 1.6rem; color: #1e293b; font-weight: 800; display: flex; align-items: center; gap: 12px; }
                
                .tax-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
                .tax-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .tax-card h3 { font-size: 1rem; color: #334155; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; display: flex; align-items: center; gap: 10px; }
                
                .tax-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 0.9rem; }
                .tax-label { color: #64748b; }
                .tax-value { font-weight: 700; color: #1e293b; }
                
                .tax-total-box { background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px; }
                .tax-summary-val { font-size: 1.4rem; font-weight: 800; color: #0070f2; }
                
                .law-info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-top: 30px; border-radius: 4px; }
                .law-info-box h4 { font-size: 0.85rem; color: #1d4ed8; margin-bottom: 5px; text-transform: uppercase; }
                .law-info-box p { font-size: 0.8rem; color: #1e40af; margin: 0; line-height: 1.6; }
            `}</style>

            <div className="tax-header">
                <h1><FaLandmark color="#3b82f6" /> Gestion Fiscale & Conformité CGI</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="sap-btn-outline"><FaHistory /> Historique</button>
                    <button className="sap-btn"><FaFilePdf /> Télécharger Liasse 2026</button>
                </div>
            </div>

            <div className="tax-grid">
                <div className="tax-card">
                    <h3><FaBalanceScale color="#0db473" /> Déclaration de TVA (Taxe Valeur Ajoutée)</h3>
                    <div className="tax-row">
                        <span className="tax-label">TVA Facturée (Collectée - 71)</span>
                        <span className="tax-value">145,200.00 DH</span>
                    </div>
                    <div className="tax-row">
                        <span className="tax-label">TVA Récupérable (Charges - 34552)</span>
                        <span className="tax-value">- 82,400.00 DH</span>
                    </div>
                    <div className="tax-row">
                        <span className="tax-label">TVA Récupérable (Immo - 34551)</span>
                        <span className="tax-value">- 12,500.00 DH</span>
                    </div>
                    <div className="tax-total-box">
                        <div className="tax-row" style={{ marginBottom: 0 }}>
                            <span className="tax-label">TVA NETTE À PAYER</span>
                            <span className="tax-summary-val">50,300.00 DH</span>
                        </div>
                    </div>
                    <p className="small text-muted mt-3">* Calculé selon le régime des débits (Modifiable vers régime des encaissements).</p>
                </div>

                <div className="tax-card">
                    <h3><FaCalculator color="#0070f2" /> Impôt sur les Sociétés (IS) - LF 2026</h3>
                    <div className="tax-row">
                        <span className="tax-label">Résultat Fiscal Prévisionnel</span>
                        <span className="tax-value">840,000.00 DH</span>
                    </div>
                    <div className="tax-row">
                        <span className="tax-label">Taux d'IS Appliqué (LF 2026)</span>
                        <span className="tax-value">20%</span>
                    </div>
                    <div className="tax-row">
                        <span className="tax-label">Cotisation Minimale (0.25%)</span>
                        <span className="tax-value">12,400.00 DH</span>
                    </div>
                    <div className="tax-total-box" style={{ borderColor: '#3b82f6' }}>
                        <div className="tax-row" style={{ marginBottom: 0 }}>
                            <span className="tax-label">IS CALCULÉ (PLUS ÉLEVÉ)</span>
                            <span className="tax-summary-val">168,000.00 DH</span>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="d-flex justify-content-between small text-muted">
                            <span>Acomptes versés</span>
                            <span>42,000.00 DH x 3</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="law-info-box">
                <h4>Note de Conformité - Loi de Finance 2026</h4>
                <p>
                    Conformément à la réforme progressive de l'IS entamée en 2023, le taux unifié cible de 20% est désormais appliqué.
                    Les entreprises ayant un bénéfice net supérieur à 100 Millions de DH restent soumises au taux de 35%.
                    Le système GoldenFarm applique automatiquement les retenues à la source sur les rémunérations des tiers selon les derniers barèmes.
                </p>
            </div>
        </div>
    );
};

export default FinanceTaxPage;
