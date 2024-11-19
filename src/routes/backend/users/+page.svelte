<script lang="ts">
  import { enhance } from '$app/forms';
  import { _ } from 'svelte-i18n';
  import { fade } from 'svelte/transition';
  import { invalidateAll } from '$app/navigation';

  export let data;
  export let form;

  let editingUser: any = null;
  let showEditModal = false;
  let showCreateModal = false;
  let newUser = {
    name: '',
    email: '',
    role: 'MEMBER',
    password: ''
  };

  function editUser(user: any) {
    editingUser = {
      ...user,
      role: user.role.toUpperCase()
    };
    showEditModal = true;
  }

  function closeModal() {
    showEditModal = false;
    showCreateModal = false;
    editingUser = null;
    newUser = {
      name: '',
      email: '',
      role: 'MEMBER',
      password: ''
    };
  }

  async function handleSubmit(event: any) {
    return async ({ result }: any) => {
      if (result.type === 'success') {
        closeModal();
        await invalidateAll();
      } else if (result.type === 'failure') {
        console.error('Form submission failed:', result.data);
      }
    };
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">{$_('users.manageUsers')}</h1>
    <button
      on:click={() => (showCreateModal = true)}
      class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5 mr-2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      {$_('users.createUser')}
    </button>
  </div>

  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {$_('users.name')}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {$_('users.email')}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {$_('users.role')}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {$_('users.activeBookings')}
          </th>
          <th
            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each data.users as user}
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                class="px-2 py-1 text-xs rounded-full {user.role === 'ADMIN'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'}"
              >
                {$_(`users.roles.${user.role.toLowerCase()}`)}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.activeBookings}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <div class="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  class="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full"
                  on:click={() => editUser(user)}
                  title={$_('users.editUser')}
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
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

{#if showEditModal}
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    transition:fade
  >
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
          {$_('users.editUser')}
        </h3>
        <form method="POST" action="?/updateUser" use:enhance={handleSubmit} class="space-y-4">
          <input type="hidden" name="id" value={editingUser.id} />

          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              {$_('users.name')}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              bind:value={editingUser.name}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              {$_('users.email')}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              bind:value={editingUser.email}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">
              {$_('users.role')}
            </label>
            <select
              name="role"
              id="role"
              bind:value={editingUser.role}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="MEMBER">{$_('users.roles.member')}</option>
              <option value="ADMIN">{$_('users.roles.admin')}</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              on:click={closeModal}
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              {$_('users.actions.cancel')}
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {$_('users.actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

{#if showCreateModal}
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    transition:fade
  >
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
          {$_('users.createUser')}
        </h3>
        {#if form?.message}
          <div
            class="mb-4 p-2 rounded-md {form.success
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'}"
          >
            {form.message}
          </div>
        {/if}
        <form method="POST" action="?/createUser" use:enhance={handleSubmit} class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              {$_('users.name')}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              bind:value={newUser.name}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              {$_('users.email')}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              bind:value={newUser.email}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              {$_('users.password')}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              bind:value={newUser.password}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">
              {$_('users.role')}
            </label>
            <select
              name="role"
              id="role"
              bind:value={newUser.role}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="MEMBER">{$_('users.roles.member')}</option>
              <option value="ADMIN">{$_('users.roles.admin')}</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              on:click={closeModal}
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              {$_('users.actions.cancel')}
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {$_('users.actions.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
