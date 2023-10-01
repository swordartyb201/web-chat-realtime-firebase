import { Avatar, Form, Modal, Select, Spin } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../Context/AppProvider';
import { debounce } from 'lodash';
import { db } from '../../firebase/config';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';

function DebounceSelect({ fectchOptions, debounceTimeout = 300, curMembers, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fectchOptions(value, curMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fectchOptions, curMembers]);

    useEffect(() => {
        return () => {
            setOptions([]);
        };
    }, []);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
        >
            {options.map((opt) => (
                <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                    <Avatar size="small" src={opt.photoURL}>
                        {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {`${opt.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

async function fetchUserList(search, curMembers) {
    const q = query(
        collection(db, 'users'),
        where('keywords', 'array-contains', search),
        orderBy('displayName'),
        limit(20),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs
        .map((doc) => ({
            label: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL,
        }))
        .filter((opt) => !curMembers.includes(opt.value));
}

export default function InviteMemberModal() {
    const {
        user: { uid },
    } = useContext(AuthContext);
    const [value, setValue] = useState([]);
    const { isAddFriendOpen, setIsAddFriendOpen, result } = useContext(AppContext);
    const [form] = Form.useForm();
    const handleOk = async () => {
        form.resetFields();
        setValue([]);

        addDocument('friends', { members: [uid, ...value.map((val) => val.value)] });
        setIsAddFriendOpen(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setValue([]);
        setIsAddFriendOpen(false);
    };
    return (
        <div>
            <Modal
                title="Thêm bạn bè"
                open={isAddFriendOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <Form form={form} layout="vertical">
                    <DebounceSelect
                        mode="multiple"
                        name="search-user"
                        label="Tên người dùng"
                        value={value}
                        placeholder="Nhập tên người dùng"
                        fectchOptions={fetchUserList}
                        onChange={(newValue) => setValue(newValue)}
                        style={{ width: '100%' }}
                        curMembers={result}
                    />
                </Form>
            </Modal>
        </div>
    );
}
