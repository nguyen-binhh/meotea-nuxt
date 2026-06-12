<script setup lang="ts">
import type { Post } from '~/types'

const props = defineProps<{ post: Post }>()

const { t } = useI18n()
const mounted = ref(false)
onMounted(() => { mounted.value = true })

const postId = computed(() => props.post.id)
const {
  comments, loading, page, totalPages, total,
  form, isFormValid, submitting,
  submitComment, authStore,
} = usePostCommentViewModel(postId)

function getInitial(name: string) {
  return name.charAt(0).toUpperCase()
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}
</script>

<template>
  <section class="mt-12 pt-8 border-t border-pink-100">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <v-icon color="primary" size="22">mdi-comment-multiple-outline</v-icon>
      <h2 class="text-xl font-bold">
        {{ t('comment.title') }}
        <span v-if="total > 0" class="text-base font-normal opacity-50 ml-1">({{ total }})</span>
      </h2>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4 mb-8">
      <div v-for="i in 3" :key="i" class="flex gap-3">
        <v-skeleton-loader type="avatar" width="40" height="40" />
        <div class="flex-1">
          <v-skeleton-loader type="text" width="30%" class="mb-1" />
          <v-skeleton-loader type="paragraph" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!comments.length" class="text-center py-10 opacity-40 mb-8">
      <v-icon size="48" class="mb-2">mdi-comment-outline</v-icon>
      <p class="text-sm">{{ t('comment.empty') }}</p>
    </div>

    <!-- Comment list -->
    <div v-else class="space-y-6 mb-6">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex gap-3"
      >
        <!-- Avatar -->
        <v-avatar size="40" color="primary" class="flex-shrink-0 mt-0.5">
          <v-img v-if="comment.user?.media" :src="comment.user.media" cover />
          <span v-else class="text-white text-sm font-semibold">
            {{ getInitial(comment.authorName) }}
          </span>
        </v-avatar>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="bg-surface rounded-xl px-4 py-3">
            <div class="flex items-center justify-between flex-wrap gap-1 mb-1">
              <span class="font-semibold text-sm">{{ comment.authorName }}</span>
              <span class="text-xs opacity-40">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="d-flex justify-center mb-8">
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="5"
        rounded="lg"
        active-color="primary"
        size="small"
      />
    </div>

    <!-- Comment form -->
    <div class="bg-surface rounded-2xl p-6">
      <h3 class="font-bold text-base mb-5">
        <v-icon color="primary" size="18" class="mr-1">mdi-pencil-outline</v-icon>
        {{ t('comment.leave_comment') }}
      </h3>

      <div v-if="!mounted" class="opacity-40 text-sm text-center py-4">
        {{ t('comment.loading_form') }}
      </div>

      <form v-else @submit.prevent="submitComment">
        <!-- Guest fields -->
        <template v-if="!authStore.isLoggedIn">
          <v-row dense class="mb-1">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.authorName"
                :label="t('comment.name') + ' *'"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details="auto"
                maxlength="100"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.authorEmail"
                :label="t('comment.email')"
                type="email"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </template>

        <!-- Logged in indicator -->
        <div v-else class="flex items-center gap-2 mb-4 text-sm opacity-60">
          <v-icon size="16">mdi-account-circle</v-icon>
          <span>{{ t('comment.posting_as') }} <strong>{{ authStore.user?.name }}</strong></span>
        </div>

        <!-- Content -->
        <v-textarea
          v-model="form.content"
          :label="t('comment.content') + ' *'"
          variant="outlined"
          rounded="lg"
          rows="3"
          auto-grow
          maxlength="2000"
          counter
          hide-details="auto"
          class="mb-4"
        />

        <div class="flex justify-end">
          <v-btn
            type="submit"
            color="primary"
            rounded="lg"
            :loading="submitting"
            :disabled="!isFormValid"
            variant="elevated"
          >
            <v-icon start size="18">mdi-send</v-icon>
            {{ t('comment.submit') }}
          </v-btn>
        </div>
      </form>
    </div>
  </section>
</template>
