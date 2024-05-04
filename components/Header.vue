<script setup lang="ts">
const { locales, setLocale } = useI18n()
const colorMode = useColorMode()

const open = ref(false)
const items = computed(() => {
  return locales.value.map(i => ({
    name: i.name,
    code: i.code
  }))
})
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

function changeLanguage(code: string) {
  setLocale(code)
  open.value = false
}
</script>

<template>
  <UContainer class="w-full h-24 flex justify-end items-center sticky">
    <UButton
      :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
      size="lg"
      color="primary"
      square
      variant="ghost"
      @click="isDark = !isDark"
    />
    <UPopover v-model:open="open">
      <UButton
        icon="i-lucide-languages"
        size="lg"
        color="primary"
        square
        variant="ghost"
      />

      <template #panel>
        <div class="flex flex-col gap-2 p-2">
          <UButton
            v-for="item in items"
            :key="item.code"
            class="flex justify-start"
            color="white"
            variant="ghost"
            block
            @click="changeLanguage(item.code)"
          >
            {{ item.name }}
          </UButton>
        </div>
      </template>
    </UPopover>
  </UContainer>
</template>
