import { create } from 'zustand';

export const useJobStore = create((set) => ({
  searchQuery: '',
  selectedCity: 'All India',
  selectedJobType: 'All',
  selectedWorkMode: 'All',
  selectedCategory: 'All',
  isWalkinOnly: false,
  isVerifiedOnly: false,
  minSalary: '',
  experience: 'All',

  // Geospatial Map State
  userCoordinates: null,
  mapRadiusKm: 25,
  selectedMapJob: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedJobType: (type) => set({ selectedJobType: type }),
  setSelectedWorkMode: (mode) => set({ selectedWorkMode: mode }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setIsWalkinOnly: (val) => set({ isWalkinOnly: val }),
  setIsVerifiedOnly: (val) => set({ isVerifiedOnly: val }),
  setMinSalary: (val) => set({ minSalary: val }),
  setExperience: (exp) => set({ experience: exp }),
  setMapRadiusKm: (radius) => set({ mapRadiusKm: radius }),
  setUserCoordinates: (coords) => set({ userCoordinates: coords }),
  setSelectedMapJob: (job) => set({ selectedMapJob: job }),

  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCity: 'All India',
      selectedJobType: 'All',
      selectedWorkMode: 'All',
      selectedCategory: 'All',
      isWalkinOnly: false,
      isVerifiedOnly: false,
      minSalary: '',
      experience: 'All',
    }),
}));
