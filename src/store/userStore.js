import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  getters: {
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    isAdmin: (state) => state.user?.role === 'admin',
    userToken: (state) => state.user?.token || null,
  },
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/login/', credentials);
        this.user = response.data;
        this.isAuthenticated = true;

        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    async initialize() {
      try {
        console.log('Initializing user store...');

        // Rehydrate user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          this.user = JSON.parse(storedUser);
          this.isAuthenticated = true;
        } else {
          console.log('No user data found in localStorage.');
        }
      } catch (error) {
        console.error('Error during initialization:', error);
        this.user = null;
        this.isAuthenticated = false;
      }
    },
    async logout() {
      try {
        await axios.post('/logout/');
        console.log('Logout successful');
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        this.user = null;
        this.isAuthenticated = false;
      }
    },
  }
});