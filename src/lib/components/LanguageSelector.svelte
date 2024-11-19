<script lang="ts">
  import { locale, _ } from 'svelte-i18n';
  import { createEventDispatcher } from 'svelte';
  import { clickOutside } from '$lib/actions/clickOutside';

  const dispatch = createEventDispatcher();
  let isOpen = false;

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function closeDropdown() {
    isOpen = false;
  }

  function changeLanguage(langCode: string) {
    locale.set(langCode);
    closeDropdown();
  }

  $: currentLanguage = languages.find((lang) => lang.code === $locale) || languages[0];
</script>

<div class="relative" use:clickOutside on:click_outside={closeDropdown}>
  <button
    type="button"
    class="inline-flex items-center text-2xl hover:opacity-80"
    on:click={toggleDropdown}
    aria-label={$_('common.language')}
  >
    <span>{currentLanguage.flag}</span>
  </button>

  {#if isOpen}
    <div
      class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="language-menu-button"
      tabindex="-1"
    >
      {#each languages as language}
        <button
          class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
          tabindex="-1"
          on:click={() => changeLanguage(language.code)}
        >
          <span class="mr-2">{language.flag}</span>
          {language.name}
          {#if language.code === $locale}
            <svg
              class="ml-auto h-5 w-5 text-primary-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clip-rule="evenodd"
              />
            </svg>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
