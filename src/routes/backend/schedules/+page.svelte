<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  import { format } from 'date-fns';
  import { invalidateAll } from '$app/navigation';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import { _ } from 'svelte-i18n';

  export let data: PageData;

  $: schedules = data.schedules;
  $: boats = data.boats;

  let selectedBoat = '';
  let selectedStartDateTime = '';
  let selectedEndDateTime = '';
  let editingSchedule: any = null;
  let deleteSchedule: any = null;

  function resetForm() {
    selectedBoat = '';
    selectedStartDateTime = '';
    selectedEndDateTime = '';
  }

  function startEdit(schedule: any) {
    editingSchedule = {
      ...schedule,
      startDateTime: format(new Date(schedule.startDateTime), 'yyyy-MM-ddTHH:mm'),
      endDateTime: format(new Date(schedule.endDateTime), 'yyyy-MM-ddTHH:mm')
    };
  }

  function cancelEdit() {
    editingSchedule = null;
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
  <h1 class="text-3xl font-bold mb-8">{$_('schedules.boatSchedules')}</h1>

  <!-- Create Schedule Form -->
  <div class="bg-white rounded-lg shadow p-6 mb-8">
    <h2 class="text-xl font-semibold mb-4">{$_('schedules.createNewSchedule')}</h2>
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

      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {$_('schedules.createSchedule')}
      </button>
    </form>
  </div>

  <!-- Schedules List -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >{$_('schedules.boat')}</th
          >
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >{$_('schedules.dateTime')}</th
          >
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >{$_('schedules.bookings')}</th
          >
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >{$_('schedules.actions')}</th
          >
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each schedules as schedule}
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">
              {#if editingSchedule?.id === schedule.id}
                <select
                  name="boatId"
                  bind:value={editingSchedule.boatId}
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {#each boats as boat}
                    <option value={boat.id}>{boat.name}</option>
                  {/each}
                </select>
              {:else}
                <div class="text-sm font-medium text-gray-900">
                  {schedule.boat.name}
                </div>
              {/if}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {#if editingSchedule?.id === schedule.id}
                <div class="flex space-x-2">
                  <input
                    type="datetime-local"
                    bind:value={editingSchedule.startDateTime}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="datetime-local"
                    bind:value={editingSchedule.endDateTime}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              {:else}
                <div class="text-sm text-gray-900">
                  {format(new Date(schedule.startDateTime), 'PPP')}
                  {format(new Date(schedule.startDateTime), 'HH:mm')} - {format(
                    new Date(schedule.endDateTime),
                    'HH:mm'
                  )}
                </div>
              {/if}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {schedule.bookings.length} bookings
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              {#if editingSchedule?.id === schedule.id}
                <form
                  method="POST"
                  action="?/edit"
                  use:enhance={() => {
                    return async ({ result }) => {
                      if (result.type === 'success') {
                        editingSchedule = null;
                        await invalidateAll();
                      }
                    };
                  }}
                  class="flex items-center justify-end space-x-2"
                >
                  <input type="hidden" name="id" value={editingSchedule.id} />
                  <input type="hidden" name="boatId" value={editingSchedule.boatId} />
                  <input type="hidden" name="startDateTime" value={editingSchedule.startDateTime} />
                  <input type="hidden" name="endDateTime" value={editingSchedule.endDateTime} />
                  <button
                    type="submit"
                    class="inline-flex items-center p-1.5 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-full"
                    title={$_('schedules.save')}
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
                  <button
                    type="button"
                    class="inline-flex items-center p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                    on:click={cancelEdit}
                    title={$_('schedules.cancel')}
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
                </form>
              {:else}
                <div class="flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    class="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full"
                    on:click={() => startEdit(schedule)}
                    title={$_('schedules.editSchedule')}
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
                    on:click={() => (deleteSchedule = schedule)}
                    title={$_('schedules.deleteSchedule')}
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
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<ConfirmModal
  isOpen={!!deleteSchedule}
  title={$_('schedules.deleteSchedule')}
  message={deleteSchedule
    ? $_('schedules.deleteConfirmation', {
        values: {
          boat: deleteSchedule.boat.name,
          date: format(new Date(deleteSchedule.startDateTime), 'PPP')
        }
      })
    : ''}
  onConfirm={handleDeleteConfirm}
  onCancel={handleDeleteCancel}
/>
