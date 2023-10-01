import { Col, Row } from 'antd';
import React from 'react';
import UserAction from '../UserAction';
import ChatList from '../ChatList';
import { styled } from 'styled-components';

const SidebarStyles = styled.div`
    background: #c99fbb;
    color: #e4e6eb;
    height: 100vh;
`;
export default function Sidebar() {
    return (
        <SidebarStyles>
            <Row>
                <Col span={24}>
                    <UserAction />
                </Col>
                <Col span={24}>
                    <ChatList />
                </Col>
            </Row>
        </SidebarStyles>
    );
}
