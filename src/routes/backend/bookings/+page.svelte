<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  import { invalidateAll } from '$app/navigation';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import { _ } from 'svelte-i18n';
  import { formatDate, formatTime } from '$lib/utils/dateFormat';

  export let data: PageData;

  $: bookings = data.bookings;
  $: activeBookings = bookings.filter((booking) => !isPastBooking(booking.boatSchedule.date));
  $: pastBookings = bookings.filter((booking) => isPastBooking(booking.boatSchedule.date));

  let activeTab = 'active';
  let cancelBooking: any = null;

  function handleCancelConfirm() {
    const formData = new FormData();
    formData.append('id', cancelBooking.id);

    fetch('?/cancel', {
      method: 'POST',
      body: formData
    }).then(async (response) => {
      if (response.ok) {
        await invalidateAll();
        cancelBooking = null;
      }
    });
  }

  function handleCancelCancel() {
    cancelBooking = null;
  }

  function isPastBooking(date: string) {
    return new Date(date) <= new Date();
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold text-gray-900">{$_('common.allBookings')}</h1>
  </div>

  {#if bookings.length === 0}
    <div class="text-center py-12">
      <div class="flex justify-center mb-4">
        <svg
          class="w-20 h-20 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-label="Boat in the sea"
        >
          <!-- Waves -->
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M3 15c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M3 18c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0"
          />
          <!-- Boat -->
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M7 10l5-6 5 6"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M5 12h14l-1 3H6l-1-3z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{$_('bookings.noBookingsYet')}</h3>
      <p class="text-gray-500">{$_('bookings.bookingsWillAppear')}</p>
    </div>
  {:else}
    <!-- Tabs -->
    <div class="mb-6">
      <nav class="flex space-x-4 border-b border-gray-200" aria-label="Tabs">
        <button
          class={`${
            activeTab === 'active'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          on:click={() => (activeTab = 'active')}
        >
          {$_('common.upcomingBookings')}
          {#if activeBookings.length > 0}
            <span class="ml-2 bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs">
              {activeBookings.length}
            </span>
          {/if}
        </button>
        <button
          class={`${
            activeTab === 'past'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          on:click={() => (activeTab = 'past')}
        >
          {$_('common.pastBookings')}
          {#if pastBookings.length > 0}
            <span class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {pastBookings.length}
            </span>
          {/if}
        </button>
      </nav>
    </div>

    <!-- Upcoming Bookings Tab -->
    {#if activeTab === 'active'}
      {#if activeBookings.length === 0}
        <div class="text-center py-12">
          <div class="flex justify-center mb-4">
            <svg
              class="w-20 h-20 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-label="Boat in the sea"
            >
              <!-- Waves -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M3 15c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M3 18c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0"
              />
              <!-- Boat -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M7 10l5-6 5 6"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M5 12h14l-1 3H6l-1-3z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {$_('bookings.noUpcomingBookings')}
          </h3>
          <p class="text-gray-500">{$_('bookings.upcomingBookingsWillAppear')}</p>
        </div>
      {:else}
        <div class="bg-white shadow-sm overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            {#each activeBookings as booking}
              <li>
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-lg font-medium text-gray-900 truncate">
                        {booking.boatSchedule.boat.name}
                      </h3>
                      <p class="text-sm text-gray-500">
                        {$_('bookings.bookedBy')}: {booking.user.name}
                      </p>
                      <div class="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg
                            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          {formatDate(booking.boatSchedule.date)}
                        </div>
                        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg
                            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          {formatTime(booking.boatSchedule.startTime)} - {formatTime(
                            booking.boatSchedule.endTime
                          )}
                        </div>
                        <div class="mt-2 flex items-center text-sm sm:mt-0">
                          <span
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                          >
                            {$_('bookings.upcoming')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="ml-5 flex-shrink-0">
                      <button
                        type="button"
                        class="inline-flex items-center p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        on:click={() => (cancelBooking = booking)}
                        title={$_('common.cancel')}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-5 h-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {:else}
      <!-- Past Bookings Tab -->
      {#if pastBookings.length === 0}
        <div class="text-center py-12">
          <div class="flex justify-center mb-4">
            <svg
              class="w-20 h-20 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-label="Boat in the sea"
            >
              <!-- Waves -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M3 15c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M3 18c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0"
              />
              <!-- Boat -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M7 10l5-6 5 6"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M5 12h14l-1 3H6l-1-3z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{$_('bookings.noPastBookings')}</h3>
          <p class="text-gray-500">{$_('bookings.pastBookingsWillAppear')}</p>
        </div>
      {:else}
        <div class="bg-white shadow-sm overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            {#each pastBookings as booking}
              <li>
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-lg font-medium text-gray-900 truncate">
                        {booking.boatSchedule.boat.name}
                      </h3>
                      <p class="text-sm text-gray-500">
                        {$_('bookings.bookedBy')}: {booking.user.name}
                      </p>
                      <div class="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg
                            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          {formatDate(booking.boatSchedule.date)}
                        </div>
                        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg
                            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          {formatTime(booking.boatSchedule.startTime)} - {formatTime(
                            booking.boatSchedule.endTime
                          )}
                        </div>
                        <div class="mt-2 flex items-center text-sm sm:mt-0">
                          <span
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
                          >
                            {$_('bookings.past')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/if}
  {/if}
</div>

<ConfirmModal
  isOpen={!!cancelBooking}
  title={$_('bookings.cancelBooking')}
  message={cancelBooking
    ? $_('bookings.cancelConfirmation', {
        values: {
          boat: cancelBooking.boatSchedule.boat.name,
          date: formatDate(cancelBooking.boatSchedule.date)
        }
      })
    : ''}
  onConfirm={handleCancelConfirm}
  onCancel={handleCancelCancel}
/>
