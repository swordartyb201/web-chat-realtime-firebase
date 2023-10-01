import { Avatar, Button, Typography } from 'antd';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { auth } from '../../../firebase/config';
import { AuthContext } from '../../../Context/AuthProvider';

const WrapperStyles = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e8e8e8;

    .username {
        color: white;
        margin-left: 5px;
        font-weight: bold;
    }

    .btn-logout:hover {
        border-color: black !important;
        color: black !important;
    }
`;
export default function UserAction() {
    const {
        user: { displayName, photoURL },
    } = useContext(AuthContext);

    return (
        <WrapperStyles>
            <div>
                <Avatar src={photoURL}>{photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
                <Typography.Text className="username">{displayName}</Typography.Text>
            </div>
            <Button ghost className="btn-logout" onClick={() => auth.signOut()}>
                Đăng xuất
            </Button>
        </WrapperStyles>
    );
}
