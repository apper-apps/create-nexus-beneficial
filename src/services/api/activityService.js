const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Mock tasks for now since activities manage both activities and tasks
let tasks = [
  {
    Id: 1,
    contactId: 1,
    type: "call",
    title: "Follow-up on pricing discussion",
    description: "Call to discuss revised pricing structure",
    dueDate: "2024-01-17T14:00:00Z",
    priority: "high",
    status: "pending"
  },
  {
    Id: 2,
    contactId: 2,
    type: "meeting",
    title: "Product demo presentation",
    description: "Present updated product features and capabilities",
    dueDate: "2024-01-16T10:30:00Z",
    priority: "high",
    status: "pending"
  },
  {
    Id: 3,
    contactId: 3,
    type: "email",
    title: "Send integration timeline",
    description: "Email detailed integration timeline and milestones",
    dueDate: "2024-01-15T09:00:00Z",
    priority: "medium",
    status: "pending"
  }
];

export const activityService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "outcome_c" } },
          { field: { Name: "next_steps_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getTasks() {
    // Return mock tasks sorted by due date
    return [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  async getByContactId(contactId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "outcome_c" } },
          { field: { Name: "next_steps_c" } }
        ],
        where: [
          {
            FieldName: "contact_id_c",
            Operator: "EqualTo",
            Values: [parseInt(contactId)],
            Include: true
          }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by contact:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(activityData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: activityData.description || activityData.Name || 'Activity',
        contact_id_c: parseInt(activityData.contactId || activityData.contact_id_c),
        type_c: activityData.type || activityData.type_c,
        description_c: activityData.description || activityData.description_c,
        date_c: new Date().toISOString(),
        outcome_c: activityData.outcome || activityData.outcome_c,
        next_steps_c: activityData.nextSteps || activityData.next_steps_c
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create activity records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async createTask(taskData) {
    // Add task to mock tasks array
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      contactId: parseInt(taskData.contactId),
      status: "pending",
      createdDate: new Date().toISOString()
    };
    tasks.unshift(newTask);
    return { ...newTask };
  },

  async completeTask(taskId, completionData) {
    try {
      const taskIndex = tasks.findIndex(t => t.Id === parseInt(taskId));
      if (taskIndex === -1) {
        throw new Error("Task not found");
      }

      const task = tasks[taskIndex];
      
      // Create activity from completed task
      const activityData = {
        Name: task.title,
        contact_id_c: task.contactId,
        type_c: task.type,
        description_c: task.description,
        outcome_c: completionData.outcome,
        next_steps_c: completionData.nextSteps,
        date_c: new Date().toISOString()
      };

      const completedActivity = await this.create(activityData);

      // Create follow-up task if specified
      if (completionData.followUpDate && completionData.followUpType) {
        const followUpTask = {
          Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
          contactId: task.contactId,
          type: completionData.followUpType,
          title: `Follow-up: ${task.title}`,
          description: completionData.nextSteps || "Follow-up task",
          dueDate: completionData.followUpDate,
          priority: task.priority,
          status: "pending",
          createdDate: new Date().toISOString()
        };
        tasks.unshift(followUpTask);
      }

      // Remove completed task
      tasks.splice(taskIndex, 1);

      return { activity: completedActivity, task: null };
    } catch (error) {
      console.error("Error completing task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async updateTask(taskId, updateData) {
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(taskId));
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updateData,
      contactId: parseInt(updateData.contactId || tasks[taskIndex].contactId),
      updatedDate: new Date().toISOString()
    };

    return { ...tasks[taskIndex] };
  },

  async deleteTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(taskId));
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    tasks.splice(taskIndex, 1);
    return true;
  },

  async getRecent(limit = 10) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "outcome_c" } },
          { field: { Name: "next_steps_c" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent activities:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getTasksByContactId(contactId) {
    return tasks
      .filter(task => task.contactId === parseInt(contactId))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  async getOverdueTasks() {
    const now = new Date();
    return tasks
      .filter(task => new Date(task.dueDate) < now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  async search(query) {
    try {
      if (!query.trim()) {
        return await this.getAll();
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "outcome_c" } },
          { field: { Name: "next_steps_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "description_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "outcome_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "next_steps_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "type_c",
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

      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching activities:", error?.response?.data?.message || error);
      return [];
    }
  }
};