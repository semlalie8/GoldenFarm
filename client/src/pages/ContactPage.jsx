import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import emailjs from '@emailjs/browser'; // ✅ pre-bundled via optimizeDeps

// EmailJS environment variables
const serviceId = import.meta.env.VITE_APP_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY;

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const currentDir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Send to backend
      await axios.post('/api/contact', formData);

      // Send via EmailJS
      await emailjs.send(serviceId, templateId, formData, publicKey);

      setStatus({ type: 'success', message: t('contact_success', 'Your message has been sent successfully!') });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: t('contact_error', 'Failed to send message. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page py-5" dir={currentDir}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <h1 className="fw-bold text-success mb-3">
                <i className="fas fa-envelope-open-text me-3"></i>
                {t('contact_title', 'Get in Touch')}
              </h1>
              <p className="text-muted fs-5">
                {t('contact_subtitle', "Have questions about investments, partnerships, or our platform? We'd love to hear from you.")}
              </p>
            </div>

            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                {status.message && (
                  <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'} mb-4`}>
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">{t('contact_name', 'Your Name')}</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('contact_name_placeholder', 'Enter your full name')}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">{t('contact_email', 'Email Address')}</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('contact_email_placeholder', 'Enter your email')}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">{t('contact_subject', 'Subject')}</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder={t('contact_subject_placeholder', 'What is this about?')}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">{t('contact_message', 'Message')}</label>
                      <textarea
                        className="form-control form-control-lg"
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('contact_message_placeholder', 'Tell us more about your inquiry...')}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="sap-premium-btn w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <span><i className="fas fa-spinner fa-spin me-2"></i>{t('sending', 'Sending...')}</span>
                        ) : (
                          <span><i className="fas fa-paper-plane me-2"></i>{t('send_message', 'Send Message')}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="row g-4 mt-5">
              <div className="col-md-4">
                <div className="card text-center border-0 shadow-sm h-100">
                  <div className="card-body py-4">
                    <div className="mb-3">
                      <i className="fas fa-map-marker-alt fa-2x text-success"></i>
                    </div>
                    <h5 className="fw-bold">{t('contact_address', 'Address')}</h5>
                    <p className="text-muted mb-0">Casablanca, Morocco</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center border-0 shadow-sm h-100">
                  <div className="card-body py-4">
                    <div className="mb-3">
                      <i className="fas fa-phone fa-2x text-success"></i>
                    </div>
                    <h5 className="fw-bold">{t('contact_phone', 'Phone')}</h5>
                    <p className="text-muted mb-0">+212 600 000 000</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center border-0 shadow-sm h-100">
                  <div className="card-body py-4">
                    <div className="mb-3">
                      <i className="fas fa-envelope fa-2x text-success"></i>
                    </div>
                    <h5 className="fw-bold">{t('contact_email_label', 'Email')}</h5>
                    <p className="text-muted mb-0">contact@goldenfarm.ma</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
