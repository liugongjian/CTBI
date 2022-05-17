/**
 * 控制 Loading
 */

export default {
  data: function () {
    return {
      showLoading: true,
      loading: false
    }
  },
  methods: {
    disableShowLoading () {
      const originShowLoading = this.showLoading
      this.showLoading = false
      return originShowLoading
    },
    resetShowLoading (originShowLoading = true) {
      this.showLoading = originShowLoading
    },
    setLoading () {
      if (this.showLoading) {
        this.loading = true
      }
    },
    resetLoading () {
      this.loading = false
    }
  }
}
