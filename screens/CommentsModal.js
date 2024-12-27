import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useRoute } from '@react-navigation/native';

const CommentsModal = ({ postId }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [imageUri, setImageUri] = useState('');

    // دالة لفتح الـ Modal
    const toggleModal = () => setModalVisible(!isModalVisible);

    // دالة لإضافة تعليق جديد
    const addComment = () => {
        if (newComment) {
            const newComments = [...comments, { text: newComment, user: 'User', image: imageUri }];
            setComments(newComments);
            setNewComment('');
            setImageUri('');
        }
    };

    // دالة لتحميل التعليقات من الخادم (إذا كان لديك API)
    useEffect(() => {
        // هنا يمكنك استخدام API لاستدعاء التعليقات بناءً على `postId`
        // مثل:
        // fetchComments(postId).then((data) => setComments(data));

        // مثال تعليقات ثابتة لتجربة العرض
        setComments([
            { user: 'User 1', text: 'Nice post!', image: '' },
            { user: 'User 2', text: 'Amazing!', image: 'https://path-to-image.com/image.jpg' },
        ]);
    }, [postId]);

    return (
        <View>
            <Button title="Show Comments" onPress={toggleModal} />
            
            {/* مودال التعليقات */}
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={{ backgroundColor: 'white', padding: 20 }}>
                    <Text style={{ fontSize: 20, marginBottom: 10 }}>Comments</Text>
                    
                    {/* عرض التعليقات السابقة */}
                    <FlatList
                        data={comments}
                        renderItem={({ item }) => (
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{item.user}</Text>
                                <Text>{item.text}</Text>
                                {item.image ? <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} /> : null}
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    
                    {/* إضافة تعليق جديد */}
                    <TextInput
                        placeholder="Write a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
                    />
                    
                    {/* إضافة صورة إذا لزم الأمر */}
                    <TextInput
                        placeholder="Image URL"
                        value={imageUri}
                        onChangeText={setImageUri}
                        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
                    />
                    
                    <Button title="Add Comment" onPress={addComment} />
                </View>
            </Modal>
        </View>
    );
};

export default CommentsModal;
