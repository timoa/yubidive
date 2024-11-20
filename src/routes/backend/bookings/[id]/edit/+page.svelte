<script lang="ts">
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  import { _ } from 'svelte-i18n';
  import { formatDate, formatTime } from '$lib/utils/dateFormat';

  export let data: PageData;

  $: booking = data.booking;
  $: availableSchedules = data.availableSchedules;
  $: selectedScheduleId = booking.boatSchedule.id;
</script>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-3xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">{$_('bookings.editBooking')}</h1>
      <p class="text-gray-500">
        {$_('bookings.editBookingDescription')}
      </p>
    </div>

    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">{$_('bookings.currentBooking')}</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="font-medium text-gray-900">{booking.boatSchedule.boat.name}</p>
            <p class="text-gray-500 mt-1">
              {formatDate(booking.boatSchedule.startDateTime)} •
              {formatTime(booking.boatSchedule.startDateTime)} -
              {formatTime(booking.boatSchedule.endDateTime)}
            </p>
          </div>
        </div>

        <form method="POST" use:enhance>
          <div class="space-y-4">
            <div>
              <label for="scheduleId" class="block text-sm font-medium text-gray-700 mb-2">
                {$_('bookings.selectNewTime')}
              </label>
              <div class="space-y-2">
                {#each availableSchedules as schedule}
                  <label
                    class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="scheduleId"
                      value={schedule.id}
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      bind:group={selectedScheduleId}
                    />
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">
                        {formatDate(schedule.startDateTime)}
                      </p>
                      <p class="text-sm text-gray-500">
                        {formatTime(schedule.startDateTime)} - {formatTime(schedule.endDateTime)}
                      </p>
                    </div>
                  </label>
                {/each}
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <a
                href="/backend/bookings"
                class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {$_('common.cancel')}
              </a>
              <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {$_('common.save')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
