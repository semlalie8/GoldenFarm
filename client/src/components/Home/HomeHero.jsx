import React from 'react';
import { useTranslation } from 'react-i18next';

const HomeHero = ({ searchFilters, handleFilterChange, handleSearch, currentDir }) => {
    const { t } = useTranslation();

    return (
        <header className="hero-header" dir={currentDir}>
            <div className="overlay"></div>
            <div className="container">
                <div className="header-title">
                    <h1 data-translate="hero_title">{t('hero_title', 'Empower Moroccan Livestock Farmers')}</h1>
                    <p data-translate="hero_text">
                        {t('hero_text', "Join our mission to strengthen Morocco's rural communities through sustainable livestock farming and transparent crowdfunding.")}
                    </p>
                </div>

                <div className="header-form">
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ maxWidth: '800px' }}>
                        <h2 data-translate="hero_form_title">{t('hero_form_title', 'Find Projects to Support:')}</h2>

                        <div className="row g-3 w-100 mt-4 mb-4">
                            <div className="col-md-6">
                                <label className={`form-label text-white d-block mb-1 ${currentDir === 'rtl' ? 'text-end' : 'text-start'}`} data-translate="search_region">{t('search_region', 'Region')}</label>
                                <select
                                    className="form-select"
                                    name="region"
                                    value={searchFilters.region}
                                    onChange={handleFilterChange}
                                    style={{ height: '50px', borderRadius: 'var(--border-radius-sm)' }}
                                >
                                    <option value="">{t('select_region', 'Select Region')}</option>
                                    <option value="tanger">Tanger-Tétouan-Al Hoceïma</option>
                                    <option value="oriental">L'Oriental</option>
                                    <option value="fes">Fès-Meknès</option>
                                    <option value="rabat">Rabat-Salé-Kénitra</option>
                                    <option value="beni_mellal">Béni Mellal-Khénifra</option>
                                    <option value="casablanca">Casablanca-Settat</option>
                                    <option value="marrakech">Marrakech-Safi</option>
                                    <option value="draa">Drâa-Tafilalet</option>
                                    <option value="souss">Souss-Massa</option>
                                    <option value="guelmim">Guelmim-Oued Noun</option>
                                    <option value="laayoune">Laâyoune-Sakia El Hamra</option>
                                    <option value="dakhla">Dakhla-Oued Ed-Dahab</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className={`form-label text-white d-block mb-1 ${currentDir === 'rtl' ? 'text-end' : 'text-start'}`} data-translate="search_livestock">{t('search_livestock', 'Livestock Type')}</label>
                                <select
                                    className="form-select"
                                    name="livestock"
                                    value={searchFilters.livestock}
                                    onChange={handleFilterChange}
                                    style={{ height: '50px', borderRadius: 'var(--border-radius-sm)' }}
                                >
                                    <option value="">{t('select_livestock', 'Select Livestock')}</option>
                                    <option value="sheep">{t('livestock_sheep', 'Sheep (Ovin)')}</option>
                                    <option value="goat">{t('livestock_goat', 'Goat (Caprin)')}</option>
                                    <option value="cattle">{t('livestock_cattle', 'Cattle (Bovin)')}</option>
                                    <option value="poultry">{t('livestock_poultry', 'Poultry (Volaille)')}</option>
                                    <option value="camel">{t('livestock_camel', 'Camel (Camélin)')}</option>
                                    <option value="beekeeping">{t('livestock_beekeeping', 'Beekeeping (Apiculture)')}</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className={`form-label text-white d-block mb-1 ${currentDir === 'rtl' ? 'text-end' : 'text-start'}`} data-translate="search_breed">{t('search_breed', 'Breed')}</label>
                                <select
                                    className="form-select"
                                    name="breed"
                                    value={searchFilters.breed}
                                    onChange={handleFilterChange}
                                    style={{ height: '50px', borderRadius: 'var(--border-radius-sm)' }}
                                >
                                    <option value="">{t('select_breed', 'Select Breed')}</option>
                                    <option value="sardi">Sardi</option>
                                    <option value="timahdite">Timahdite</option>
                                    <option value="bni_guil">Bni Guil</option>
                                    <option value="holstein">Holstein</option>
                                    <option value="dman">D'man</option>
                                    <option value="doukkalia">Doukkalia</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className={`form-label text-white d-block mb-1 ${currentDir === 'rtl' ? 'text-end' : 'text-start'}`} data-translate="search_status">{t('search_status', 'Project Status')}</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={searchFilters.status}
                                    onChange={handleFilterChange}
                                    style={{ height: '50px', borderRadius: 'var(--border-radius-sm)' }}
                                >
                                    <option value="">{t('select_status', 'Select Status')}</option>
                                    <option value="open">{t('status_open', 'Open for Funding')}</option>
                                    <option value="funded">{t('status_funded', 'Fully Funded')}</option>
                                    <option value="progress">{t('status_progress', 'In Progress')}</option>
                                    <option value="completed">{t('status_completed', 'Completed')}</option>
                                </select>
                            </div>
                        </div>

                        <button id="searchBtn" className="btn w-100 py-3 fw-bold text-uppercase" type="submit" data-translate="hero_btn"
                            style={{
                                background: 'var(--gold-gradient)',
                                color: '#fff',
                                borderRadius: '0 0 20px 20px',
                                position: 'absolute',
                                bottom: '0',
                                left: '0',
                                border: 'none'
                            }}>
                            {t('hero_btn', 'Search')}
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
};

export default HomeHero;
