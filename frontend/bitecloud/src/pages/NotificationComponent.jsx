import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import logo from '../assets/logoDelivery.png';

const socket = io('http://localhost:5200');

const NotificationComponent = ({ onUnseenCountChange }) => {
    const [notifications, setNotifications] = useState([]);
    const [clickedIds, setClickedIds] = useState([]);
    const userId = localStorage.getItem('userId');

    const handleNotificationClick = async (id) => {
        if (!clickedIds.includes(id)) {
            setClickedIds((prev) => [...prev, id]);
            await axios.put(`http://localhost:5200/api/notification/updateSeenNotification/${id}`);
            onUnseenCountChange((prev) => Math.max(prev - 1, 0)); // reduce unseen count
        }
    };

    useEffect(() => {
        socket.emit('join', userId);

        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`http://localhost:5200/api/notification/retriveNotification/${userId}`);
                setNotifications(res.data.notifications);
            } catch (err) {
                console.error('❌ Failed to fetch notifications:', err);
            }
        };

        const checkNotificationSeenStatus = async () => {
            const notifications = await axios.get(`http://localhost:5200/api/notification/retrieveSeenNotificationList/${userId}`);
            const data = notifications.data.notificationList;
            const seenIds = data.map(item => item._id);
            setClickedIds(seenIds);

            const unseenCount = notifications.data.totalUnseenCount || (notifications.data.totalNotifications - seenIds.length);
            onUnseenCountChange(unseenCount);
        };

        fetchNotifications();
        checkNotificationSeenStatus();

        socket.on('notification', (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            onUnseenCountChange((prev) => prev + 1); // new unseen notification
        });

        return () => {
            socket.off('notification');
        };
    }, [userId, onUnseenCountChange]);

    return (
        <div className="max-w-lg mx-auto mt-5 px-4">
            {notifications.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">🔕 No notifications yet.</p>
            ) : (
                <ul className="relative z-10 w-[640px] max-h-[400px] overflow-y-auto flex flex-col gap-3 p-2 bg-white rounded-lg shadow-lg ring-1 ring-gray-300">
                    {[...notifications].reverse().map((note) => (
                        <li key={note._id}>
                            <button
                                role="menuitem"
                                onClick={() => handleNotificationClick(note._id)}
                                className={`flex w-full h-[90px] cursor-pointer select-none items-start gap-4 rounded-md px-4 py-2 text-start leading-tight transition-colors duration-300 ${
                                    clickedIds.includes(note._id) ? 'bg-slate-50' : 'bg-lime-200'
                                } hover:bg-blue-400 transform hover:scale-105`}
                            >
                                <img
                                    alt="notification icon"
                                    src={logo}
                                    className="h-24 w-24 rounded-full object-cover object-center"
                                />
                                <div className="flex flex-col flex-grow">
                                    <p className="text-xs text-gray-500">
                                        {new Date(note.createdAt).toLocaleString('en-US', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-700 font-semibold">
                                        {note.message}
                                    </p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationComponent;
