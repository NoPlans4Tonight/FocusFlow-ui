<template>
  <div class="timeline-container">
    <h2 class="timeline-header">Timeline</h2>
    <div v-for="entry in entries" :key="entry.id" class="timeline-entry">
      <div class="timeline-details">
        <p class="timeline-activity"><strong>Activity:</strong> {{ entry.activity }}</p>
        <p class="timeline-time"><strong>Start Time:</strong> {{ entry.startTime.toLocaleString() }}</p>
        <p v-if="entry.endTime" class="timeline-time"><strong>End Time:</strong> {{ entry.endTime.toLocaleString() }}</p>
        <p v-else class="timeline-status"><strong>Status:</strong> Active</p>
        <p v-if="entry.note" class="timeline-note"><strong>Note:</strong> {{ entry.note }}</p>
        <button @click="deleteLog(entry.id)" class="delete-button">Delete</button>
        <button @click="openEditModal(entry)" class="edit-button">Edit</button>
      </div>
      <div class="timeline-bar" :style="{ backgroundColor: entry.color, width: `${entry.duration}px` }">
        {{ entry.activity }}
      </div>
    </div>

    <div v-if="isEditModalOpen" class="modal">
      <div class="modal-content">
        <h3>Edit Log Entry</h3>
        <form @submit.prevent="submitEdit">
          <label for="activity">Activity:</label>
          <input id="activity" v-model="editEntry.activity" type="text" required />

          <label for="note">Note:</label>
          <textarea id="note" v-model="editEntry.note"></textarea>

          <label for="startTime">Start Time:</label>
          <input id="startTime" v-model="editEntry.startTime" type="datetime-local" required />

          <label for="endTime">End Time:</label>
          <input id="endTime" v-model="editEntry.endTime" type="datetime-local" />

          <button type="submit">Save</button>
          <button type="button" @click="closeEditModal">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toDatetimeLocal } from '../utils/dateUtils';

export default {
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
    };
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
      console.log('Original entry:', entry);
      this.editEntry = {
        ...entry,
        startTime: toDatetimeLocal(entry.startTime),
        endTime: toDatetimeLocal(entry.endTime),
      };
      console.log('Formatted entry for modal:', this.editEntry);
      this.isEditModalOpen = true;
    },
    closeEditModal() {
      this.isEditModalOpen = false;
    },
    async submitEdit() {
      const toUTC = (localDatetime) => {
        if (!localDatetime) return null;
        return new Date(localDatetime).toISOString();
      };

      const updatedFields = {
        ...this.editEntry,
        startTime: toUTC(this.editEntry.startTime),
        endTime: toUTC(this.editEntry.endTime),
      };

      await this.editLog(this.editEntry.id, updatedFields);
      this.closeEditModal();
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

.timeline-entry {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: transform 0.2s, box-shadow 0.2s;
}

.timeline-entry:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.timeline-details {
  margin-bottom: 10px;
}

.timeline-activity {
  font-size: 1.2rem;
  font-weight: bold;
  color: #007bff;
}

.timeline-time {
  font-size: 0.9rem;
  color: #555;
}

.timeline-status {
  font-size: 0.9rem;
  color: #28a745;
  font-weight: bold;
}

.timeline-note {
  font-size: 0.9rem;
  color: #6c757d;
  font-style: italic;
}

.timeline-bar {
  height: 20px;
  border-radius: 4px;
  margin-top: 10px;
  text-align: center;
  color: #fff;
  font-size: 0.8rem;
  line-height: 20px;
  overflow: hidden;
}

.delete-button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c82333;
}

.edit-button {
  margin-top: 10px;
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #0056b3;
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
</style>