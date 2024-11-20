<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  import { invalidateAll, goto } from '$app/navigation';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import EnhancedListItem from '$lib/components/EnhancedListItem.svelte';
  import { _ } from 'svelte-i18n';
  import { formatDate, formatTime } from '$lib/utils/dateFormat';

  export let data: PageData;

  $: bookings = data.bookings;
  $: activeBookings = bookings.filter(
    (booking) => !isPastBooking(booking.boatSchedule.startDateTime)
  );
  $: pastBookings = bookings.filter((booking) => isPastBooking(booking.boatSchedule.startDateTime));

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

  function isPastBooking(date: string | Date) {
    return new Date(date) <= new Date();
  }

  function handleEdit(bookingId: string) {
    goto(`/backend/bookings/${bookingId}/edit`);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold text-gray-900">{$_('bookings.title')}</h1>
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
          {$_('bookings.upcomingBookings')}
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
          {$_('bookings.pastBookings')}
          {#if pastBookings.length > 0}
            <span class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {pastBookings.length}
            </span>
          {/if}
        </button>
      </nav>
    </div>

    {#if activeTab === 'active'}
      {#if activeBookings.length === 0}
        <div class="text-center py-12">
          <p class="text-gray-500">{$_('bookings.noActiveBookings')}</p>
        </div>
      {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            {#each activeBookings as booking}
              <li>
                <EnhancedListItem
                  title={booking.boatSchedule.boat.name}
                  subtitle={booking.user.name}
                  date={booking.boatSchedule.startDateTime}
                  startTime={booking.boatSchedule.startDateTime}
                  endTime={booking.boatSchedule.endDateTime}
                  status="upcoming"
                  actions={[
                    {
                      type: 'edit',
                      onClick: () => handleEdit(booking.id),
                      title: $_('common.edit')
                    },
                    {
                      type: 'cancel',
                      onClick: () => (cancelBooking = booking),
                      title: $_('bookings.cancelBooking')
                    }
                  ]}
                />
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {:else if pastBookings.length === 0}
      <div class="text-center py-12">
        <p class="text-gray-500">{$_('bookings.noPastBookings')}</p>
      </div>
    {:else}
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          {#each pastBookings as booking}
            <li>
              <EnhancedListItem
                title={booking.boatSchedule.boat.name}
                subtitle={booking.user.name}
                date={booking.boatSchedule.startDateTime}
                startTime={booking.boatSchedule.startDateTime}
                endTime={booking.boatSchedule.endDateTime}
                status="past"
                actions={[
                  {
                    type: 'edit',
                    onClick: () => handleEdit(booking.id),
                    title: $_('common.edit')
                  }
                ]}
              />
            </li>
          {/each}
        </ul>
      </div>
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
          date: formatDate(cancelBooking.boatSchedule.startDateTime)
        }
      })
    : ''}
  onConfirm={handleCancelConfirm}
  onCancel={handleCancelCancel}
/>
