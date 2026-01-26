import React from 'react';
import { useTranslation } from 'react-i18next';

const TestimonialsPage = () => {
    const { t } = useTranslation();

    const testimonials = [
        {
            id: 1,
            name: "Ahmed Benali",
            role: "Farmer in Azilal",
            text: "Golden Farm helped me expand my goat herd and increase my income by 40%. The support is incredible.",
            image: "/img/sheep-walk1.png"
        },
        {
            id: 2,
            name: "Sarah Miller",
            role: "Investor",
            text: "I love being able to see exactly where my money goes. The transparency and updates are top-notch.",
            image: "/img/sheep-walk2.png"
        },
        {
            id: 3,
            name: "Fatima Zahra",
            role: "Cooperative Leader",
            text: "Our women's cooperative has thrived thanks to the funding and training provided through this platform.",
            image: "/img/goat-walk.png"
        }
    ];

    return (
        <div className="testimonials-page container section">
            <h1 className="text-center mb-5">{t('testimonials_title', 'What Our Community Says')}</h1>

            <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {testimonials.map((item) => (
                    <div key={item.id} className="testimonial-card" style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                        <div className="profile" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px' }} />
                            <div>
                                <h4 style={{ margin: 0 }}>{item.name}</h4>
                                <span style={{ color: '#666', fontSize: '0.9rem' }}>{item.role}</span>
                            </div>
                        </div>
                        <p style={{ fontStyle: 'italic', lineHeight: '1.6' }}>"{item.text}"</p>
                        <div className="rating" style={{ color: '#ffc107' }}>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialsPage;
