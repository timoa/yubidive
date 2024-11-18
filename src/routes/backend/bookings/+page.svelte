<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  import { format } from 'date-fns';
  import { invalidateAll } from '$app/navigation';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';

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
    <h1 class="text-2xl font-bold text-gray-900">All Bookings</h1>
  </div>

  {#if bookings.length === 0}
    <div class="text-center py-12">
      <div class="flex justify-center mb-4">
        <svg class="w-20 h-20 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-label="Boat in the sea">
          <!-- Waves -->
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 18c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0" />
          <!-- Boat -->
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 10l5-6 5 6" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14l-1 3H6l-1-3z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
      <p class="text-gray-500">
        Bookings will appear here once customers start making reservations.
      </p>
    </div>
  {:else}
    <!-- Tabs -->
    <div class="mb-6">
      <nav class="flex space-x-4 border-b border-gray-200" aria-label="Tabs">
        <button
          class="px-3 py-2 text-sm font-medium {activeTab === 'active'
            ? 'text-primary-600 border-b-2 border-primary-500'
            : 'text-gray-500 hover:text-gray-700'}"
          on:click={() => (activeTab = 'active')}
        >
          Active Bookings
          {#if activeBookings.length > 0}
            <span class="ml-2 bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs">
              {activeBookings.length}
            </span>
          {/if}
        </button>
        <button
          class="px-3 py-2 text-sm font-medium {activeTab === 'past'
            ? 'text-primary-600 border-b-2 border-primary-500'
            : 'text-gray-500 hover:text-gray-700'}"
          on:click={() => (activeTab = 'past')}
        >
          Past Bookings
          {#if pastBookings.length > 0}
            <span class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {pastBookings.length}
            </span>
          {/if}
        </button>
      </nav>
    </div>

    <!-- Active Bookings Tab -->
    {#if activeTab === 'active'}
      {#if activeBookings.length === 0}
        <div class="text-center py-12">
          <div class="flex justify-center mb-4">
            <svg class="w-20 h-20 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-label="Boat in the sea">
              <!-- Waves -->
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 18c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0" />
              <!-- Boat -->
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 10l5-6 5 6" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14l-1 3H6l-1-3z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No active bookings</h3>
          <p class="text-gray-500">Active bookings will appear here</p>
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
                        Booked by: {booking.user.name}
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
                          {format(new Date(booking.boatSchedule.date), 'PPP')}
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
                          {format(new Date(booking.boatSchedule.startTime), 'HH:mm')} - {format(
                            new Date(booking.boatSchedule.endTime),
                            'HH:mm'
                          )}
                        </div>
                        <div class="mt-2 flex items-center text-sm sm:mt-0">
                          <span
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                          >
                            Upcoming
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="ml-5 flex-shrink-0">
                      <button
                        type="button"
                        class="inline-flex items-center p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full"
                        on:click={() => (cancelBooking = booking)}
                        aria-label="Cancel booking"
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
                            d="M6 18L18 6M6 6l12 12"
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
            <svg class="w-20 h-20 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-label="Boat in the sea">
              <!-- Waves -->
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 18c2.5-1 5-1 7.5 0s5 1 7.5 0 5-1 7.5 0" />
              <!-- Boat -->
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 10l5-6 5 6" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14l-1 3H6l-1-3z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No past bookings</h3>
          <p class="text-gray-500">Completed bookings will appear here</p>
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
                        Booked by: {booking.user.name}
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
                          {format(new Date(booking.boatSchedule.date), 'PPP')}
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
                          {format(new Date(booking.boatSchedule.startTime), 'HH:mm')} - {format(
                            new Date(booking.boatSchedule.endTime),
                            'HH:mm'
                          )}
                        </div>
                        <div class="mt-2 flex items-center text-sm sm:mt-0">
                          <span
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
                          >
                            Past
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
  title="Cancel Booking"
  message={cancelBooking
    ? `Are you sure you want to cancel the booking for ${cancelBooking.boatSchedule.boat.name} on ${format(new Date(cancelBooking.boatSchedule.date), 'PPP')}? This action cannot be undone.`
    : ''}
  onConfirm={handleCancelConfirm}
  onCancel={handleCancelCancel}
/>
