import { useEffect, useState } from 'react';
import { onSnapshot, collection, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase/config';

function useFirestore(collectionName, condition) {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let collectionRef = collection(db, collectionName);
                let queryRef = query(collectionRef, orderBy('createdAt'));

                if (condition) {
                    if (!condition.compareValues || !condition.compareValues.length) {
                        return;
                    }
                    // Sử dụng điều kiện từ tham số condition
                    queryRef = query(
                        collectionRef,
                        orderBy('createdAt'),
                        where(condition.fieldName, condition.operator, condition.compareValues),
                    );
                }

                const unsubscribe = onSnapshot(queryRef, (snapshot) => {
                    const documentsData = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setDocuments(documentsData);
                });

                return () => {
                    unsubscribe(); // Hủy đăng ký theo dõi khi component unmount
                };
            } catch (error) {
                console.error('Lỗi khi đọc dữ liệu từ Firestore:', error);
            }
        };

        fetchData();
    }, [collectionName, condition]);

    return documents;
}

export default useFirestore;
