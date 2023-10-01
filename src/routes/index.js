import WebChat from '../components/Pages/WebChat';
import Login from '../components/Pages/Login';

// Public Routes
const publicRoutes = [
    {
        path: '/chat',
        component: WebChat,
    },
    {
        path: '/',
        component: Login,
    },
];
const privateRoutes = [];

export { publicRoutes, privateRoutes };
