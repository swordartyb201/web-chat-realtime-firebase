import { Form, Input, Modal } from 'antd';
import React, { useContext } from 'react';
import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';

const { TextArea } = Input;

export default function AddChanelModal() {
    const { isAddGroupOpen, setIsAddGroupOpen } = useContext(AppContext);
    const [form] = Form.useForm();
    const {
        user: { uid },
    } = useContext(AuthContext);
    const handleOk = () => {
        addDocument('groups', { ...form.getFieldsValue(), members: [uid] });
        setIsAddGroupOpen(false);

        form.resetFields();
    };
    const handleCancel = () => {
        setIsAddGroupOpen(false);
        form.resetFields();
    };
    return (
        <div>
            <Modal title="Tạo nhóm" open={isAddGroupOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên nhóm" name="name">
                        <Input placeholder="Nhập tên nhóm" />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <TextArea placeholder="Nhập mô tả" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
