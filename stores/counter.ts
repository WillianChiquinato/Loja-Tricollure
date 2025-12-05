
// stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Pinia Store'
  }),
  
  getters: {
    doubleCount: (state) => state.count * 2,
    greeting: (state) => `Hello from ${state.name}`
  },
  
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    reset() {
      this.count = 0
    }
  }
})
