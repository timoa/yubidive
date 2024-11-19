<script lang="ts">
  import { onMount } from 'svelte';
  import { signOut } from '$lib/auth';
  import { goto } from '$app/navigation';
  import { _ } from 'svelte-i18n';

  onMount(async () => {
    await signOut();
    setTimeout(() => {
      goto('/');
    }, 2000);
  });
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      {$_('auth.signOut.title')}
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      {$_('auth.signOut.message')}
    </p>
    <p class="mt-2 text-center text-sm text-gray-600">
      {$_('auth.signOut.redirectMessage')}
    </p>
    <div class="mt-6 text-center">
      <a href="/auth/signin" class="font-medium text-primary-600 hover:text-primary-500">
        {$_('auth.signOut.signInAgain')}
      </a>
    </div>
  </div>
</div>
