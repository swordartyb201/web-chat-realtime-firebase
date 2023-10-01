import React, { useState } from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { FacebookFilled, GoogleCircleFilled } from '@ant-design/icons';
import images from '../../../images';
import { signInWithPopup } from 'firebase/auth';
import { auth, providerGg, providerFb } from '../../../firebase/config';
import { addDocument, generateKeywords } from '../../../firebase/services';

const { Title } = Typography;

export default function Login() {
    const [user, setUser] = useState({});
    const handleGgLogin = async () => {
        const result = await signInWithPopup(auth, providerGg);
        const user = result.user;
        const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
        if (isNewUser) {
            addDocument('users', {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: result.providerId,
                keywords: generateKeywords(user.displayName),
            });
        }
        setUser(user);
        localStorage.setItem('email', user.email);
    };

    const handleFbLogin = async () => {
        const result = await signInWithPopup(auth, providerFb);
        const user = result.user;
        const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
        if (isNewUser) {
            addDocument('users', {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: result.providerId,
                keywords: generateKeywords(user.displayName),
            });
        }
        setUser(user);
        localStorage.setItem('email', user.email);
    };

    return (
        <div>
            <Row justify="center" style={{ height: '800' }}>
                <Col span={8}>
                    <Title style={{ textAlign: 'center' }} level={3}>
                        <img src={images.logo} alt="logo" />
                    </Title>
                    <Button style={{ width: '100%' }} onClick={handleFbLogin}>
                        <FacebookFilled />
                        Đăng nhập bằng Facebook
                    </Button>
                    <Button style={{ width: '100%' }} onClick={handleGgLogin}>
                        <GoogleCircleFilled />
                        Đăng nhập bằng Gmail
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
