<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = route.params.slug as string
const { t } = useI18n()
const router = useRouter()
const { post, loading, relatedPosts, formatDate } = usePostDetailViewModel(slug)

const breadcrumbItems = computed(() => [
  { title: t('nav.home'), to: '/' },
  { title: t('post.news'), to: '/tin-tuc' },
  { title: post.value?.title ?? '...', disabled: true },
])

useSeoMeta({
  title: () => post.value ? `${post.value.title} – Mèo Trà` : t('post.seo_title'),
  description: () => post.value?.subtitle ?? t('post.seo_desc'),
  ogTitle: () => post.value?.title ?? '',
  ogDescription: () => post.value?.subtitle ?? t('post.seo_desc'),
  ogImage: () => post.value?.image ?? '',
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="bg-surface py-10">
      <v-container>
        <AppBreadcrumb :items="breadcrumbItems" />
        <v-skeleton-loader v-if="loading" type="heading" class="mt-3" width="70%" />
        <h1 v-else-if="post" class="text-3xl font-bold mt-2 leading-tight">
          {{ post.title }}
        </h1>
      </v-container>
    </div>

    <v-container class="py-8" style="max-width: 860px">
      <!-- Loading -->
      <template v-if="loading">
        <v-skeleton-loader type="paragraph" class="mb-4" />
        <v-skeleton-loader type="image" rounded="xl" class="mb-6" height="400" />
        <v-skeleton-loader type="article" />
      </template>

      <!-- Not found -->
      <div v-else-if="!post" class="text-center py-20">
        <v-icon size="64" class="mb-4 opacity-30">mdi-newspaper-variant-outline</v-icon>
        <p class="opacity-50 mb-6">{{ t('post.not_found') }}</p>
        <v-btn color="primary" rounded="lg" variant="elevated" @click="router.push('/tin-tuc')">
          <v-icon start>mdi-arrow-left</v-icon>
          {{ t('post.back') }}
        </v-btn>
      </div>

      <!-- Article -->
      <article v-else>
        <p v-if="post.subtitle" class="text-xl mb-4 font-bold leading-relaxed">
          {{ post.subtitle }}
        </p>

        <div class="flex items-center flex-wrap gap-3 mb-8">
          <NuxtLink
            v-if="post.category"
            :to="{ path: '/tin-tuc', query: { category: post.category.slug } }"
            class="no-underline"
          >
            <v-chip color="primary" variant="tonal" size="small" rounded="sm" class="cursor-pointer">
              {{ post.category.name }}
            </v-chip>
          </NuxtLink>
          <div class="flex items-center gap-1 text-sm opacity-50">
            <v-icon size="15">mdi-calendar-outline</v-icon>
            <span>{{ t('post.published') }}: {{ formatDate(post.createdAt) }}</span>
          </div>
        </div>

        <v-img
          v-if="post.image"
          :src="post.image"
          rounded="xl"
          max-height="480"
          cover
          class="mb-10"
        />

        <!-- HTML content -->
        <div class="post-content" v-html="post.content" />

        <div class="mt-10 pt-6 border-t border-pink-100">
          <v-btn
            variant="outlined"
            color="primary"
            rounded="lg"
            @click="router.push('/tin-tuc')"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            {{ t('post.back') }}
          </v-btn>
        </div>
      </article>

      <!-- Related posts -->
      <section v-if="!loading && relatedPosts.length" class="mt-12">
        <h2 class="text-xl font-bold mb-6">
          {{ t('post.related') }}
          <span v-if="post?.category" class="text-primary font-normal text-base ml-2 opacity-70">
            — {{ post.category.name }}
          </span>
        </h2>
        <v-row>
          <v-col
            v-for="p in relatedPosts"
            :key="p.id"
            cols="12"
            sm="6"
            md="4"
          >
            <NuxtLink :to="`/tin-tuc/${p.slug}`" class="no-underline block h-full">
              <v-card
                rounded="xl"
                :elevation="0"
                class="border border-pink-100 overflow-hidden h-full hover:shadow-md transition-shadow duration-300"
              >
                <v-img :src="p.image || ''" height="160" cover>
                  <template #placeholder>
                    <div class="w-full h-full bg-pink-50 flex items-center justify-center">
                      <v-icon size="32" color="primary" class="opacity-20">mdi-newspaper-variant-outline</v-icon>
                    </div>
                  </template>
                </v-img>
                <v-card-text class="pa-4">
                  <div class="text-xs opacity-50 mb-2">{{ formatDate(p.createdAt) }}</div>
                  <h3 class="font-semibold text-sm line-clamp-2 leading-snug">{{ p.title }}</h3>
                </v-card-text>
              </v-card>
            </NuxtLink>
          </v-col>
        </v-row>
      </section>
    </v-container>
  </div>
</template>

<style scoped>
.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4) {
  font-weight: 700;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}
.post-content :deep(h1) { font-size: 1.875rem; }
.post-content :deep(h2) { font-size: 1.5rem; }
.post-content :deep(h3) { font-size: 1.25rem; }
.post-content :deep(h4) { font-size: 1.1rem; }

.post-content :deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.85;
}
.post-content :deep(img) {
  max-width: 100%;
  border-radius: 0.75rem;
  margin: 1.25rem 0;
}
.post-content :deep(ul),
.post-content :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}
.post-content :deep(li) {
  margin-bottom: 0.375rem;
  line-height: 1.75;
}
.post-content :deep(blockquote) {
  border-left: 4px solid rgb(var(--v-theme-primary));
  padding: 0.75rem 1.25rem;
  margin: 1.5rem 0;
  opacity: 0.75;
  font-style: italic;
  background: rgba(var(--v-theme-primary), 0.04);
  border-radius: 0 0.5rem 0.5rem 0;
}
.post-content :deep(a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}
.post-content :deep(strong) {
  font-weight: 700;
}
.post-content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  margin: 2rem 0;
}
</style>
