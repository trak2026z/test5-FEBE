<template>
  <v-container>
    <v-btn color="primary" @click="fetchUsers">Załaduj użytkowników</v-btn>
    <v-data-table :headers="headers" :items="users" class="mt-4" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUsers } from '@/api/users'
import type { User } from '@/api/users'

const users = ref<User[]>([])
const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Email', value: 'email' },
]

const fetchUsers = async () => {
  const response = await getUsers()
  users.value = response.data
}

onMounted(fetchUsers)
</script>
