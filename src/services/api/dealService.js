const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const dealService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "company_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "expected_close_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await apperClient.fetchRecords("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "company_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "expected_close_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById("deal_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || 'Deal not found');
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || 'Deal not found');
    }
  },

  async create(dealData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: dealData.name || dealData.Name,
        company_c: dealData.company || dealData.company_c,
        value_c: parseFloat(dealData.value || dealData.value_c || 0),
        stage_c: dealData.stage || dealData.stage_c || 'Lead',
        expected_close_date_c: dealData.expectedCloseDate || dealData.expected_close_date_c,
        created_at_c: new Date().toISOString()
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create deal records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, dealData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: dealData.name || dealData.Name,
        company_c: dealData.company || dealData.company_c,
        value_c: parseFloat(dealData.value || dealData.value_c || 0),
        stage_c: dealData.stage || dealData.stage_c,
        expected_close_date_c: dealData.expectedCloseDate || dealData.expected_close_date_c
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update deal records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete deal records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async search(query) {
    try {
      if (!query.trim()) {
        return await this.getAll();
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "company_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "company_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "stage_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching deals:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByStage(stage) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "company_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "expected_close_date_c" } }
        ],
        where: [
          {
            FieldName: "stage_c",
            Operator: "EqualTo",
            Values: [stage],
            Include: true
          }
        ]
      };

      const response = await apperClient.fetchRecords("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by stage:", error?.response?.data?.message || error);
      return [];
    }
  }
};

export { dealService };

export { dealService };