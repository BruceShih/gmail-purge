<template>
  <div class="h-screen flex flex-col justify-between">
    <Header />
    <UContainer class="w-full flex-grow p-6">
      <NuxtPage />
    </UContainer>

    <Footer />
  </div>
  <UNotifications />
</template>
