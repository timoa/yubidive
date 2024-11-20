<script lang="ts">
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  import { _ } from 'svelte-i18n';
  import { format } from 'date-fns';
  import { formatDate, formatTime } from '$lib/utils/dateFormat';

  export let data: PageData;

  $: schedule = data.schedule;
  $: boats = data.boats;
  $: selectedBoat = schedule.boatId;
  $: selectedStartDateTime = format(new Date(schedule.startDateTime), 'yyyy-MM-ddTHH:mm');
  $: selectedEndDateTime = format(new Date(schedule.endDateTime), 'yyyy-MM-ddTHH:mm');

  let errorMessage = '';

  function validateForm() {
    if (!selectedBoat || !selectedStartDateTime || !selectedEndDateTime) {
      errorMessage = $_('schedules.allFieldsRequired');
      return false;
    }

    const start = new Date(selectedStartDateTime);
    const end = new Date(selectedEndDateTime);

    if (end <= start) {
      errorMessage = $_('schedules.endTimeMustBeAfterStart');
      return false;
    }

    if (start <= new Date()) {
      errorMessage = $_('schedules.startTimeMustBeFuture');
      return false;
    }

    errorMessage = '';
    return true;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-3xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">{$_('schedules.editSchedule')}</h1>
      <p class="text-gray-500">
        {$_('schedules.editScheduleDescription')}
      </p>
    </div>

    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">{$_('schedules.currentSchedule')}</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="font-medium text-gray-900">{schedule.boat.name}</p>
            <p class="text-gray-500 mt-1">
              {formatDate(schedule.startDateTime)} •
              {formatTime(schedule.startDateTime)} -
              {formatTime(schedule.endDateTime)}
            </p>
            {#if schedule.bookings.length > 0}
              <div class="mt-2 text-sm text-yellow-600">
                <p>
                  {$_('schedules.hasBookings', {
                    values: { count: schedule.bookings.length }
                  })}
                </p>
              </div>
            {/if}
          </div>
        </div>

        <form
          method="POST"
          use:enhance={() => {
            return async ({ update }) => {
              if (!validateForm()) {
                return;
              }
              await update();
            };
          }}
        >
          {#if errorMessage}
            <div class="mb-4 p-4 rounded-md bg-red-50">
              <p class="text-sm text-red-700">{errorMessage}</p>
            </div>
          {/if}

          <div class="space-y-6">
            <div>
              <label for="boatId" class="block text-sm font-medium text-gray-700">
                {$_('schedules.selectBoat')}
              </label>
              <select
                id="boatId"
                name="boatId"
                bind:value={selectedBoat}
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                {#each boats as boat}
                  <option value={boat.id}>{boat.name}</option>
                {/each}
              </select>
            </div>

            <div>
              <label for="startDateTime" class="block text-sm font-medium text-gray-700">
                {$_('schedules.startDateTime')}
              </label>
              <input
                type="datetime-local"
                name="startDateTime"
                id="startDateTime"
                bind:value={selectedStartDateTime}
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="endDateTime" class="block text-sm font-medium text-gray-700">
                {$_('schedules.endDateTime')}
              </label>
              <input
                type="datetime-local"
                name="endDateTime"
                id="endDateTime"
                bind:value={selectedEndDateTime}
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div class="flex justify-end space-x-3">
              <a
                href="/backend/schedules"
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
