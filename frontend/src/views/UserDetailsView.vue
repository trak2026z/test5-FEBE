<template>
  <v-container>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Wróć</v-btn>

    <v-skeleton-loader v-if="loading" type="article, actions" class="mt-4" />
    <v-alert v-else-if="error" type="error" class="mt-4" border="start" variant="tonal">
      {{ error }}
    </v-alert>

    <v-card v-else class="mt-4">
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Szczegóły użytkownika #{{ user?.id }}</span>
        <div class="d-flex ga-2">
          <v-btn v-if="!editMode" color="primary" prepend-icon="mdi-pencil" @click="enableEdit">Edytuj</v-btn>
          <v-btn v-else color="primary" prepend-icon="mdi-content-save" :loading="saving" @click="save">Zapisz</v-btn>
          <v-btn v-if="editMode" variant="tonal" color="grey" prepend-icon="mdi-cancel" @click="cancelEdit">Anuluj</v-btn>
          <v-btn color="error" variant="tonal" prepend-icon="mdi-delete" :loading="removing" @click="remove">Usuń</v-btn>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-form ref="formRef" v-model="isValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="model.name"
                :readonly="!editMode"
                :rules="[req]"
                label="Name"
                prepend-inner-icon="mdi-account"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="model.email"
                :readonly="!editMode"
                :rules="[req, emailRule]"
                label="Email"
                prepend-inner-icon="mdi-email"
                type="email"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snack.show" :color="snack.color" timeout="2500">
      {{ snack.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUser, updateUser, deleteUser, type User } from '@/api/users'
import { diffPartial } from '@/utils/diff'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const loading = ref(true)
const saving = ref(false)
const removing = ref(false)
const error = ref<string | null>(null)

const user = ref<User | null>(null)
const original = ref<User | null>(null)
const editMode = ref(false)

const model = reactive<{ name: string; email: string }>({ name: '', email: '' })

const formRef = ref()
const isValid = ref(false)

const snack = reactive<{ show: boolean; message: string; color: string }>({
  show: false,
  message: '',
  color: 'success',
})

const req = (v: string) => !!v || 'Pole wymagane'
const emailRule = (v: string) => /.+@.+\..+/.test(v) || 'Niepoprawny email'

const load = async () => {
  try {
    loading.value = true
    error.value = null
    const { data } = await getUser(id)
    user.value = data
    original.value = { ...data }
    model.name = data.name ?? ''
    model.email = data.email ?? ''
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Nie udało się pobrać użytkownika'
  } finally {
    loading.value = false
  }
}

const enableEdit = () => { editMode.value = true }
const cancelEdit = () => {
  if (original.value) {
    model.name = original.value.name ?? ''
    model.email = original.value.email ?? ''
  }
  editMode.value = false
}

const save = async () => {
  // @ts-ignore Vuetify form validate
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  const base = original.value as User
  const patch = diffPartial<User>(base, model as Partial<User>, ['name', 'email'])

  if (Object.keys(patch).length === 0) {
    snack.message = 'Brak zmian do zapisania'
    snack.color = 'info'
    snack.show = true
    editMode.value = false
    return
  }

  try {
    saving.value = true
    const { data } = await updateUser(id, patch) // PATCH
    user.value = data
    original.value = { ...data }
    model.name = data.name ?? ''
    model.email = data.email ?? ''
    editMode.value = false
    snack.message = 'Zapisano zmiany'
    snack.color = 'success'
    snack.show = true
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Nie udało się zapisać zmian'
    snack.message = 'Błąd zapisu'
    snack.color = 'error'
    snack.show = true
  } finally {
    saving.value = false
  }
}

const remove = async () => {
  if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return
  try {
    removing.value = true
    await deleteUser(id)
    router.push({ name: 'Users' })
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Nie udało się usunąć użytkownika'
    snack.message = 'Błąd usuwania'
    snack.color = 'error'
    snack.show = true
  } finally {
    removing.value = false
  }
}

const goBack = () => router.back()

onMounted(load)
</script>
