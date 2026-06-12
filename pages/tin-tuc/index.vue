<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { posts, featuredPost, otherPosts, loading, formatDate } = usePostListViewModel()

useSeoMeta({
  title: () => t('post.seo_title'),
  description: () => t('post.seo_desc'),
  ogTitle: () => `${t('post.news')} – Mèo Trà`,
  ogDescription: () => t('post.seo_desc'),
})
</script>

<template>
  <div>
    <div class="bg-surface py-10">
      <v-container>
        <AppBreadcrumb />
        <h1 class="text-3xl font-bold mb-2">{{ t('post.news') }}</h1>
        <p class="opacity-60">{{ t('post.seo_desc') }}</p>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Loading -->
      <template v-if="loading">
        <v-skeleton-loader type="card" rounded="xl" class="mb-8" height="300" />
        <v-row>
          <v-col v-for="i in 3" :key="i" cols="12" sm="6" md="4">
            <v-skeleton-loader type="card" rounded="xl" />
          </v-col>
        </v-row>
      </template>

      <!-- Empty -->
      <div v-else-if="!posts?.length" class="text-center py-20 opacity-50">
        <v-icon size="64" class="mb-4">mdi-newspaper-variant-outline</v-icon>
        <p>{{ t('post.no_posts') }}</p>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Featured post -->
        <NuxtLink
          v-if="featuredPost"
          :to="`/tin-tuc/${featuredPost.slug}`"
          class="no-underline block"
        >
          <v-card
            rounded="xl"
            :elevation="0"
            class="border border-pink-100 overflow-hidden mb-8 hover:shadow-lg transition-shadow duration-300"
          >
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-img
                  :src="featuredPost.image || ''"
                  height="340"
                  cover
                  class="h-full"
                >
                  <template #placeholder>
                    <div class="w-full h-full bg-pink-50 flex items-center justify-center">
                      <v-icon size="64" color="primary" class="opacity-20">mdi-newspaper-variant-outline</v-icon>
                    </div>
                  </template>
                </v-img>
              </v-col>
              <v-col cols="12" md="6" class="pa-6 pa-md-10 d-flex flex-column justify-center">
                <v-chip color="primary" size="small" class="mb-4 w-fit">
                  {{ t('post.latest') }}
                </v-chip>
                <h2 class="text-2xl font-bold mb-3 leading-tight">
                  {{ featuredPost.title }}
                </h2>
                <p v-if="featuredPost.subtitle" class="opacity-60 mb-5 line-clamp-3 text-sm leading-relaxed">
                  {{ featuredPost.subtitle }}
                </p>
                <div class="flex items-center gap-2 text-sm opacity-50 mb-6">
                  <v-icon size="14">mdi-calendar-outline</v-icon>
                  <span>{{ formatDate(featuredPost.createdAt) }}</span>
                </div>
                <div>
                  <v-btn color="primary" rounded="lg" size="small" variant="elevated">
                    {{ t('post.read_more') }}
                    <v-icon end size="16">mdi-arrow-right</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </NuxtLink>

        <!-- Other posts grid -->
        <v-row v-if="otherPosts.length">
          <v-col
            v-for="post in otherPosts"
            :key="post.id"
            cols="12"
            sm="6"
            md="4"
          >
            <NuxtLink :to="`/tin-tuc/${post.slug}`" class="no-underline block h-full">
              <v-card
                rounded="xl"
                :elevation="0"
                class="border border-pink-100 overflow-hidden h-full hover:shadow-md transition-shadow duration-300"
              >
                <v-img :src="post.image || ''" height="200" cover>
                  <template #placeholder>
                    <div class="w-full h-full bg-pink-50 flex items-center justify-center">
                      <v-icon size="40" color="primary" class="opacity-20">mdi-newspaper-variant-outline</v-icon>
                    </div>
                  </template>
                </v-img>
                <v-card-text class="pa-5">
                  <div class="flex items-center gap-1 text-xs opacity-50 mb-2">
                    <v-icon size="12">mdi-calendar-outline</v-icon>
                    <span>{{ formatDate(post.createdAt) }}</span>
                  </div>
                  <h3 class="font-bold text-base mb-2 line-clamp-2 leading-snug">
                    {{ post.title }}
                  </h3>
                  <p v-if="post.subtitle" class="text-sm opacity-60 line-clamp-2 leading-relaxed">
                    {{ post.subtitle }}
                  </p>
                  <div class="mt-4 text-primary text-sm font-medium flex items-center gap-1">
                    {{ t('post.read_more') }}
                    <v-icon size="14" color="primary">mdi-arrow-right</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </NuxtLink>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>
