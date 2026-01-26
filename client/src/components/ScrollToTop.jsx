import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Disable browser's default scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const scrollToTop = () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTo(0, 0);
            document.body.scrollTo(0, 0);

            // Scroll potential containers
            const appContainer = document.querySelector('.app-container');
            if (appContainer) appContainer.scrollTop = 0;

            const mainContent = document.querySelector('.main-content');
            if (mainContent) mainContent.scrollTop = 0;
        };

        // Immediate scroll
        scrollToTop();

        // Fallback for some browsers/situations
        const timer = setTimeout(scrollToTop, 10);
        const timer2 = setTimeout(scrollToTop, 50);

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, [pathname]);

    return null;
};

export default ScrollToTop;
