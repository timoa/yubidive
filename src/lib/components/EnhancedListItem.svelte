<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { formatDate, formatTime } from '$lib/utils/dateFormat';

  export let title: string;
  export let subtitle: string | null = null;
  export let date: string | Date;
  export let startTime: string | Date;
  export let endTime: string | Date | null = null;
  export let status: 'upcoming' | 'past' | null = null;
  export let actions: Array<{
    type: 'edit' | 'delete' | 'cancel';
    onClick: () => void;
    title: string;
  }> = [];
</script>

<div class="px-4 py-4 sm:px-6">
  <div class="flex items-center justify-between">
    <div class="flex-1 min-w-0">
      <h3 class="text-lg font-medium text-gray-900 truncate">
        {title}
      </h3>
      {#if subtitle}
        <p class="text-sm text-gray-500">
          {subtitle}
        </p>
      {/if}
      <div class="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
          <svg
            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          {formatDate(date)}
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
          <svg
            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"
            />
          </svg>
          {formatTime(startTime)}{#if endTime}
            - {formatTime(endTime)}{/if}
        </div>
        {#if status}
          <div class="mt-2 flex items-center sm:mt-0">
            <span
              class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === 'past' ? 'bg-gray-100 text-gray-800' : 'bg-primary-100 text-primary-800'
              }`}
            >
              {$_(`common.status.${status}`)}
            </span>
          </div>
        {/if}
      </div>
    </div>
    {#if actions.length > 0}
      <div class="ml-5 flex-shrink-0 space-x-2">
        {#each actions as action}
          <button
            type="button"
            class={`inline-flex items-center p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              action.type === 'edit'
                ? 'text-blue-600 hover:text-blue-900 hover:bg-blue-100 focus:ring-blue-500'
                : 'text-red-600 hover:text-red-900 hover:bg-red-100 focus:ring-red-500'
            }`}
            on:click={action.onClick}
            title={action.title}
          >
            {#if action.type === 'edit'}
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
            {:else if action.type === 'delete' || action.type === 'cancel'}
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
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>
