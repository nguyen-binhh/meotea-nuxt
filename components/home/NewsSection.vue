<script setup lang="ts">
const { t } = useI18n()
const { posts, loading, formatDate } = usePostListViewModel()

const sectionRef = ref<HTMLElement | null>(null)
const { isVisible } = useScrollReveal(sectionRef)

const latestPosts = computed(() => posts.value?.slice(0, 3) ?? [])
</script>

<template>
  <section ref="sectionRef" :class="{ 'reveal is-visible': isVisible, reveal: !isVisible }">
    <div class="py-16">
      <v-container>
        <!-- Header -->
        <div class="text-center mb-10">
          <p class="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
            {{ t('home.news_label') }}
          </p>
          <h2 class="text-3xl md:text-4xl font-bold mb-3">
            {{ t('home.news_title') }}
          </h2>
          <p class="opacity-60 max-w-lg mx-auto">
            {{ t('home.news_desc') }}
          </p>
        </div>

        <!-- Loading -->
        <v-row v-if="loading">
          <v-col v-for="i in 3" :key="i" cols="12" sm="6" md="4">
            <v-skeleton-loader type="card" rounded="xl" />
          </v-col>
        </v-row>

        <!-- Empty -->
        <div v-else-if="!latestPosts.length" class="text-center py-10 opacity-40">
          <v-icon size="48" class="mb-3">mdi-newspaper-variant-outline</v-icon>
          <p class="text-sm">{{ t('post.no_posts') }}</p>
        </div>

        <!-- Posts grid -->
        <v-row v-else>
          <v-col
            v-for="post in latestPosts"
            :key="post.id"
            cols="12"
            sm="6"
            md="4"
          >
            <NuxtLink :to="`/tin-tuc/${post.slug}`" class="no-underline block h-full">
              <v-card
                rounded="xl"
                :elevation="0"
                class="border border-pink-100 overflow-hidden h-full hover:shadow-lg transition-shadow duration-300"
              >
                <v-img :src="post.image || ''" height="210" cover>
                  <template #placeholder>
                    <div class="w-full h-full bg-pink-50 flex items-center justify-center">
                      <v-icon size="48" color="primary" class="opacity-20">
                        mdi-newspaper-variant-outline
                      </v-icon>
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

        <!-- View all button -->
        <div class="text-center mt-10">
          <v-btn
            to="/tin-tuc"
            color="primary"
            variant="outlined"
            size="large"
            rounded="xl"
          >
            {{ t('home.see_all_news') }}
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-container>
    </div>
  </section>
</template>
