<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';

  export let data: PageData;

  function formatDate(date: Date) {
    return new Date(date).toLocaleString();
  }

  function handleBookNow(scheduleId: string) {
    goto(`/members/bookings/new?scheduleId=${scheduleId}`);
  }
</script>

<div class="bg-white py-6">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 mb-8">
      {$_('dashboard.welcome', { values: { name: data.user?.name || '' } })}
    </h1>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Upcoming Bookings -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {$_('dashboard.upcomingBookings')}
          </h2>
          {#if data.upcomingBookings.length > 0}
            <div class="flow-root">
              <ul role="list" class="-my-5 divide-y divide-gray-200">
                {#each data.upcomingBookings as booking}
                  <li class="py-4">
                    <div class="flex items-center space-x-4">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          <a
                            href="/members/boats/{booking.boatSchedule.boat.id}"
                            class="hover:text-primary-600"
                          >
                            {booking.boatSchedule.boat.name}
                          </a>
                        </p>
                        <p class="text-sm text-gray-500">
                          {formatDate(booking.boatSchedule.startDateTime)}
                        </p>
                      </div>
                      <div>
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
            <div class="mt-6">
              <a
                href="/members/bookings"
                class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {$_('dashboard.viewAllBookings')}
              </a>
            </div>
          {:else}
            <p class="text-gray-500">
              {$_('dashboard.noUpcomingBookings')}
            </p>
          {/if}
        </div>
      </div>

      <!-- Available Dives -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {$_('dashboard.availableDives')}
          </h2>
          {#if data.availableDives.length > 0}
            <div class="flow-root">
              <ul role="list" class="-my-5 divide-y divide-gray-200">
                {#each data.availableDives as schedule}
                  <li class="py-4">
                    <div class="flex items-center space-x-4">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          <a
                            href="/members/boats/{schedule.boat.id}"
                            class="hover:text-primary-600"
                          >
                            {schedule.boat.name}
                          </a>
                        </p>
                        <p class="text-sm text-gray-500">
                          {formatDate(schedule.startDateTime)}
                        </p>
                        <p class="text-xs text-gray-500">
                          {schedule.bookings.length} / {schedule.boat.capacity}
                          {$_('dashboard.spots')}
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          on:click={() => handleBookNow(schedule.id)}
                          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          class:opacity-50={schedule.bookings.length >= schedule.boat.capacity}
                          class:cursor-not-allowed={schedule.bookings.length >=
                            schedule.boat.capacity}
                          class:pointer-events-none={schedule.bookings.length >=
                            schedule.boat.capacity}
                        >
                          {schedule.bookings.length >= schedule.boat.capacity
                            ? $_('boats.fullyBooked')
                            : $_('dashboard.bookNow')}
                        </button>
                      </div>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
            <div class="mt-6">
              <a
                href="/members/boats"
                class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {$_('dashboard.viewAllSchedules')}
              </a>
            </div>
          {:else}
            <p class="text-gray-500">
              {$_('dashboard.noAvailableDives')}
            </p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
