import { pb } from '$lib/pocketbase';
import type { RecordModel } from 'pocketbase';

export interface DashboardStats {
  totalBoats: number;
  activeBoats: number;
  totalBookings: number;
  upcomingBookings: number;
  revenue: number;
  bookingsOverTime: {
    labels: string[];
    data: number[];
  };
  revenueOverTime: {
    labels: string[];
    data: number[];
  };
  popularBoats: {
    labels: string[];
    data: number[];
  };
  bookingsByDay: {
    labels: string[];
    data: number[];
  };
  upcomingSchedules: Array<{
    id: string;
    title: string;
    datetime: string;
    bookingCount: number;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    console.log('Fetching dashboard stats...');

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Static data for demonstration
    return {
      totalBoats: 24,
      activeBoats: 18,
      totalBookings: 156,
      upcomingBookings: 12,
      revenue: 15890,
      bookingsOverTime: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        data: [65, 59, 80, 81, 56, 55]
      },
      revenueOverTime: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        data: [4500, 5900, 8000, 8100, 5600, 5500]
      },
      popularBoats: {
        labels: ['Blue Wave', 'Sea Spirit', 'Ocean Dream', 'Coral Explorer', 'Wave Rider'],
        data: [42, 38, 30, 25, 20]
      },
      bookingsByDay: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        data: [12, 19, 15, 22, 18, 25, 30]
      },
      upcomingSchedules: [
        {
          id: '1',
          title: 'Blue Wave - Diving Trip',
          datetime: new Date(Date.now() + 86400000).toLocaleString(), // Tomorrow
          bookingCount: 4
        },
        {
          id: '2',
          title: 'Sea Spirit - Sunset Cruise',
          datetime: new Date(Date.now() + 172800000).toLocaleString(), // Day after tomorrow
          bookingCount: 6
        },
        {
          id: '3',
          title: 'Ocean Dream - Morning Dive',
          datetime: new Date(Date.now() + 259200000).toLocaleString(), // 3 days from now
          bookingCount: 3
        }
      ]
    };
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    throw error;
  }
}
