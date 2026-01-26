import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/userModel.js';
import Project from '../models/projectModel.js';
import Product from '../models/productModel.js';
import Video from '../models/videoModel.js';
import Book from '../models/bookModel.js';
import Article from '../models/articleModel.js';

dotenv.config();

const importData = async () => {
    try {
        await connectDB();

        // Clear all
        await User.deleteMany();
        await Project.deleteMany();
        await Product.deleteMany();
        await Video.deleteMany();
        await Book.deleteMany();
        await Article.deleteMany();

        console.log('🗑️ Database Cleared');

        // Create Users
        const admin = await User.create({
            name: 'El Mehdi',
            email: 'admin@goldenfarm.ma',
            password: 'password123',
            role: 'admin',
            isEmailVerified: true
        });

        const farmer = await User.create({
            name: 'Ahmed Farmer',
            email: 'farmer@goldenfarm.ma',
            password: 'password123',
            role: 'farmer',
            isEmailVerified: true
        });

        const adminId = admin._id;
        const farmerId = farmer._id;

        // Recently Added Projects
        await Project.insertMany([
            {
                user: farmerId,
                title: { en: 'Organic Saffron Hub', fr: 'Centre de Safran Bio', ar: 'مركز الزعفران العضوي' },
                description: { en: 'Hand-picked premium saffron from the Atlas mountains.' },
                category: 'agriculture',
                targetAmount: 500000,
                raisedAmount: 120000,
                minInvestment: 500,
                durationMonths: 24,
                roi: 15,
                location: 'Taliouine',
                images: ['/img/project_saffron.png'],
                status: 'active'
            },
            {
                user: farmerId,
                title: { en: 'Atlas Bee-Keeping', fr: 'Apiculture Atlas', ar: 'نحل الأطلس' },
                description: { en: 'Sustainable honey production in high-altitude environments.' },
                category: 'agriculture',
                targetAmount: 150000,
                raisedAmount: 45000,
                minInvestment: 100,
                durationMonths: 12,
                roi: 12,
                location: 'Ifrane',
                images: ['/img/project_bees.png'],
                status: 'active'
            },
            {
                user: farmerId,
                title: { en: 'Desert Date Palm Initiative', fr: 'Initiative Palmiers Dattiers', ar: 'مبادرة نخيل التمر' },
                description: { en: 'Restoring ancient oasis ecosystems through smart irrigation.' },
                category: 'agriculture',
                targetAmount: 850000,
                raisedAmount: 20000,
                minInvestment: 1000,
                durationMonths: 36,
                roi: 18,
                location: 'Zagora',
                images: ['/img/project_dates.png'],
                status: 'active'
            },
            {
                user: farmerId,
                title: { en: 'Vertical Mint Farm', fr: 'Ferme Menthe Verticale', ar: 'مزرعة النعناع العمودية' },
                description: { en: 'Hydroponic mint production for premium Moroccan tea export.' },
                category: 'agriculture',
                targetAmount: 200000,
                raisedAmount: 180000,
                minInvestment: 500,
                durationMonths: 12,
                roi: 14,
                location: 'Casablanca',
                images: ['/img/project_mint.png'],
                status: 'active'
            }
        ]);

        // Recently Added Products
        await Product.insertMany([
            {
                seller: farmerId,
                name: { en: 'Pure Argan Oil', fr: 'Huile d\'Argan Pure', ar: 'زيت الأركان الصافي' },
                description: { en: 'Cold-pressed culinary argan oil.' },
                price: 250,
                sku: 'ARG-001',
                category: 'Oils',
                image: '/img/product_argan_oil.png',
                stock: 100
            },
            {
                seller: farmerId,
                name: { en: 'Atlas Thyme Honey', fr: 'Miel de Thym de l\'Atlas', ar: 'عسل الزعتر الأطلسي' },
                description: { en: 'Medicinal grade honey from wild thyme.' },
                price: 180,
                sku: 'HNY-001',
                category: 'Food',
                image: '/img/product_atlas_honey.png',
                stock: 50
            },
            {
                seller: farmerId,
                name: { en: 'Dried Damask Roses', fr: 'Roses de Damas Séchées', ar: 'ورد قلعة مكونة' },
                description: { en: 'High-fragrance roses for cosmetics and tea.' },
                price: 45,
                sku: 'ROS-001',
                category: 'Flowers',
                image: '/img/project_saffron.png',
                stock: 500
            },
            {
                seller: farmerId,
                name: { en: 'Traditional Olive Oil', fr: 'Huile d\'Olive Traditionnelle', ar: 'زيت زيتون تقليدي' },
                description: { en: 'Unfiltered, strong flavor from local presses.' },
                price: 85,
                sku: 'OLV-001',
                category: 'Oils',
                image: '/img/product_argan_oil.png',
                stock: 300
            }
        ]);

        // Videos
        await Video.insertMany([
            {
                title: { en: 'Sustainable Farming 101', fr: 'Agriculture Durable 101' },
                description: { en: 'Introduction to eco-friendly farming techniques.' },
                videoUrl: 'https://sample.com',
                thumbnail: '/img/project_dates.png',
                category: 'Education',
                isFree: true
            },
            {
                title: { en: 'Hydroponics Mastery', fr: 'Maîtrise de l\'Hydroponie' },
                description: { en: 'Learn to grow plants without soil.' },
                videoUrl: 'https://sample.com',
                thumbnail: '/img/project_mint.png',
                category: 'Technology',
                isFree: false
            },
            {
                title: { en: 'Drones in Agriculture', fr: 'Drones en Agriculture' },
                description: { en: 'Using UAVs for crop monitoring.' },
                videoUrl: 'https://sample.com',
                thumbnail: '/img/project_mint.png',
                category: 'Technology',
                isFree: true
            },
            {
                title: { en: 'Soil Health Secrets', fr: 'Secrets de la Santé des Sols' },
                description: { en: 'Maintain nutrient-rich soil for better yield.' },
                videoUrl: 'https://sample.com',
                thumbnail: '/img/project_saffron.png',
                category: 'Education',
                isFree: true
            }
        ]);

        // Books
        await Book.insertMany([
            {
                title: { en: 'The Green Morocco Plan', fr: 'Le Plan Maroc Vert' },
                description: { en: 'Comprehensive guide to the national agriculture strategy.' },
                author: 'Ministry of Agri',
                coverImage: '/img/project_dates.png',
                price: 0
            },
            {
                title: { en: 'Smart Irrigation Systems', fr: 'Systèmes d\'Irrigation Intelligents' },
                description: { en: 'Optimizing water usage with IoT.' },
                author: 'Dr. Ahmed Alami',
                coverImage: '/img/project_mint.png',
                price: 150
            },
            {
                title: { en: 'Organic Pest Control', fr: 'Lutte Biologique' },
                description: { en: 'Natural ways to protect your crops.' },
                author: 'Fatima Zahra',
                coverImage: '/img/project_bees.png',
                price: 120
            },
            {
                title: { en: 'Precision Farming Guide', fr: 'Guide d\'Agriculture de Précision' },
                description: { en: 'Maximizing yield with data analytics.' },
                author: 'TechAgri Institute',
                coverImage: '/img/product_argan_oil.png',
                price: 200
            }
        ]);

        // Articles
        await Article.insertMany([
            {
                title: { en: 'Future of Agri-Tech in Africa', fr: 'L\'avenir de l\'Agri-Tech en Afrique' },
                content: { en: 'How technology is transforming the continent.' },
                author: 'AI Expert',
                image: '/img/project_mint.png',
                category: 'Technology'
            },
            {
                title: { en: 'The Rise of Vertical Farming', fr: 'L\'essor de l\'Agriculture Verticale' },
                content: { en: 'Scaling up urban agriculture solutions.' },
                author: 'Sarah Jones',
                image: '/img/project_mint.png',
                category: 'Innovation'
            },
            {
                title: { en: 'Water Scarcity Solutions', fr: 'Solutions à la Pénurie d\'Eau' },
                content: { en: 'Innovative desalinization and recycling techniques.' },
                author: 'Hassan Benali',
                image: '/img/project_dates.png',
                category: 'Sustainability'
            },
            {
                title: { en: 'Blockchain in Supply Chain', fr: 'Blockchain dans la Chaîne d\'Approvisionnement' },
                content: { en: 'Ensuring transparency from farm to fork.' },
                author: 'CryptoFarm',
                image: '/img/product_atlas_honey.png',
                category: 'Technology'
            }
        ]);

        console.log('✅ Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
