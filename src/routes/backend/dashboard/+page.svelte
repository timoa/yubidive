<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart } from 'chart.js/auto';
  import type { PageData } from './$types';
  import { _ } from 'svelte-i18n';

  export let data: PageData;

  let bookingsChartCanvas: HTMLCanvasElement;
  let bookingsByDayChartCanvas: HTMLCanvasElement;

  let bookingsChart: Chart;
  let bookingsByDayChart: Chart;

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

      // Bookings by day chart
      bookingsByDayChart = new Chart(bookingsByDayChartCanvas, {
        type: 'bar',
        data: {
          labels: data.stats.bookingsByDay.labels.map((i) =>
            $_(`common.weekDays.${weekDayKeys[i]}`)
          ),
          datasets: [
            {
              label: $_('dashboard.bookings'),
              data: data.stats.bookingsByDay.data,
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
    } catch (error) {
      console.error('Error initializing charts:', error);
    }
  });

  onDestroy(() => {
    bookingsChart?.destroy();
    bookingsByDayChart?.destroy();
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

    <!-- Bookings by Day -->
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-gray-700 font-medium mb-4">{$_('dashboard.bookingsByDay')}</h3>
      <div class="h-64">
        <canvas bind:this={bookingsByDayChartCanvas} />
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
