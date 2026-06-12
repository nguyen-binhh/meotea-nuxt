<script setup lang="ts">
definePageMeta({ layout: 'default' })

const authStore = useAuthStore()
if (!authStore.isLoggedIn) {
  await navigateTo('/dang-nhap')
}

const { t } = useI18n()
const { customer, paymentMethod, total, loading, placeOrder, items, subtotal } = useOrderViewModel()

const formRef = ref()

function formatPrice(p: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}

const paymentMethods = [
  { value: 'cash', label: t('order.payment_cash'), icon: 'mdi-cash' },
  { value: 'transfer', label: t('order.payment_transfer'), icon: 'mdi-bank-transfer' },
  { value: 'momo', label: 'MoMo', icon: 'mdi-cellphone-wireless' },
]

const rules = {
  required: (v: string) => !!v?.trim() || t('common.required'),
  phone: (v: string) => /^0\d{9}$/.test(v) || t('common.invalid_phone'),
}

async function handlePlaceOrder() {
  const { valid } = await formRef.value?.validate()
  if (!valid) return
  placeOrder()
}
</script>

<template>
  <div>
    <div class="bg-surface py-10">
      <v-container>
        <AppBreadcrumb />
        <h1 class="text-3xl font-bold">{{ t('nav.order') }}</h1>
      </v-container>
    </div>

    <v-container class="py-8">
      <v-row>
        <!-- Order summary (mobile: top, desktop: right) -->
        <v-col cols="12" md="5" order="1" order-md="2">
          <v-card rounded="xl" :elevation="0" class="border border-pink-200 pa-6 mb-6 md:mb-0 md:sticky md:top-24">
            <h3 class="font-bold text-lg mb-4">{{ t('cart.summary') }}</h3>

            <div class="flex flex-col gap-2 mb-4">
              <div
                v-for="item in items"
                :key="item.id"
                class="flex justify-between text-sm"
              >
                <span class="opacity-70">{{ item.product.name }} × {{ item.quantity }}</span>
                <span>{{ formatPrice(item.unitPrice * item.quantity) }}</span>
              </div>
            </div>

            <v-divider class="mb-3" />

            <div class="flex justify-between mb-1 text-sm">
              <span class="opacity-70">{{ t('cart.subtotal') }}</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between mb-4 text-sm">
              <span class="opacity-70">{{ t('cart.shipping') }}</span>
              <span class="text-success font-medium">{{ t('cart.free') }}</span>
            </div>

            <v-divider class="mb-4" />

            <div class="flex justify-between font-bold text-lg mb-5">
              <span>{{ t('cart.total') }}</span>
              <span class="text-primary">{{ formatPrice(total) }}</span>
            </div>

            <v-btn
              color="primary"
              block
              size="large"
              rounded="xl"
              :loading="loading"
              @click="handlePlaceOrder"
            >
              <v-icon start>mdi-check-circle-outline</v-icon>
              {{ t('order.place_order') }}
            </v-btn>
          </v-card>
        </v-col>

        <!-- Order form -->
        <v-col cols="12" md="7" order="2" order-md="1">
          <v-form ref="formRef">
            <v-card rounded="xl" :elevation="0" class="border border-pink-100 pa-6 mb-6">
              <h2 class="font-bold text-lg mb-4">
                <v-icon start color="primary">mdi-account-outline</v-icon>
                {{ t('order.customer_info') }}
              </h2>

              <div class="flex flex-col gap-4">
                <v-text-field
                  v-model="customer.name"
                  :label="t('order.full_name')"
                  prepend-inner-icon="mdi-account-outline"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hide-details="auto"
                />
                <v-text-field
                  v-model="customer.phone"
                  :label="t('order.phone')"
                  prepend-inner-icon="mdi-phone-outline"
                  :rules="[rules.required, rules.phone]"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hide-details="auto"
                />
                <v-textarea
                  v-model="customer.address"
                  :label="t('order.address')"
                  prepend-inner-icon="mdi-map-marker-outline"
                  :rules="[rules.required]"
                  variant="outlined"
                  rows="2"
                  rounded="lg"
                  auto-grow
                  hide-details="auto"
                />
                <v-textarea
                  v-model="customer.note"
                  :label="t('order.note')"
                  prepend-inner-icon="mdi-note-text-outline"
                  variant="outlined"
                  rows="2"
                  rounded="lg"
                  auto-grow
                  hide-details
                />
              </div>
            </v-card>

            <!-- Payment method -->
            <v-card rounded="xl" :elevation="0" class="border border-pink-100 pa-6">
              <h2 class="font-bold text-lg mb-4">
                <v-icon start color="primary">mdi-credit-card-outline</v-icon>
                {{ t('order.payment_method') }}
              </h2>
              <v-radio-group v-model="paymentMethod" hide-details>
                <v-radio
                  v-for="method in paymentMethods"
                  :key="method.value"
                  :value="method.value"
                  :label="method.label"
                  color="primary"
                >
                  <template #label>
                    <div class="flex items-center gap-2 ml-1">
                      <v-icon :icon="method.icon" size="20" color="primary" />
                      <span>{{ method.label }}</span>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-card>
          </v-form>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>
