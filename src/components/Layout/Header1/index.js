import React, { useContext } from 'react';
import { Avatar, Typography } from 'antd';
import { styled } from 'styled-components';
import { AppContext } from '../../../Context/AppProvider';

const HeaderStyled = styled.div`
    height: 36px;
    padding: 10px 16px;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    .username {
        font-weight: bold;
        margin-left: 5px;
        color: black;
    }
`;
export default function Header1() {
    const { selectedFriend } = useContext(AppContext);
    return (
        <div>
            <HeaderStyled>
                <div>
                    <Avatar src={selectedFriend.photoURL}>
                        {selectedFriend.photoURL ? '' : selectedFriend.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Typography.Text className="username">{selectedFriend.displayName}</Typography.Text>
                </div>
            </HeaderStyled>
        </div>
    );
}
