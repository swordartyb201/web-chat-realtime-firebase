import React, { useContext } from 'react';
import { Avatar, Button, Tooltip } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { styled } from 'styled-components';
import { AppContext } from '../../../Context/AppProvider';

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;

    .header {
        &-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &-title {
            margin: 0;
            font-weight: bold;
        }

        &-description {
            font-size: 12px;
        }
    }
`;

const ButtonStyled = styled.div`
    display: flex;
    lait-align: center;
`;
export default function Header() {
    const { selectedGroup, members, setIsInviteMemberOpen } = useContext(AppContext);

    return (
        <div>
            <HeaderStyled>
                <div className="header-info">
                    <p className="header-title">{selectedGroup.name}</p>
                    <span className="header-description">{selectedGroup.description}</span>
                </div>
                <ButtonStyled>
                    <Button icon={<UserAddOutlined />} type="text" onClick={() => setIsInviteMemberOpen(true)}>
                        Mời
                    </Button>
                    <Avatar.Group maxCount={2}>
                        {members.map((member) => (
                            <Tooltip title={member.displayName} key={member.id}>
                                <Avatar src={member.photoURL}>
                                    {member.photoURL ? '' : member.displayName?.charAt(0)?.toUpperCase()}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                </ButtonStyled>
            </HeaderStyled>
        </div>
    );
}
