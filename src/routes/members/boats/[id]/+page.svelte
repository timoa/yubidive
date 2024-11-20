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

  $: spotsLeft = (schedule) => data.boat.capacity - schedule.bookings.length;
</script>

<div class="min-h-full">
  <div class="bg-white shadow">
    <div class="relative h-[400px] w-full overflow-hidden">
      <img src={data.boat.imageUrl} alt={data.boat.name} class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div class="flex items-center space-x-3 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <h1 class="text-4xl font-bold">
            {data.boat.name}
          </h1>
        </div>
        <div class="flex items-center space-x-4 text-lg">
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            {data.boat.capacity}
            {$_('boat.spots')}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-4 sm:px-0">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Boat Details -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Description Section -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">
              {$_('boat.description')}
            </h2>
            <p class="text-gray-600">
              {data.boat.description}
            </p>
          </div>

          <!-- Schedule List Section -->
          <div class="bg-white shadow rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">
                {$_('boat.scheduleList')}
              </h2>
              <a
                href="/members/schedules"
                class="text-primary-600 hover:text-primary-700 font-medium"
              >
                {$_('boat.viewAll')}
              </a>
            </div>
            {#if data.upcomingSchedules.length > 0}
              <div class="flow-root">
                <ul role="list" class="-my-5 divide-y divide-gray-200">
                  {#each data.upcomingSchedules as schedule}
                    <li class="py-4">
                      <div class="flex items-center justify-between">
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center space-x-2 mb-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p class="text-sm font-medium text-gray-900">
                              {formatDate(schedule.startDateTime)}
                            </p>
                          </div>
                          <p class="text-sm text-gray-500">
                            {#if spotsLeft(schedule) > 0}
                              {$_('boat.spotsLeft', { values: { count: spotsLeft(schedule) } })}
                            {:else}
                              {$_('boat.spotsFull')}
                            {/if}
                          </p>
                        </div>
                        <div class="ml-4">
                          <button
                            type="button"
                            on:click={() => handleBookNow(schedule.id)}
                            disabled={spotsLeft(schedule) <= 0}
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {$_('boat.bookNow')}
                          </button>
                        </div>
                      </div>
                    </li>
                  {/each}
                </ul>
              </div>
            {:else}
              <p class="text-gray-500 text-center py-4">
                {$_('boat.noUpcomingSchedules')}
              </p>
            {/if}
          </div>
        </div>

        <!-- Right Column: Specifications -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">
              {$_('boat.specifications')}
            </h2>
            <dl class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">
                  {$_('boat.capacity')}
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {data.boat.capacity}
                  {$_('boat.spots')}
                </dd>
              </div>
              <!-- Add more specifications here as needed -->
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
