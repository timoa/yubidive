<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart } from 'chart.js/auto';
  import type { PageData } from './$types';
  import { _ } from 'svelte-i18n';

  export let data: PageData;

  let bookingsChartCanvas: HTMLCanvasElement;
  let bookingsByWeekChartCanvas: HTMLCanvasElement;
  let usersByRoleChartCanvas: HTMLCanvasElement;
  let bookingsByBoatChartCanvas: HTMLCanvasElement;

  let bookingsChart: Chart;
  let bookingsByWeekChart: Chart;
  let usersByRoleChart: Chart;
  let bookingsByBoatChart: Chart;

  const monthKeys = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
  ];

  const weekDayKeys = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ];

  onMount(() => {
    try {
      // Bookings over time chart
      bookingsChart = new Chart(bookingsChartCanvas, {
        type: 'line',
        data: {
          labels: data.stats.bookingsOverTime.labels.map((i) =>
            $_(`common.months.${monthKeys[i]}`)
          ),
          datasets: [
            {
              label: $_('dashboard.bookings'),
              data: data.stats.bookingsOverTime.data,
              borderColor: '#3b82f6',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                precision: 0
              }
            }
          }
        }
      });

      // Bookings by week chart
      bookingsByWeekChart = new Chart(bookingsByWeekChartCanvas, {
        type: 'bar',
        data: {
          labels: data.stats.bookingsByWeek.labels,
          datasets: [
            {
              label: $_('dashboard.bookings'),
              data: data.stats.bookingsByWeek.data,
              backgroundColor: '#3b82f6'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                precision: 0
              }
            }
          }
        }
      });

      // Users by Role donut chart
      usersByRoleChart = new Chart(usersByRoleChartCanvas, {
        type: 'doughnut',
        data: {
          labels: data.stats.usersByRole.labels.map((role) => $_(`common.roles.${role}`)),
          datasets: [
            {
              data: data.stats.usersByRole.data,
              backgroundColor: [
                '#10b981', // green for members
                '#3b82f6' // blue for admins
              ]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });

      // Bookings by Boat donut chart
      bookingsByBoatChart = new Chart(bookingsByBoatChartCanvas, {
        type: 'doughnut',
        data: {
          labels: data.stats.bookingsByBoat.labels,
          datasets: [
            {
              data: data.stats.bookingsByBoat.data,
              backgroundColor: [
                '#3b82f6', // blue
                '#10b981', // green
                '#f59e0b', // yellow
                '#ef4444', // red
                '#8b5cf6' // purple
              ]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    } catch (error) {
      console.error('Error initializing charts:', error);
    }
  });

  onDestroy(() => {
    bookingsChart?.destroy();
    bookingsByWeekChart?.destroy();
    usersByRoleChart?.destroy();
    bookingsByBoatChart?.destroy();
  });
</script>

<div class="container mx-auto px-4 py-8">
  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-500 text-sm font-medium">{$_('dashboard.totalBoats')}</h3>
      <p class="text-2xl font-bold">{data.stats.totalBoats}</p>
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-500 text-sm font-medium">{$_('dashboard.activeBoats')}</h3>
      <p class="text-2xl font-bold">{data.stats.activeBoats}</p>
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-500 text-sm font-medium">{$_('dashboard.totalBookings')}</h3>
      <p class="text-2xl font-bold">{data.stats.totalBookings}</p>
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-500 text-sm font-medium">{$_('dashboard.upcomingBookings')}</h3>
      <p class="text-2xl font-bold">{data.stats.upcomingBookings}</p>
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-500 text-sm font-medium">{$_('dashboard.totalUsers')}</h3>
      <p class="text-2xl font-bold">{data.stats.totalUsers}</p>
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-500 text-sm font-medium">{$_('dashboard.activeUsers')}</h3>
      <p class="text-2xl font-bold">{data.stats.activeUsers}</p>
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-500 text-sm font-medium">{$_('dashboard.newUsersLastMonth')}</h3>
      <p class="text-2xl font-bold">{data.stats.newUsersLastMonth}</p>
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-500 text-sm font-medium">{$_('dashboard.bookingsPerUser')}</h3>
      <p class="text-2xl font-bold">
        {Math.round((data.stats.totalBookings / data.stats.totalUsers) * 100) / 100}
      </p>
    </div>
  </div>

  <!-- Charts Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
    <!-- Bookings Over Time -->
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-700 font-medium mb-4">{$_('dashboard.bookingsOverTime')}</h3>
      <div class="h-64">
        <canvas bind:this={bookingsChartCanvas} />
      </div>
    </div>

    <!-- Bookings by Week -->
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-700 font-medium mb-4">{$_('dashboard.bookingsByWeek')}</h3>
      <div class="h-64">
        <canvas bind:this={bookingsByWeekChartCanvas} />
      </div>
    </div>

    <!-- Users by Role -->
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-700 font-medium mb-4">{$_('dashboard.usersByRole')}</h3>
      <div class="h-64">
        <canvas bind:this={usersByRoleChartCanvas} />
      </div>
    </div>

    <!-- Bookings by Boat -->
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-700 font-medium mb-4">{$_('dashboard.bookingsByBoat')}</h3>
      <div class="h-64">
        <canvas bind:this={bookingsByBoatChartCanvas} />
      </div>
    </div>
  </div>

  <!-- Upcoming Schedules -->
  <div class="bg-white p-4 rounded-lg shadow">
    <h3 class="text-gray-700 font-medium mb-4">{$_('dashboard.upcomingSchedules')}</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {$_('dashboard.boat')}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {$_('dashboard.dateTime')}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {$_('dashboard.bookings')}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each data.stats.upcomingSchedules as schedule}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {schedule.title}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {schedule.datetime}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {schedule.bookingCount}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
