<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const {
  posts,
  loading,
  postCategories,
  page,
  totalPages,
  activeCategory,
  selectCategory,
  formatDate,
} = usePostListViewModel()

// Đọc category từ URL khi vào trang
onMounted(() => {
  const cat = route.query.category as string | undefined
  if (cat) selectCategory(cat)
})

function handleSelectCategory(slug: string) {
  selectCategory(slug)
  router.replace({ query: slug !== 'all' ? { category: slug } : {} })
}

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
      <!-- Category tabs -->
      <div class="overflow-x-auto mb-6 -mx-1 px-1">
        <div class="flex gap-2 pb-1 min-w-max">
          <v-chip
            :color="activeCategory === 'all' ? 'primary' : undefined"
            :variant="activeCategory === 'all' ? 'elevated' : 'outlined'"
            class="cursor-pointer"
            rounded="lg"
            @click="handleSelectCategory('all')"
          >
            {{ t('post.all_categories') }}
          </v-chip>
          <v-chip
            v-for="cat in (postCategories ?? [])"
            :key="cat.id"
            :color="activeCategory === cat.slug ? 'primary' : undefined"
            :variant="activeCategory === cat.slug ? 'elevated' : 'outlined'"
            class="cursor-pointer"
            rounded="lg"
            @click="handleSelectCategory(cat.slug)"
          >
            {{ cat.name }}
          </v-chip>
        </div>
      </div>

      <!-- Loading -->
      <v-row v-if="loading">
        <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
          <v-skeleton-loader type="card" rounded="xl" />
        </v-col>
      </v-row>

      <!-- Empty -->
      <div v-else-if="!posts.length" class="text-center py-20 opacity-50">
        <v-icon size="64" class="mb-4">mdi-newspaper-variant-outline</v-icon>
        <p>{{ t('post.no_posts') }}</p>
      </div>

      <!-- Posts grid + pagination -->
      <template v-else>
        <v-row>
          <v-col
            v-for="post in posts"
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
                  <div class="flex items-center gap-2 mb-2">
                    <v-chip
                      v-if="post.category"
                      size="x-small"
                      color="primary"
                      variant="tonal"
                      rounded="sm"
                    >
                      {{ post.category.name }}
                    </v-chip>
                    <div class="flex items-center gap-1 text-xs opacity-50">
                      <v-icon size="12">mdi-calendar-outline</v-icon>
                      <span>{{ formatDate(post.createdAt) }}</span>
                    </div>
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

        <div class="d-flex justify-center mt-8">
          <v-pagination
            v-if="totalPages > 1"
            v-model="page"
            :length="totalPages"
            :total-visible="7"
            rounded="lg"
            active-color="primary"
          />
        </div>
      </template>
    </v-container>
  </div>
</template>
