<script lang="ts">
  import { page } from '$app/stores';
  import { invalidateAll } from '$app/navigation';
  import { validatePassword } from '$lib/validation';
  import PasswordStrengthIndicator from '$lib/components/PasswordStrengthIndicator.svelte';
  import { _ } from 'svelte-i18n';

  const user = $page.data.user;

  let name = user?.name ?? '';
  let email = user?.email ?? '';
  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let loading = false;
  let error = '';
  let success = '';

  let touched = {
    name: false,
    email: false,
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  };

  $: nameError = touched.name && !name ? $_('profile.validation.nameRequired') : '';

  $: emailError = touched.email
    ? !email
      ? $_('profile.validation.emailRequired')
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? $_('profile.validation.invalidEmail')
        : ''
    : '';

  $: passwordValidation = validatePassword(newPassword);

  $: newPasswordError =
    touched.newPassword && newPassword && !passwordValidation.isValid
      ? passwordValidation.errors[0]
      : '';

  $: confirmPasswordError =
    touched.confirmPassword && newPassword
      ? confirmPassword !== newPassword
        ? $_('profile.validation.passwordsDoNotMatch')
        : ''
      : '';

  $: isValid =
    name &&
    email &&
    !emailError &&
    !nameError &&
    (!newPassword || (passwordValidation.isValid && confirmPassword === newPassword));

  function handleBlur(field) {
    touched[field] = true;
  }

  async function handleSubmit() {
    if (!isValid || !user) return;

    loading = true;
    error = '';
    success = '';

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          currentPassword,
          newPassword
        })
      });

      if (response.ok) {
        success = $_('profile.profileUpdated');
        currentPassword = '';
        newPassword = '';
        confirmPassword = '';
        await invalidateAll();
      } else {
        const data = await response.json();
        error = data.error || $_('profile.updateFailed');
      }
    } catch {
      error = $_('profile.unexpectedError');
    }

    loading = false;
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      {$_('profile.editProfile')}
    </h2>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {#if error}
        <div class="rounded-md bg-red-50 p-4 mb-6">
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
              <h3 class="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      {/if}

      {#if success}
        <div class="rounded-md bg-green-50 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      {/if}

      <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700"
            >{$_('profile.fullName')}</label
          >
          <div class="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              required
              bind:value={name}
              on:blur={() => handleBlur('name')}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm
                {nameError ? 'border-red-300' : ''}"
            />
            {#if nameError}
              <p class="mt-2 text-sm text-red-600">{nameError}</p>
            {/if}
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >{$_('profile.emailAddress')}</label
          >
          <div class="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              bind:value={email}
              on:blur={() => handleBlur('email')}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm
                {emailError ? 'border-red-300' : ''}"
            />
            {#if emailError}
              <p class="mt-2 text-sm text-red-600">{emailError}</p>
            {/if}
          </div>
        </div>

        <div class="space-y-1">
          <p class="block text-sm font-medium text-gray-700">{$_('profile.changePassword')}</p>
          <p class="text-sm text-gray-500">{$_('profile.keepCurrentPassword')}</p>
        </div>

        <div>
          <label for="current-password" class="block text-sm font-medium text-gray-700">
            {$_('profile.currentPassword')}
          </label>
          <div class="mt-1">
            <input
              id="current-password"
              name="current-password"
              type="password"
              bind:value={currentPassword}
              on:blur={() => handleBlur('currentPassword')}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label for="new-password" class="block text-sm font-medium text-gray-700">
            {$_('profile.newPassword')}
          </label>
          <div class="mt-1 space-y-2">
            <input
              id="new-password"
              name="new-password"
              type="password"
              bind:value={newPassword}
              on:blur={() => handleBlur('newPassword')}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm
                {newPasswordError ? 'border-red-300' : ''}"
            />
            {#if newPassword}
              <PasswordStrengthIndicator password={newPassword} showDetails={touched.newPassword} />
            {/if}
            {#if newPasswordError}
              <p class="mt-2 text-sm text-red-600">{newPasswordError}</p>
            {/if}
          </div>
        </div>

        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700">
            {$_('profile.confirmPassword')}
          </label>
          <div class="mt-1">
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              bind:value={confirmPassword}
              on:blur={() => handleBlur('confirmPassword')}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm
                {confirmPasswordError ? 'border-red-300' : ''}"
            />
            {#if confirmPasswordError}
              <p class="mt-2 text-sm text-red-600">{confirmPasswordError}</p>
            {/if}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={!isValid || loading}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if loading}
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Updating profile...
            {:else}
              {$_('profile.updateProfile')}
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
