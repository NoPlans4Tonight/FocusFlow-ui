<template>
  <div class="modal">
    <div class="modal-content">
      <h3>Edit Log Entry</h3>
      <form @submit.prevent="handleSubmit">
        <label for="activity">Activity:</label>
        <input id="activity" v-model="localEntry.activity" type="text" required />

        <label for="note">Note:</label>
        <textarea id="note" v-model="localEntry.note"></textarea>

        <label for="startTime">Start Time:</label>
        <input id="startTime" v-model="localEntry.startTime" type="datetime-local" required />

        <label for="endTime">End Time:</label>
        <input id="endTime" v-model="localEntry.endTime" type="datetime-local" />

        <button type="submit">Save</button>
        <button type="button" @click="$emit('close')">Cancel</button>
      </form>
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
  data() {
    return {
      localEntry: { ...this.entry },
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.localEntry);
    },
  },
};
</script>

<style scoped>
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
