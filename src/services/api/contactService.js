const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const contactService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "last_contact_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await apperClient.fetchRecords("contact_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "last_contact_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await apperClient.getRecordById("contact_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(contactData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: contactData.name || contactData.Name,
        email_c: contactData.email || contactData.email_c,
        phone_c: contactData.phone || contactData.phone_c,
        company_c: contactData.company || contactData.company_c,
        notes_c: contactData.notes || contactData.notes_c,
        Tags: contactData.tags || contactData.Tags,
        last_contact_date_c: contactData.lastContactDate || contactData.last_contact_date_c,
        created_at_c: new Date().toISOString()
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord("contact_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create contact records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: contactData.name || contactData.Name,
        email_c: contactData.email || contactData.email_c,
        phone_c: contactData.phone || contactData.phone_c,
        company_c: contactData.company || contactData.company_c,
        notes_c: contactData.notes || contactData.notes_c,
        Tags: contactData.tags || contactData.Tags,
        last_contact_date_c: contactData.lastContactDate || contactData.last_contact_date_c
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord("contact_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update contact records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("contact_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete contact records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "last_contact_date_c" } },
          { field: { Name: "created_at_c" } }
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
                    fieldName: "email_c",
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
                    fieldName: "phone_c",
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

      const response = await apperClient.fetchRecords("contact_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching contacts:", error?.response?.data?.message || error);
      return [];
    }
  }
};