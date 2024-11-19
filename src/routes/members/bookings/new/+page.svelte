<script lang="ts">
  import type { PageData } from './$types';
  import { format } from 'date-fns';
  import { enhance } from '$app/forms';
  import { _ } from 'svelte-i18n';

  export let data: PageData;

  $: schedule = data.schedule;
  $: user = data.user;

  let loading = false;
  let error: string | null = null;

  function getAvailableSpots() {
    const totalSpots = schedule.boat.capacity;
    const bookedSpots = schedule.bookings.length;
    return totalSpots - bookedSpots;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">{$_('common.bookNewDive')}</h1>

    {#if error}
      <div class="mb-4 rounded-md bg-red-50 p-4 shadow-sm" role="alert">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{$_(`bookings.${error}`)}</h3>
          </div>
        </div>
      </div>
    {/if}

    <form
      method="POST"
      use:enhance={({ form }) => {
        loading = true;
        error = null;
        return async ({ result }) => {
          loading = false;
          if (result.type === 'error') {
            const response = result.error;
            if (response?.message) {
              error = response.message;
            } else {
              error = 'bookingFailed';
            }
          } else if (result.type === 'success') {
            window.location.href = '/members/bookings';
          }
        };
      }}
      class="space-y-6"
    >
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Schedule Details -->
            <div>
              <h2 class="text-xl font-semibold mb-6">{$_('schedule.details')}</h2>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">{schedule.boat.name}</h3>
                  <p class="text-gray-600">
                    {schedule.boat.description || $_('boats.noDescription')}
                  </p>
                </div>

                <div class="border-t border-gray-200 pt-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >{$_('schedule.date')}</label
                      >
                      <p class="mt-1 text-gray-900">
                        {format(new Date(schedule.startDateTime), 'PPP')}
                      </p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >{$_('schedule.time')}</label
                      >
                      <p class="mt-1 text-gray-900">
                        {format(new Date(schedule.startDateTime), 'HH:mm')} - {format(
                          new Date(schedule.endDateTime),
                          'HH:mm'
                        )}
                      </p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >{$_('schedule.boat')}</label
                      >
                      <p class="mt-1 text-gray-900">
                        {schedule.boat.name}
                      </p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >{$_('schedule.availableSpots')}</label
                      >
                      <p class="mt-1 text-gray-900">
                        {getAvailableSpots()}
                        {$_('common.of')}
                        {schedule.boat.capacity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Member Details -->
            <div>
              <h2 class="text-xl font-semibold mb-6">{$_('profile.details')}</h2>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >{$_('profile.fullName')}</label
                  >
                  <p class="mt-1 text-gray-900">{user.name}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >{$_('profile.emailAddress')}</label
                  >
                  <p class="mt-1 text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <input type="hidden" name="scheduleId" value={schedule.id} />

          <div class="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || getAvailableSpots() === 0}
            >
              {#if loading}
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              {/if}
              {getAvailableSpots() === 0 ? $_('boats.fullyBooked') : $_('common.confirmBooking')}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
