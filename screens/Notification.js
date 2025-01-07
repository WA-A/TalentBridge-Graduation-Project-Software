import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Colors,
} from './../compnent/Style';
import { NightModeContext } from './NightModeContext';
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor } = Colors;

export default function NotificationsScreen({ navigation }) {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


   const baseUrl = Platform.OS === 'web'
        ? 'http://localhost:3000'
        : 'http://192.168.1.239:3000';

        const handleGetNotifications = async () => {
            try {
              const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
              if (!token) {
                console.error('Token not found');
                return;
              }
          
              const response = await fetch(`${baseUrl}/notification/getUserNotifications`, {
                method: 'GET',
                headers: {
                  'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
                  'Content-Type': 'application/json',
                },
              });
          
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch notifications');
              }
          
              const notificationsData = await response.json(); // تحويل الرد إلى JSON
              console.log('Notifications:', notificationsData);
          
              // تحديث الحالة بعد جلب الإشعارات
              setNotifications(notificationsData.notifications);
              setLoading(false); // إيقاف تحميل الشاشة
            } catch (error) {
              console.error('Error fetching notifications:', error.message);
              setLoading(false); // إيقاف تحميل الشاشة حتى لو حدث خطأ
            }
          };
          
  useEffect(() => {
   handleGetNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    console.log(notification);
    try {
        // تحديث حالة الإشعار إلى "read"
        await fetch(`${baseUrl}/notification/UpdateNotificationStatus/${notification._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Wasan__${await AsyncStorage.getItem('userToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'read' }),
        });

        // جلب المنشور المرتبط بالإشعار
        const response = await fetch(`${baseUrl}/post/GetPostById/${notification.data.postId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Wasan__${await AsyncStorage.getItem('userToken')}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }

        const postData = await response.json();
        console.log('Post Data:', postData);
        handleGetNotifications();
        // يمكنك التنقل إلى صفحة عرض المنشور أو فتح نافذة منبثقة لعرض تفاصيله
        // على سبيل المثال:
        navigation.navigate('PostFRomNotification', { post:postData.post,commentIde:notification.data.commentId,
            notificationType: notification.type,
     });
     console.log()

    } catch (error) {
        console.error('Error handling notification click:', error);
    }
};


  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.status === 'unread' ? styles.unreadNotification : {},
      ]}
      onPress={() => handleNotificationClick(item)}
    >
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationDate}>
        {new Date(item.dateSent).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  unreadNotification: {
    borderLeftWidth: 5,
    borderLeftColor: '#007BFF',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadNotification: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.tertiary,
    backgroundColor: Colors.secondary, // خلفية زرقاء فاتحة
    shadowColor: '#007BFF', // تأثير ظل
},

});

