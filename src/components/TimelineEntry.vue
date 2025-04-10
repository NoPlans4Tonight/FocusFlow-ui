<template>
  <div class="timeline-entry">
    <div class="timeline-details">
      <p class="timeline-activity"><strong>Activity:</strong> {{ entry.activity }}</p>
      <p class="timeline-time"><strong>Start Time:</strong> {{ entry.startTime.toLocaleString() }}</p>
      <p v-if="entry.endTime" class="timeline-time"><strong>End Time:</strong> {{ entry.endTime.toLocaleString() }}</p>
      <p v-else class="timeline-status"><strong>Status:</strong> Active</p>
      <p v-if="entry.note" class="timeline-note"><strong>Note:</strong> {{ entry.note }}</p>
      <button @click="$emit('delete', entry.id)" class="delete-button">Delete</button>
      <button @click="$emit('edit', entry)" class="edit-button">Edit</button>
    </div>
    <div class="timeline-bar" :style="{ backgroundColor: entry.color, width: `${entry.duration}px` }">
      {{ entry.activity }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    entry: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
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
</style>
