export type SpaceStatus = 'red' | 'yellow' | 'green'; // red: Full/不可預約, yellow: Shared/共享空間, green: Free/完全空閒

export interface Room {
  id: string;
  name: string; // e.g., "舍我樓 R402"
  buildingAddress: string; // e.g., "世新大學 舍我樓 4樓"
  buildingKey: 'she-wo' | 'guan-yuan' | 'library' | 'all';
  floor: string; // e.g., "4F"
  type: string; // e.g., "討論室", "靜音區", "沙發區"
  capacity: string; // e.g., "可容納 4-6 人"
  status: SpaceStatus;
  amenities: string[]; // e.g., ["插座", "大螢幕", "WiFi", "可交談"]
  nextAvailableTime?: string; // e.g., "14:00"
  imageUrl: string;
  description: string;
  allowFood?: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomLocation: string;
  date: string; // e.g., "今天 (10/24)" or "2026/06/02"
  timeSlot: string; // e.g., "14:00 - 15:00"
  duration: number; // e.g., 1, 2, 3
  seats: string; // e.g., "座位 A-12"
  details: string; // e.g., "附插座"
  qrCodeUrl: string;
  status: 'active' | 'completed' | 'cancelled';
  facilityTags: string[];
}

export interface FlashGroup {
  id: string;
  title: string; // e.g., "微積分期中考搶救小隊"
  category: '遊戲娛樂' | '讀書研究' | '桌遊聚會';
  categoryEmoji: string; // 🎮 | 📚 | 🎲
  time: string; // e.g., "明天 10:00 - 12:00"
  location: string; // e.g., "管理大樓 2F 靜音區"
  buildingAddress: string; // "Management Building 2F, Silent Zone"
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  members: Array<{
    name: string;
    avatarUrl: string;
    isCreator: boolean;
  }>;
  facilityTags: string[];
  mapUrl?: string; // stylized map image
}

export interface ChatMessage {
  id: string;
  groupId: string;
  sender: string;
  senderAvatar: string;
  isMe: boolean;
  text: string;
  timestamp: string; // e.g., "下午 1:52"
}

export interface Notification {
  id: string;
  type: 'booking' | 'group' | 'space' | 'system';
  icon: string; // material symbol icon name
  title: string;
  timeLabel: string; // e.g., "5m ago", "Yesterday"
  text: string;
  isUnread: boolean;
  relatedId?: string;
}

export interface UserProfile {
  studentId: string;
  realName: string;
  nickname: string;
  avatarUrl: string;
  notifyEnabled: boolean;
  privateEnabled: boolean;
}
