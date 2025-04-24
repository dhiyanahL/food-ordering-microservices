import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import logo from './assets/logoDelivery.png';

const socket = io('http://localhost:8000');

const NotificationComponent = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [clickedIds, setClickedIds] = useState([]);
   




    const handleNotificationClick = async(id) => {
        if (!clickedIds.includes(id)) {
          setClickedIds((prev) => [...prev, id]);
          await axios.put(`http://localhost:8000/api/notification/updateSeenNotification/${id}`);
        }

        
      };
      

    useEffect(() => {
        // Join the user's room
        socket.emit('join', 123);
        console.log("🔌 Joined room:", 123);

        const fetchNotifications = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/notification/retriveNotification/123');
                setNotifications(res.data.notifications); // assuming the response is an array of notifications
            } catch (err) {
                console.error('❌ Failed to fetch notifications:', err);
            }
        };
    
        fetchNotifications();

        const checkNotificationSeenSatus = async() =>{

            const notifications = await axios.get('http://localhost:8000/api/notification/retrieveSeenNotificationList/123');
            const data = notifications.data.notificationList;
            const seenIds = data.map(item => item._id); 
            setClickedIds(seenIds); 
            
            


        }

        checkNotificationSeenSatus();

   
        // Listen for new notifications
        socket.on('notification', (notification) => {
            console.log('📥 New Notification:', notification);
            setNotifications((prev) => [notification,...prev]);
        });

        // Clean up listener on unmount
        return () => {
            socket.off('notification');
        };
    }, [123]);

    return (
        <div className="max-w-lg mx-auto mt-5 px-4">
       
        {notifications.length === 0 ? (
          <p>🔕 No notifications yet.</p>
        ) : (
          <ul
            role="menu"
            data-popover="notifications-menu"
            data-popover-placement="bottom"
            className="absolute z-10 w-[640px] max-h-[400px] overflow-y-auto flex flex-col gap-3 ..."

          >

{[...notifications].reverse().map((note) => {

  return (
    <li key={note._id}>
<button
  role="menuitem"
  onClick={() => handleNotificationClick(note._id)}
  className={`flex w-[570px] h-[90px] cursor-pointer select-none items-start gap-4 rounded-md px-2 py-2 text-start leading-tight outline-none transition-colors duration-300 ${
    clickedIds.includes(note._id) ? '!bg-slate-50' : '!bg-lime-200'
  } hover:bg-blue-400`}
>
  <img
    alt="notification icon"
    src={logo}
    className="h-20 w-10 shrink-0 rounded-full object-cover object-center"
  />
    <p className="absolute bottom right-15 text-xs text-gray-500">
    {new Date(note.createdAt).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })}
  </p>
  <p className="text-sm  gap-4 pr-25 font-normal leading-snug text-gray-700 break-words overflow-hidden">
    <span className="font-roboto text-sm text-green-900 dark:text-teal-400">
      {note.message}
    </span>
  </p>

</button>

    </li>
  );
})}


        
          </ul>
        )}
      </div>
      
    );
};

export default NotificationComponent;
