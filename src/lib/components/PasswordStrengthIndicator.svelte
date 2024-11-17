<script lang="ts">
  import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText } from '$lib/validation';

  export let password: string;
  export let showDetails = false;

  $: validation = validatePassword(password);
  $: strengthColor = getPasswordStrengthColor(validation.score);
  $: strengthText = getPasswordStrengthText(validation.score);
</script>

<div class="space-y-2">
  <div class="flex items-center space-x-2">
    <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
      {#if password}
        <div
          class="h-full transition-all duration-300 {strengthColor}"
          style="width: {(validation.score + 1) * 20}%"
        />
      {/if}
    </div>
    {#if password}
      <span class="text-sm font-medium text-gray-600">{strengthText}</span>
    {/if}
  </div>

  {#if showDetails && password && validation.errors.length > 0}
    <ul class="text-sm text-red-600 space-y-1 mt-2">
      {#each validation.errors as error}
        <li class="flex items-start">
          <svg
            class="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          {error}
        </li>
      {/each}
    </ul>
  {/if}

  {#if showDetails && password && validation.errors.length === 0}
    <p class="text-sm text-green-600 flex items-center mt-2">
      <svg
        class="h-4 w-4 mr-1.5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
      Password meets all requirements
    </p>
  {/if}
</div>
