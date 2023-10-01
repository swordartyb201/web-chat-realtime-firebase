import { publicRoutes } from './routes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './Context/AuthProvider';
import './App.css';
import AppProvider from './Context/AppProvider';
import AddFriendModal from './components/Modals/AddFriendModal';
import AddChanelModal from './components/Modals/AddGroupModal';
import InviteMemberModal from './components/Modals/InviteMemberModal';

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppProvider>
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Page = route.component;
                            return <Route key={index} path={route.path} element={<Page />} />;
                        })}
                    </Routes>
                    <AddFriendModal />
                    <AddChanelModal />
                    <InviteMemberModal />
                </AppProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
