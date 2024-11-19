<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { format } from 'date-fns';
  import type { PageData } from './$types';

  export let data: PageData;
  let boats = data.boats;

  // Form states
  let showCreateForm = false;
  let editingBoat = null;
  let loading = false;

  // Form data
  let name = '';
  let description = '';
  let capacity = '';
  let imageUrl = '';

  function resetForm() {
    name = '';
    description = '';
    capacity = '';
    imageUrl = '';
    editingBoat = null;
    showCreateForm = false;
  }

  function editBoat(boat) {
    editingBoat = boat;
    name = boat.name;
    description = boat.description || '';
    capacity = boat.capacity.toString();
    imageUrl = boat.imageUrl || '';
    showCreateForm = true;
  }

  function getBookedDatesString(boat) {
    const dates = boat.schedules
      .filter((s) => s.bookings.length > 0)
      .map((s) => format(new Date(s.date), 'PPP'))
      .join(', ');
    return dates || 'No bookings';
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">Manage Boats</h1>
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
      <span>Add New Boat</span>
    </button>
  </div>

  {#if showCreateForm}
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <h2 class="text-xl font-semibold mb-4">{editingBoat ? 'Edit' : 'Add'} Boat</h2>
      <form
        method="POST"
        action="?/{editingBoat ? 'update' : 'create'}"
        use:enhance={() => {
          loading = true;
          return async ({ result }) => {
            if (result.type === 'success') {
              await invalidateAll();
              resetForm();
            }
            loading = false;
          };
        }}
        class="space-y-4"
      >
        {#if editingBoat}
          <input type="hidden" name="id" value={editingBoat.id} />
        {/if}

        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            bind:value={name}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <textarea
            id="description"
            name="description"
            bind:value={description}
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          ></textarea>
        </div>

        <div>
          <label for="capacity" class="block text-sm font-medium text-gray-700">Capacity *</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            bind:value={capacity}
            required
            min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            bind:value={imageUrl}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            on:click={resetForm}
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 inline-flex items-center space-x-2"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 inline-flex items-center space-x-2"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>{loading ? 'Saving...' : editingBoat ? 'Update Boat' : 'Create Boat'}</span>
          </button>
        </div>
      </form>
    </div>
  {/if}

  {#if boats.length === 0}
    <div class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 mb-2">No boats available</h3>
      <p class="text-gray-500">Add your first boat to get started.</p>
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
              {boat.description || 'No description available.'}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1 text-gray-500">
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
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
                <span class="text-sm">{boat.capacity} divers</span>
              </div>
              <div class="flex items-center space-x-1 text-gray-500">
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
                <span class="text-sm"
                  >{boat.schedules.length}
                  {boat.schedules.length === 1 ? 'schedule' : 'schedules'}</span
                >
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 p-4">
            <div class="flex justify-end space-x-2">
              <button
                type="button"
                class="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full"
                on:click={() => editBoat(boat)}
                disabled={loading}
                title="Edit boat"
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
                action="?/delete"
                method="POST"
                use:enhance={() => {
                  loading = true;
                  return async ({ result }) => {
                    if (result.type === 'success') {
                      await invalidateAll();
                    }
                    loading = false;
                  };
                }}
                class="inline"
              >
                <input type="hidden" name="id" value={boat.id} />
                <button
                  type="submit"
                  class="inline-flex items-center p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full"
                  disabled={loading}
                  title="Delete boat"
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
