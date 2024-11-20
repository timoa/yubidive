<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import type { PageData } from './$types';
  import { _ } from 'svelte-i18n';
  import { formatDate } from '$lib/utils/dateFormat';

  export let data: PageData;
  $: boats = data.boats;

  // Form states
  let showCreateForm = false;
  let editingBoat = null;
  let loading = false;
  let errorMessage = '';

  // Form data
  let name = '';
  let description = '';
  let capacity = '';
  let imageUrl = '';
  let status = 'ACTIVE';

  function resetForm() {
    name = '';
    description = '';
    capacity = '';
    imageUrl = '';
    status = 'ACTIVE';
    editingBoat = null;
    showCreateForm = false;
  }

  function editBoat(boat) {
    editingBoat = boat;
    name = boat.name;
    description = boat.description || '';
    capacity = boat.capacity.toString();
    imageUrl = boat.imageUrl || '';
    status = boat.status;
    showCreateForm = true;
  }

  function getBookingsCount(boat) {
    return boat.schedules?.length || 0;
  }

  async function handleSubmit(event) {
    loading = true;
    errorMessage = '';
    return async ({ result }) => {
      loading = false;
      if (result.type === 'success') {
        await invalidateAll();
        resetForm();
      } else if (result.type === 'redirect' && result.location === '/auth/signin') {
        window.location.href = '/auth/signin';
      } else if (result.type === 'error') {
        errorMessage = result.error?.message || 'An error occurred while saving the boat';
      } else if (result.data?.error) {
        errorMessage = result.data.error;
      }
    };
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">{$_('boats.title')}</h1>
    <button
      class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
      on:click={() => {
        resetForm();
        showCreateForm = true;
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span>{$_('boats.addNewBoat')}</span>
    </button>
  </div>

  {#if showCreateForm}
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <h2 class="text-xl font-semibold mb-4">
        {editingBoat ? $_('boats.editBoat') : $_('boats.addNewBoat')}
      </h2>
      <form
        method="POST"
        action="?/{editingBoat ? 'update' : 'create'}"
        use:enhance={handleSubmit}
        class="space-y-4"
      >
        {#if errorMessage}
          <div class="bg-red-50 border-l-4 border-red-400 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        {/if}

        {#if editingBoat}
          <input type="hidden" name="id" value={editingBoat.id} />
        {/if}

        <div>
          <label for="name" class="block text-sm font-medium text-gray-700"
            >{$_('boats.boatName')} *</label
          >
          <input
            type="text"
            id="name"
            name="name"
            bind:value={name}
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700"
            >{$_('boats.description')}</label
          >
          <textarea
            id="description"
            name="description"
            bind:value={description}
            rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="capacity" class="block text-sm font-medium text-gray-700"
            >{$_('boats.capacity')} *</label
          >
          <input
            type="number"
            id="capacity"
            name="capacity"
            bind:value={capacity}
            required
            min="1"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700"
            >{$_('boats.imageUrl')}</label
          >
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            bind:value={imageUrl}
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-gray-700"
            >{$_('boats.status')} *</label
          >
          <select
            name="status"
            id="status"
            bind:value={status}
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="ACTIVE">{$_('common.status.active')}</option>
            <option value="INACTIVE">{$_('common.status.inactive')}</option>
            <option value="MAINTENANCE">{$_('common.status.maintenance')}</option>
          </select>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            on:click={resetForm}
            disabled={loading}
          >
            {$_('boats.cancel')}
          </button>
          <button
            type="submit"
            class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading}
          >
            {$_('common.save')}
          </button>
        </div>
      </form>
    </div>
  {:else if boats.length === 0}
    <div class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 mb-2">{$_('boats.noBoats')}</h3>
      <p class="text-gray-500">{$_('boats.addFirstBoat')}</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each boats as boat}
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="aspect-w-16 aspect-h-9">
            <img
              src={boat.imageUrl || '/images/default-boat.jpg'}
              alt={boat.name}
              class="w-full h-48 object-cover"
            />
          </div>
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">{boat.name}</h2>
            <p class="text-gray-600 mb-4">
              {boat.description || $_('boats.noDescription')}
            </p>
            <div class="text-sm text-gray-500">
              <div class="mt-2 flex items-center text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="mr-1.5 h-5 w-5 text-gray-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
                {boat.capacity}
                {$_('common.divers')}
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="mr-1.5 h-5 w-5 text-gray-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                {getBookingsCount(boat)}
                {$_(`boats.${getBookingsCount(boat) === 1 ? 'schedule' : 'schedules'}`)}
              </div>
            </div>
          </div>
          <div class="border-t border-gray-200 p-4">
            <div class="flex justify-between items-center">
              <span
                class={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  boat.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-600'
                    : boat.status === 'MAINTENANCE'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-red-50 text-red-700'
                }`}
              >
                {$_(`boats.${(boat.status || 'ACTIVE').toLowerCase()}`)}
              </span>
              <div class="flex space-x-2">
                <button
                  type="button"
                  class="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full"
                  on:click={() => editBoat(boat)}
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
                <form
                  method="POST"
                  action="?/delete"
                  use:enhance={() => {
                    return async ({ result }) => {
                      if (result.type === 'success') {
                        await invalidateAll();
                      }
                    };
                  }}
                  class="inline-block"
                >
                  <input type="hidden" name="id" value={boat.id} />
                  <button
                    type="submit"
                    class="inline-flex items-center p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full"
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
                </form>
              </div>
            </div>
          </div>
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
    object-fit: cover;
    object-position: center;
  }
</style>
