import axios from 'axios';
import { create } from 'zustand';

const useStore = create((set) => ({
  revenueGraphData: null,
  revenueSampleData: null,
  collectionData: null,
  collection2Data: null,
  collection2GraphData: null,
  sortByRefData: null,
  sortByRefAgingData: null,
  reloadTc: null,
  requestBody: {},
  AgingRequestBody: {},
  ExpenseRequestBody: {},
  ExpenseReportRequestBody: {},
  CancellationReportRequestBody: {},
  userDetails: {},

  collection1RequestBody: {},
  collection2RequestBody: {},
  collection2GraphRequestBody: {},

  updateUserDetails: async (newUserDetails) => {
    set({ userDetails: newUserDetails });
    //console.log('User details updated:', newUserDetails);
  },

  updateCollection1RequestBody: async(newRequestBody) => {
    const updatedRequestBody = Object.fromEntries(
      Object.entries(newRequestBody).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])
    );
   // console.log('Updated collection1RequestBody:', updatedRequestBody);
    set({collection1RequestBody: updatedRequestBody});
    await useStore.getState().fetchCollection1Data();
  },

  updateRequestBody: async (newRequestBody) => {
    const updatedRequestBody = Object.fromEntries(
      Object.entries(newRequestBody).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])
    );

    set({ requestBody: updatedRequestBody });
    await useStore.getState().fetchRevenueGraphData();
    await useStore.getState().fetchRevenueSampleData();
   // console.log('Updated requestBody:', updatedRequestBody);
  },

  updateAgingRequestBody: async (newRequestBody) => {
    const updatedAgingRequestBody = Object.fromEntries(
      Object.entries(newRequestBody).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])
    );

    set({ AgingRequestBody: updatedAgingRequestBody });
    console.log('Updated requestBody:', updatedAgingRequestBody);
  },

  updateExpenseRequestBody: async (newRequestBody) => {
    const updatedExpenseRequestBody = Object.fromEntries(
      Object.entries(newRequestBody).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])
    );

    set({ ExpenseRequestBody: updatedExpenseRequestBody });
    console.log('Updated Expense requestBody:', updatedExpenseRequestBody);
  },

  updateExpenseReportRequestBody: async (newRequestBody) => {
    const updatedExpenseReportRequestBody = Object.fromEntries(
      Object.entries(newRequestBody).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])
    );

    set({ ExpenseReportRequestBody: updatedExpenseReportRequestBody });
    console.log('Updated Expense Report requestBody:', updatedExpenseReportRequestBody);
  },

  updateCancellationReportRequestBody: async (newRequestBody) => {
    const updatedCancellationReportRequestBody = Object.fromEntries(
      Object.entries(newRequestBody).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])
    );

    set({ CancellationReportRequestBody: updatedCancellationReportRequestBody });
    console.log('Updated Cancellation Report requestBody:', updatedCancellationReportRequestBody);
  },

  updateSortByRefBody: async (newRequestBody) => {
    set({ sortByRefData: newRequestBody });
    console.log('sortByRefData updated:', newRequestBody);
  },

  updateSortByAgingRefBody: async (newRequestBody) => {
    set({ sortByRefAgingData: newRequestBody });
    console.log('sortByRefAgingData updated:', newRequestBody);
  },

  updateTablec: async (newRequestBody) => {
    set({ reloadTc: newRequestBody });
    //console.log('tableC updated:', newRequestBody);
  },

  updateCollection2RequestBody: async(newRequestBody) => {
    const updatedRequestBody = Object.fromEntries(
      Object.entries(newRequestBody).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])
    );
    console.log('Updated collection2RequestBody:', updatedRequestBody);
    set({collection2RequestBody: updatedRequestBody});
  //  await useStore.getState().fetchCollection2Data();
  },

  updateCollection2GraphRequestBody: async (newRequestBody) => {
    const updatedRequestBody = Object.fromEntries(
      Object.entries(newRequestBody).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(',') : value,
      ])
    );
    console.log('Updated collection2GraphRequestBody:', updatedRequestBody);
    set({ collection2GraphRequestData: updatedRequestBody });
    await useStore.getState().fetchCollection2GraphData();
  },

  fetchRevenueSampleData: async () => {
    try {
      const { requestBody } = useStore.getState();
      const response = await axios.post('https://aarnainfra.com/ladder2/client/expense/revenue2.php' , requestBody);
      set({ revenueSampleData: response.data });
   //   console.log(response.data);
    } catch (error) {
      console.error('Error fetching data from revenueSampleData:', error);
    }
  },

  fetchRevenueGraphData: async () => {
    try {
      const { requestBody } = useStore.getState();
      const response = await axios.post('https://aarnainfra.com/ladder2/client/expense/revenueGraphFilter.php', requestBody);
      //console.log(response.data);
      set({ revenueGraphData: response.data }); 
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  },

  fetchCollection1Data: async () => {
    try {
      const { collection1RequestBody } = useStore.getState();
  
      // Check if collection1RequestBody is not empty
      const hasRequestBody = Object.keys(collection1RequestBody).length !== 0;
  
      const response = await axios.post(
        'https://aarnainfra.com/ladder2/client/collections/collection1.php',
        hasRequestBody ? collection1RequestBody : null
      );
  
      //console.log(response.data);
      set({ collectionData: response.data });
    } catch (error) {
      console.error('Error fetching data from collection1 API:', error);
    }
  },

  fetchCollection2Data: async () => {
    try{
      const { collection2RequestBody } = useStore.getState();

      // Check if collection2RequestBody is not empty
      const hasRequestBody = Object.keys(collection2RequestBody).length !== 0;

      const response = await axios.post(
        'https://aarnainfra.com/ladder2/client/collections/collection2.php',
        hasRequestBody ? collection2RequestBody : null
      );

      console.log(response.data);
      set({ collection2Data: response.data });
    }
    catch (error) {
      console.error('Error fetching data from collection2 API:', error);
    }
  },

  fetchCollection2GraphData: async () => {
          try{
            const { collection2GraphRequestBody } = useStore.getState();
            // Check if collection2RequestBody is not empty
            const hasRequestBody = Object.keys(collection2GraphRequestBody).length !== 0;
          
            const response = await axios.post(
              'https://aarnainfra.com/ladder2/client/collections/collectiongraph.php',
              hasRequestBody ? collection2GraphRequestBody : null
            );
            
            console.log(response.data);
            set({ collection2GraphData: response.data });
        }
        catch (error) {
          console.error('Error fetching data from collection graph 2 API:', error);
        }
  },

  resetAndFetchData: async () => {
    set({ requestBody: null }); 
    set({ AgingRequestBody: null });
    set({ collection1RequestBody: null });
    set({ collection2RequestBody: null });
    set({ ExpenseRequestBody: null});
    await get().fetchRevenueSampleData(); 
    await get().fetchRevenueGraphData(); 
    await get().updateRequestBody();
    await get().fetchCollection1Data();   
    await get().updateCollection1RequestBody();
    await get().fetchCollection2Data();
  },

}));

export default useStore;
