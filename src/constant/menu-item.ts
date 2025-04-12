import { Calendar, LucideIcon, User } from 'lucide-react';

interface MenuItem {
  icon: LucideIcon;
  name: string;
  link: string;
}

export const menuItems: MenuItem[] = [
  {
    icon: Calendar,
    name: '일간 타임테이블',
    link: '/daily',
  },
  {
    icon: Calendar,
    name: '주간 타임테이블',
    link: '/weekly',
  },
  {
    icon: User,
    name: '내 예약',
    link: '/my-reservations',
  },
];
