<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { format } from 'date-fns';
  import type { PageData } from './$types';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';

  export let data: PageData;
  let deleteBooking: any = null;

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' }
  ];

  function formatDateTime(date: Date, time: Date) {
    return format(new Date(time), 'MMM d, yyyy h:mm a');
  }

  let editingBooking: any = null;

  function handleDeleteConfirm() {
    const formData = new FormData();
    formData.append('bookingId', deleteBooking.id);

    fetch('?/deleteBooking', {
      method: 'POST',
      body: formData
    }).then(async (response) => {
      if (response.ok) {
        await invalidateAll();
        deleteBooking = null;
      }
    });
  }

  function handleDeleteCancel() {
    deleteBooking = null;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Manage Bookings</h1>

  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Customer</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Boat</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Schedule</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Status</th
            >
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Actions</th
            >
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each data.bookings as booking}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {booking.user.name}
                </div>
                <div class="text-sm text-gray-500">{booking.user.email}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {booking.boatSchedule.boat.name}
                </div>
                <div class="text-sm text-gray-500">
                  {booking.boatSchedule.boat.type}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {formatDateTime(booking.boatSchedule.date, booking.boatSchedule.startTime)}
                </div>
                <div class="text-sm text-gray-500">
                  to {formatDateTime(booking.boatSchedule.date, booking.boatSchedule.endTime)}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {#if editingBooking?.id === booking.id}
                  <form
                    method="POST"
                    action="?/updateStatus"
                    use:enhance={() => {
                      return async ({ update }) => {
                        await update();
                        await invalidateAll();
                        editingBooking = null;
                      };
                    }}
                  >
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <select
                      name="status"
                      class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      value={booking.status}
                    >
                      {#each statusOptions as option}
                        <option value={option.value}>{option.label}</option>
                      {/each}
                    </select>
                  </form>
                {:else}
                  <div class="flex items-center">
                    <span
                      class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                      ${booking.status === 'confirmed' ? 'text-green-800 bg-green-100' : ''}
                      ${booking.status === 'pending' ? 'text-yellow-800 bg-yellow-100' : ''}
                      ${booking.status === 'cancelled' ? 'text-red-800 bg-red-100' : ''}
                      ${booking.status === 'completed' ? 'text-blue-800 bg-blue-100' : ''}
                    `}
                    >
                      {booking.status}
                    </span>
                  </div>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  {#if editingBooking?.id === booking.id}
                    <form
                      method="POST"
                      action="?/updateStatus"
                      use:enhance={() => {
                        return async ({ update }) => {
                          await update();
                          await invalidateAll();
                          editingBooking = null;
                        };
                      }}
                      class="inline-block"
                    >
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <input type="hidden" name="status" value={booking.status} />
                      <button
                        type="submit"
                        class="inline-flex items-center p-1.5 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-full"
                        title="Save changes"
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
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </button>
                    </form>
                    <button
                      type="button"
                      class="inline-flex items-center p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                      on:click={() => (editingBooking = null)}
                      title="Cancel editing"
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
                  {:else}
                    <button
                      type="button"
                      class="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full"
                      on:click={() => (editingBooking = booking)}
                      title="Edit booking"
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full"
                      on:click={() => (deleteBooking = booking)}
                      title="Delete booking"
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
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<ConfirmModal
  isOpen={!!deleteBooking}
  title="Delete Booking"
  message={deleteBooking
    ? `Are you sure you want to delete the booking for ${deleteBooking.user.name}? This action cannot be undone.`
    : ''}
  onConfirm={handleDeleteConfirm}
  onCancel={handleDeleteCancel}
/>
