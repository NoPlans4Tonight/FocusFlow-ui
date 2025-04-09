<template>
  <div>
    <Navbar />
    <h1>Dashboard</h1>
    <div v-if="currentStatus" class="current-status">
      <p>Currently helping <strong>{{ currentStatus.activity }}</strong> for <strong>{{ currentStatus.duration }}</strong> minutes</p>
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${currentStatus.progress}%` }"></div>
      </div>
    </div>
    <form @submit.prevent="logNote" class="log-form">
      <input v-model="currentActivity" type="text" placeholder="Enter activity" required />
      <textarea v-model="newNote" placeholder="Log a new note" required></textarea>
      <button type="submit">Add Log</button>
    </form>
    <div class="log-list">
      <div v-for="note in notes" :key="note.id" class="log-card">
        <p>{{ note.content }}</p>
        <button @click="deleteLog(note.id)">Delete</button>
      </div>
    </div>
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

        // Update current status
        const activeLog = logs.find(log => !log.end_time);
        if (activeLog) {
          const duration = Math.floor((Date.now() - new Date(activeLog.start_time)) / 60000);
          this.currentStatus = {
            activity: activeLog.activity,
            duration,
            progress: Math.min((duration / 60) * 100, 100), // Example progress calculation
          };
        } else {
          this.currentStatus = null;
        }
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
h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.current-status {
  background-color: #f0f8ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.progress-bar {
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  height: 10px;
  margin-top: 0.5rem;
}

.progress {
  background-color: #007bff;
  height: 100%;
  transition: width 0.3s ease;
}

.log-form {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.log-form input,
.log-form textarea {
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.log-form button {
  width: 100%;
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.log-form button:hover {
  background-color: #0056b3;
}

.log-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.log-card {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-card button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
}

.log-card button:hover {
  background-color: #c82333;
}
</style>