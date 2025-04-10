<template>
  <div class="timeline-container">
    <h2 class="timeline-header">Timeline</h2>
    <div v-for="(logs, day) in groupedLogs" :key="day" class="day-group">
      <div class="day-header" @click="toggleDay(day)">
        <h3>{{ day }}</h3>
        <span>{{ isDayExpanded(day) ? '-' : '+' }}</span>
      </div>
      <div v-if="isDayExpanded(day)" class="day-logs">
        <TimelineEntry
          v-for="entry in logs"
          :key="entry.id"
          :entry="entry"
          @delete="deleteLog"
          @edit="openEditModal"
        />
      </div>
    </div>

    <TimelineEditActivityModal
      v-if="isEditModalOpen"
      :entry="editEntry"
      @close="closeEditModal"
      @submit="submitEdit"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { toDatetimeLocal } from '../utils/dateUtils';
import TimelineEditActivityModal from './TimelineEditActivityModal.vue';
import TimelineEntry from './TimelineEntry.vue';

export default {
  components: {
    TimelineEditActivityModal,
    TimelineEntry,
  },
  props: {
    entries: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isEditModalOpen: false,
      editEntry: {},
      expandedDays: new Set(),
    };
  },
  computed: {
    groupedLogs() {
      const grouped = {};
      this.entries.forEach((entry) => {
        const day = new Date(entry.startTime).toLocaleDateString();
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(entry);
      });
      return grouped;
    },
  },
  methods: {
    async deleteLog(logId) {
      const confirmDelete = window.confirm('Are you sure you want to delete this log?');
      if (!confirmDelete) return;

      try {
        const response = await axios.delete(`/log/${logId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        this.$emit('logDeleted', logId); // Notify parent component about the deletion
        alert(response.data.message);
      } catch (error) {
        console.error('Error deleting log:', error);
        alert(error.response?.data?.error || 'An error occurred while deleting the log.');
      }
    },
    async editLog(logId, updatedFields) {
      try {
        await axios.put(`/log/${logId}/`, updatedFields);

        // Update the local entries array with the new data
        const index = this.entries.findIndex(entry => entry.id === logId);
        if (index !== -1) {
          this.entries[index] = { ...this.entries[index], ...updatedFields };
        }
      } catch (error) {
        console.error('Error editing log:', error);
      }
    },
    openEditModal(entry) {
      this.editEntry = {
        ...entry,
        startTime: toDatetimeLocal(entry.startTime),
        endTime: toDatetimeLocal(entry.endTime),
      };
      this.isEditModalOpen = true;
    },
    closeEditModal() {
      this.isEditModalOpen = false;
    },
    async submitEdit(updatedEntry) {
      const toUTC = (localDatetime) => {
        if (!localDatetime) return null;
        return new Date(localDatetime).toISOString();
      };

      const updatedFields = {
        ...updatedEntry,
        startTime: toUTC(updatedEntry.startTime),
        endTime: toUTC(updatedEntry.endTime),
      };

      await this.editLog(updatedEntry.id, updatedFields);
      this.closeEditModal();
    },
    toggleDay(day) {
      if (this.expandedDays.has(day)) {
        this.expandedDays.delete(day);
      } else {
        this.expandedDays.add(day);
      }
    },
    isDayExpanded(day) {
      return this.expandedDays.has(day);
    },
  },
};
</script>

<style scoped>
.timeline-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.timeline-header {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
}

.modal-content form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.modal-content form input,
.modal-content form textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-content form button {
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-content form button[type="submit"] {
  background-color: #007bff;
  color: white;
}

.modal-content form button[type="submit"]:hover {
  background-color: #0056b3;
}

.modal-content form button[type="button"] {
  background-color: #6c757d;
  color: white;
}

.modal-content form button[type="button"]:hover {
  background-color: #5a6268;
}

.day-group {
  margin-bottom: 20px;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.day-header h3 {
  margin: 0;
}

.day-logs {
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>