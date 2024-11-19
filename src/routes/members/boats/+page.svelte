<script lang="ts">
  import type { PageData } from './$types';
  import { _ } from 'svelte-i18n';
  import { formatDate, formatTime } from '$lib/utils/dateFormat';

  export let data: PageData;

  $: boats = data.boats;

  // Default image if none is provided
  const defaultBoatImage = '/images/default-boat.jpg';

  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = defaultBoatImage;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">{$_('boats.availableBoats')}</h1>

  {#if boats.length === 0}
    <div class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 mb-2">{$_('boats.noBoatsAvailable')}</h3>
      <p class="text-gray-500">{$_('boats.checkBackLater')}</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each boats as boat}
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="aspect-w-16 aspect-h-9">
            <img
              src={boat.imageUrl || defaultBoatImage}
              alt={boat.name}
              class="w-full h-48 object-cover"
              on:error={handleImageError}
            />
          </div>
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">{boat.name}</h2>
            <p class="text-gray-600 mb-4">
              {boat.description || $_('boats.noDescription')}
            </p>
            <div class="text-sm text-gray-500">
              <p class="flex items-center gap-1">
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
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
                {boat.capacity}
                {$_('boats.divers')}
              </p>
            </div>
          </div>

          {#if boat.schedules.length > 0}
            <div class="border-t border-gray-200">
              <div class="p-4">
                <h3 class="text-lg font-medium mb-2">{$_('schedules.upcomingSchedules')}</h3>
                <div class="space-y-2">
                  {#each boat.schedules as schedule}
                    <div class="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                      <div>
                        <div class="font-medium">
                          {formatDate(schedule.startDateTime)}
                        </div>
                        <div class="text-sm text-gray-500">
                          {formatTime(schedule.startDateTime)} -
                          {formatTime(schedule.endDateTime)}
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium mb-2">
                          {#if schedule.availableSpots > 0}
                            <span class="text-emerald-600">
                              {schedule.availableSpots}
                              {$_('boats.spotsLeft')}
                            </span>
                          {:else}
                            <span class="text-red-600">{$_('boats.fullyBooked')}</span>
                          {/if}
                        </div>
                        <a
                          href="/members/bookings/new?scheduleId={schedule.id}"
                          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          class:opacity-50={schedule.availableSpots === 0}
                          class:cursor-not-allowed={schedule.availableSpots === 0}
                          class:pointer-events-none={schedule.availableSpots === 0}
                        >
                          {schedule.availableSpots > 0
                            ? $_('common.bookNow')
                            : $_('boats.fullyBooked')}
                        </a>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {:else}
            <div class="border-t border-gray-200 p-4">
              <p class="text-gray-500 text-center">{$_('boats.noUpcomingSchedules')}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Add aspect ratio support */
  .aspect-w-16 {
    position: relative;
    padding-bottom: 56.25%;
  }

  .aspect-w-16 > img {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>
