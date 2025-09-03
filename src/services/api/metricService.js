const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const metricService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "label_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "change_c" } },
          { field: { Name: "trend_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.fetchRecords("metric_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching metrics:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getDashboardMetrics() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "label_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "change_c" } },
          { field: { Name: "trend_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("metric_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error?.response?.data?.message || error);
      return [];
}
  }
};