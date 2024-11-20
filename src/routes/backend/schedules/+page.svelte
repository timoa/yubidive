<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  import { format } from 'date-fns';
  import { invalidateAll } from '$app/navigation';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import EnhancedListItem from '$lib/components/EnhancedListItem.svelte';
  import { _ } from 'svelte-i18n';
  import { formatDate, formatTime } from '$lib/utils/dateFormat';
  import { goto } from '$app/navigation';

  export let data: PageData;

  $: schedules = data.schedules;
  $: boats = data.boats;
  $: activeSchedules = schedules.filter((schedule) => !isPastSchedule(schedule.startDateTime));
  $: pastSchedules = schedules.filter((schedule) => isPastSchedule(schedule.startDateTime));

  let activeTab = 'active';
  let showCreateModal = false;
  let selectedBoat = '';
  let selectedStartDateTime = '';
  let selectedEndDateTime = '';
  let deleteSchedule: any = null;

  function isPastSchedule(date: string | Date) {
    return new Date(date) <= new Date();
  }

  function resetForm() {
    selectedBoat = '';
    selectedStartDateTime = '';
    selectedEndDateTime = '';
    showCreateModal = false;
  }

  function handleDeleteConfirm() {
    const formData = new FormData();
    formData.append('id', deleteSchedule.id);

    fetch('?/delete', {
      method: 'POST',
      body: formData
    }).then(async (response) => {
      if (response.ok) {
        await invalidateAll();
        deleteSchedule = null;
      }
    });
  }

  function handleDeleteCancel() {
    deleteSchedule = null;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold text-gray-900">{$_('schedules.boatSchedules')}</h1>
    <button
      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      on:click={() => {
        showCreateModal = true;
        selectedBoat = '';
        selectedStartDateTime = '';
        selectedEndDateTime = '';
      }}
    >
      {$_('schedules.createNewSchedule')}
    </button>
  </div>

  {#if schedules.length === 0}
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
      <h3 class="text-lg font-medium text-gray-900 mb-2">{$_('schedules.noSchedulesYet')}</h3>
      <p class="text-gray-500">{$_('schedules.schedulesWillAppear')}</p>
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
          {$_('schedules.upcomingSchedules')}
        </button>
        <button
          class={`${
            activeTab === 'past'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          on:click={() => (activeTab = 'past')}
        >
          {$_('schedules.pastSchedules')}
        </button>
      </nav>
    </div>

    {#if activeTab === 'active'}
      {#if activeSchedules.length === 0}
        <div class="text-center py-12">
          <p class="text-gray-500">{$_('schedules.noActiveSchedules')}</p>
        </div>
      {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            {#each activeSchedules as schedule}
              <li>
                <EnhancedListItem
                  title={schedule.boat.name}
                  date={schedule.startDateTime}
                  startTime={schedule.startDateTime}
                  endTime={schedule.endDateTime}
                  status="upcoming"
                  actions={[
                    {
                      type: 'edit',
                      onClick: () => goto(`/backend/schedules/${schedule.id}/edit`),
                      title: $_('common.edit')
                    },
                    {
                      type: 'delete',
                      onClick: () => (deleteSchedule = schedule),
                      title: $_('common.delete')
                    }
                  ]}
                />
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {:else if pastSchedules.length === 0}
      <div class="text-center py-12">
        <p class="text-gray-500">{$_('schedules.noPastSchedules')}</p>
      </div>
    {:else}
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          {#each pastSchedules as schedule}
            <li>
              <EnhancedListItem
                title={schedule.boat.name}
                date={schedule.startDateTime}
                startTime={schedule.startDateTime}
                endTime={schedule.endDateTime}
                status="past"
              />
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/if}
</div>

<ConfirmModal
  isOpen={!!deleteSchedule}
  title={$_('schedules.deleteSchedule')}
  message={$_('schedules.deleteConfirmation', {
    values: {
      boat: deleteSchedule?.boat.name || '',
      date: deleteSchedule ? formatDate(deleteSchedule.startDateTime) : ''
    }
  })}
  confirmText={$_('common.delete')}
  cancelText={$_('common.cancel')}
  onConfirm={handleDeleteConfirm}
  onCancel={handleDeleteCancel}
/>

{#if showCreateModal}
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
      >
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            {$_('schedules.createNewSchedule')}
          </h3>
          <div class="mt-4">
            <form
              method="POST"
              action="?/create"
              use:enhance={() => {
                return async ({ result }) => {
                  if (result.type === 'success') {
                    resetForm();
                    await invalidateAll();
                  }
                };
              }}
              class="space-y-4"
            >
              <div>
                <label for="boat" class="block text-sm font-medium text-gray-700"
                  >{$_('schedules.selectBoat')}</label
                >
                <select
                  id="boat"
                  name="boatId"
                  bind:value={selectedBoat}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">{$_('schedules.selectABoat')}</option>
                  {#each boats as boat}
                    <option value={boat.id}>{boat.name}</option>
                  {/each}
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="startDateTime" class="block text-sm font-medium text-gray-700"
                    >{$_('schedules.startDateTime')}</label
                  >
                  <input
                    type="datetime-local"
                    id="startDateTime"
                    name="startDateTime"
                    bind:value={selectedStartDateTime}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label for="endDateTime" class="block text-sm font-medium text-gray-700"
                    >{$_('schedules.endDateTime')}</label
                  >
                  <input
                    type="datetime-local"
                    id="endDateTime"
                    name="endDateTime"
                    bind:value={selectedEndDateTime}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                >
                  {$_('schedules.createSchedule')}
                </button>
                <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  on:click={resetForm}
                >
                  {$_('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
