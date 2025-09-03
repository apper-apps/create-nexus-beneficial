const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const companyService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "employees_c" } },
          { field: { Name: "revenue_c" } },
          { field: { Name: "founded_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.fetchRecords("company_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "employees_c" } },
          { field: { Name: "revenue_c" } },
          { field: { Name: "founded_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById("company_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(companyData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: companyData.name || companyData.Name,
        industry_c: companyData.industry || companyData.industry_c,
        website_c: companyData.website || companyData.website_c,
        address_c: companyData.address || companyData.address_c,
        phone_c: companyData.phone || companyData.phone_c,
        email_c: companyData.email || companyData.email_c,
        employees_c: parseInt(companyData.employees || companyData.employees_c || 0),
        revenue_c: parseFloat(companyData.revenue || companyData.revenue_c || 0),
        founded_c: companyData.founded || companyData.founded_c || new Date().toISOString().split('T')[0],
        description_c: companyData.description || companyData.description_c
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord("company_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create company records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, companyData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: companyData.name || companyData.Name,
        industry_c: companyData.industry || companyData.industry_c,
        website_c: companyData.website || companyData.website_c,
        address_c: companyData.address || companyData.address_c,
        phone_c: companyData.phone || companyData.phone_c,
        email_c: companyData.email || companyData.email_c,
        employees_c: parseInt(companyData.employees || companyData.employees_c || 0),
        revenue_c: parseFloat(companyData.revenue || companyData.revenue_c || 0),
        founded_c: companyData.founded || companyData.founded_c,
        description_c: companyData.description || companyData.description_c
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord("company_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update company records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("company_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete company records:${JSON.stringify(failedRecords)}`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error);
      return false;
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
          { field: { Name: "industry_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "description_c" } }
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
                    fieldName: "industry_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "website_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "description_c",
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

      const response = await apperClient.fetchRecords("company_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching companies:", error?.response?.data?.message || error);
      return [];
    }
  },

  getContactCount: (companyId) => {
    // This would typically come from contactService aggregation
    // For now, return a mock count based on company ID
    return Math.floor(Math.random() * 20) + 1;
  },

  getTotalDealValue: (companyId) => {
    // This would typically come from dealService aggregation
    // For now, return a mock value based on company ID
    return Math.floor(Math.random() * 1000000) + 50000;
  }
};