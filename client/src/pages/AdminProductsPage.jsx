import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminProductsPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get('/api/products', config);
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [userInfo]);

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete_product', 'Are you sure you want to delete this product?'))) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                await axios.delete(`/api/products/${id}`, config);
                setProducts(products.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div className="dashboard-page" dir={currentDir}>
            {/* Hero Section */}
            <div className="dashboard-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="dashboard-title">
                                {t('manage_products', 'Manage Products')}
                            </h1>
                            <p className="dashboard-subtitle">
                                {t('manage_products_subtitle', 'Manage marketplace products and inventory')}
                            </p>
                        </div>
                        <div className="col-lg-4 text-end">
                            <Link to="/admin" className="btn btn-outline-light">
                                <i className={`fas fa-arrow-${currentDir === 'rtl' ? 'right' : 'left'} me-2`}></i>
                                {t('back_to_dashboard', 'Back to Dashboard')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container dashboard-content">
                <div className="card-header-custom mb-4">
                    <h2 className="section-title">
                        <i className={`fas fa-boxes ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                        {t('product_list', 'Product List')}
                    </h2>
                    <Link to="/marketplace/new" className="btn btn-warning text-white">
                        <i className="fas fa-plus me-2"></i>
                        {t('add_new_product', 'Add New Product')}
                    </Link>
                </div>

                <div className="transactions-card">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table transaction-table">
                                <thead>
                                    <tr>
                                        <th>{t('product_name', 'Name')}</th>
                                        <th>{t('category', 'Category')}</th>
                                        <th>{t('price', 'Price')}</th>
                                        <th>{t('stock', 'Stock')}</th>
                                        <th>{t('actions', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {product.image && (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name?.en || product.name}
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }}
                                                            onError={(e) => { e.target.src = '/img/placeholder.png'; }}
                                                        />
                                                    )}
                                                    <span className="fw-bold">{product.name?.[i18n.language] || product.name?.en || product.name}</span>
                                                </div>
                                            </td>
                                            <td>{product.category}</td>
                                            <td>{product.price} MAD</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Link to={`/marketplace/edit/${product._id}`} className="btn btn-sm btn-warning text-white" title={t('edit', 'Edit')}>
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(product._id)}
                                                        title={t('delete', 'Delete')}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-box-open fa-3x"></i>
                            <h3>{t('no_products_found', 'No products found')}</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;
