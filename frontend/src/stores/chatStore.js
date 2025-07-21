// import { create } from 'zustand';

// const useAuctionStore = create((set, get) => ({
//     socket: null,
//     auctionData: {
//         timeLeft: null,
//         currentBid: null,
//         highestBidder: null,
//     },
//     messages: [],

//     setSocket: (socketInstance) => set({ socket: socketInstance }),

//     setAuctionData: (newData) => {
//         set((state) => ({
//             auctionData: { ...state.auctionData, ...newData }
//         }));
//     },

//     addMessage: (message) => {
//         set((state) => ({
//             messages: [...state.messages, message]
//         }));
//     },

//     clearMessages: () => set({ messages: [] }),

//     sendMessage: (msgText) => {
//         const socket = get().socket;
//         if (socket && socket.readyState === WebSocket.OPEN) {
//             socket.send(msgText);
//         }
//     },

//     connectWebSocket: (ID) => {
//         const socket = new WebSocket(`ws://localhost:9999/backend/api/live/chat?ID=${ID}`);
//         socket.onopen = () => {
//             console.log("Connected to WS", ID);
//             get().setSocket(socket);
//         };
//         socket.onmessage = (event) => {
//             const data = JSON.parse(event.data);

//             if (data.Type === "Chat") {
//                 get().addMessage({
//                     Username: data.Username,
//                     Message: data.Message
//                 });
//             } else if (data.Type === "Bid") {
//                 get().setAuctionData({
//                     currentBid: data.Price,
//                     highestBidder: data.Username
//                 });
//             } else if (data.Type === "TimeLeftUpdate") {
//                 get().setAuctionData({ timeLeft: data.timeLeft });
//             }
//         };
//         socket.onclose = () => {
//             console.log("WS Closed");
//         };
//         socket.onerror = (err) => {
//             console.error("WS Error:", err);
//         };
//     }
// }));

// export default useAuctionStore;
