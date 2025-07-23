// Định nghĩa các kiểu dữ liệu
export type User = {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastActive?: string;
  timeJoined?: string;
  nameTag?: string; // Thêm trường nameTag
};

export type Message = {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: {
    type: "image" | "file" | "voice" | "location";
    url: string;
    name?: string;
    size?: string;
    duration?: string;
    previewUrl?: string;
  }[];
};

export type Conversation = {
  id: number;
  participants: User[];
  messages: Message[];
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: number;
    read: boolean;
  };
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: 0, // Current user
    name: "Bạn",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    status: "online"
  },
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
    status: "online"
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    status: "away",
    lastActive: "10 phút trước"
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    status: "offline",
    lastActive: "2 giờ trước"
  },
  {
    id: 4,
    name: "Phạm Thị D",
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    status: "online"
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
    status: "offline",
    lastActive: "1 ngày trước"
  },
  {
    id: 6,
    name: "Vũ Thị F",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    status: "online"
  },
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 1,
    participants: [mockUsers[0], mockUsers[1]],
    messages: [
      {
        id: 1,
        senderId: 1,
        content: "Bạn còn giữ slide buổi thuyết trình hôm trước không?",
        timestamp: "2025-07-22T08:30:00",
        read: true
      },
      {
        id: 2,
        senderId: 0,
        content: "Có chứ, để mình gửi cho nhé!",
        timestamp: "2025-07-22T08:32:00",
        read: true
      },
      {
        id: 3,
        senderId: 1,
        content: "Tuyệt vời, cảm ơn bạn nhiều!",
        timestamp: "2025-07-22T08:34:00",
        read: true
      }
    ],
    lastMessage: {
      content: "Tuyệt vời, cảm ơn bạn nhiều!",
      timestamp: "2025-07-22T08:34:00",
      senderId: 1,
      read: true
    },
    unreadCount: 0,
    isGroup: false
  },
  {
    id: 2,
    participants: [mockUsers[0], mockUsers[2]],
    messages: [
      {
        id: 1,
        senderId: 2,
        content: "Bạn thấy giao diện mình mới thiết kế ổn không?",
        timestamp: "2025-07-22T07:20:00",
        read: true
      },
      {
        id: 2,
        senderId: 0,
        content: "Trông ổn đấy, có vài điểm mình góp ý thêm.",
        timestamp: "2025-07-22T07:25:00",
        read: true
      },
      {
        id: 3,
        senderId: 2,
        content: "Cứ thoải mái nhé, mình đang cần feedback.",
        timestamp: "2025-07-22T07:26:00",
        read: false
      },
      {
        id: 4,
        senderId: 2,
        content: "À, nhớ giúp mình review code phần auth nữa.",
        timestamp: "2025-07-22T07:27:00",
        read: false
      }
    ],
    lastMessage: {
      content: "À, nhớ giúp mình review code phần auth nữa.",
      timestamp: "2025-07-22T07:27:00",
      senderId: 2,
      read: false
    },
    unreadCount: 2,
    isGroup: false
  },
  {
    id: 3,
    participants: [mockUsers[0], mockUsers[3]],
    messages: [
      {
        id: 1,
        senderId: 0,
        content: "Tối qua đi ăn quán bún bò đó ngon thiệt ha!",
        timestamp: "2025-07-21T18:30:00",
        read: true
      }
    ],
    lastMessage: {
      content: "Tối qua đi ăn quán bún bò đó ngon thiệt ha!",
      timestamp: "2025-07-21T18:30:00",
      senderId: 0,
      read: true
    },
    unreadCount: 0,
    isGroup: false
  },
  {
    id: 4,
    participants: [mockUsers[0], mockUsers[4]],
    messages: [
      {
        id: 1,
        senderId: 4,
        content: "Làm poster sự kiện xong chưa gửi chị xem nào!",
        timestamp: "2025-07-21T14:10:00",
        read: true
      },
      {
        id: 2,
        senderId: 0,
        content: "Vừa xong đây chị ơi!",
        timestamp: "2025-07-21T14:15:00",
        read: true,
        attachments: [
          {
            type: "file",
            url: "#",
            name: "poster_final.pdf",
            size: "3.2 MB"
          }
        ]
      }
    ],
    lastMessage: {
      content: "Vừa xong đây chị ơi!",
      timestamp: "2025-07-21T14:15:00",
      senderId: 0,
      read: true
    },
    unreadCount: 0,
    isGroup: false
  },
  {
    id: 5,
    participants: [mockUsers[0], mockUsers[5]],
    messages: [
      {
        id: 1,
        senderId: 5,
        content: "Code demo bạn gửi hôm qua chạy chưa?",
        timestamp: "2025-07-20T09:45:00",
        read: true
      },
      {
        id: 2,
        senderId: 0,
        content: "Chạy ổn rồi nhé, không lỗi gì hết!",
        timestamp: "2025-07-20T09:50:00",
        read: true
      }
    ],
    lastMessage: {
      content: "Chạy ổn rồi nhé, không lỗi gì hết!",
      timestamp: "2025-07-20T09:50:00",
      senderId: 0,
      read: true
    },
    unreadCount: 0,
    isGroup: false
  },
  {
    id: 6,
    participants: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3]],
    messages: [
      {
        id: 1,
        senderId: 1,
        content: "Mọi người check lại deadline sprint tuần này nhé!",
        timestamp: "2025-07-19T10:00:00",
        read: true
      },
      {
        id: 2,
        senderId: 2,
        content: "Tớ xong phần UI rồi, còn backend sao rồi?",
        timestamp: "2025-07-19T10:02:00",
        read: true
      },
      {
        id: 3,
        senderId: 0,
        content: "Tớ push phần login hôm qua rồi đó!",
        timestamp: "2025-07-19T10:05:00",
        read: true
      }
    ],
    lastMessage: {
      content: "Tớ push phần login hôm qua rồi đó!",
      timestamp: "2025-07-19T10:05:00",
      senderId: 0,
      read: true
    },
    unreadCount: 0,
    isGroup: true,
    groupName: "Dự án WeConnect",
    groupAvatar: "https://t4.ftcdn.net/jpg/02/07/94/95/360_F_207949567_GK0J6245kGnx4nmPxFRB1iVKIcsTxzWN.jpg"
  }
];


// Helper function to format date
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  // Today
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Hôm qua';
  }

  // Within a week
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  if (date > oneWeekAgo) {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return date.toLocaleDateString('vi-VN', options);
  }

  // Other dates
  return date.toLocaleDateString('vi-VN');
};
