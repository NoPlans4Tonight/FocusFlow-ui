<template>
  <div>
    <Navbar />
    <h1>Dashboard</h1>
    <div v-if="currentStatus">
      <p>Currently helping {{ currentStatus.activity }} for {{ currentStatus.duration }} minutes</p>
    </div>
    <form @submit.prevent="logNote">
      <input v-model="currentActivity" type="text" placeholder="Enter activity" required />
      <textarea v-model="newNote" placeholder="Log a new note" required></textarea>
      <button type="submit">Add Log</button>
    </form>
    <ul>
      <li v-for="note in notes" :key="note.id">
        {{ note.content }}
        <button @click="deleteLog(note.id)">Delete</button>
      </li>
    </ul>
    <Timeline :entries="entries" @logDeleted="handleLogDeleted" />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Timeline from '../components/Timeline.vue';
import axios from 'axios';
import { useUserStore } from '../store/userStore';

export default {
  components: { Navbar, Timeline },
  data() {
    return {
      currentStatus: null,
      entries: [],
      newNote: '',
      notes: [],
      currentActivity: '',
      userStore: useUserStore(),
    };
  },
  methods: {
    async fetchData() {
      try {
        if (!this.userStore.userToken) throw new Error('User not authenticated');

        const response = await axios.get('/log/');

        const logs = response.data;

        // Process logs to extract required details
        this.entries = logs.map(log => ({
          id: log.id,
          activity: log.activity,
          note: log.note,
          startTime: new Date(log.start_time),
          endTime: log.end_time ? new Date(log.end_time) : null,
        })).sort((a, b) => b.startTime - a.startTime);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async logNote() {
      try {
        if (!this.userStore.userToken) throw new Error('User not authenticated');

        await axios.post('/log/', {
          activity: this.currentActivity,
          note: this.newNote,
        });

        await this.fetchData();

        this.newNote = '';
        this.currentActivity = '';
      } catch (error) {
        console.error('Error logging note:', error);
      }
    },
    async deleteLog(logId) {
      const confirmDelete = window.confirm('Are you sure you want to delete this log?');
      if (!confirmDelete) return;

      try {
        if (!this.userStore.userToken) throw new Error('User not authenticated');

        await axios.delete(`/log/${logId}/`, {
          headers: {
            Authorization: `Bearer ${this.userStore.userToken}`,
          },
        });

        // Refresh the entries after deletion
        await this.fetchData();
      } catch (error) {
        console.error('Error deleting log:', error);
      }
    },
    handleLogDeleted(deletedLogId) {
      this.entries = this.entries.filter(entry => entry.id !== deletedLogId);
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
form {
  margin-bottom: 1.5rem;
}

textarea {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #f8f9fa;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>