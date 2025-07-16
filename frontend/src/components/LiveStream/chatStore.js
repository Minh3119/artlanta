import { create } from 'zustand'

const ChatStore = create((set, get) => ({
    socket: null,
    messages: [],
    isConnected: false,

    connect: (ID) => {
        if (get().socket) return;

        const socket = new WebSocket(`ws://localhost:9999/backend/api/live/chat?ID=${ID}`)

        socket.onopen = () => {
            console.log("WebSocket connected to ID:", ID)
            set({ isConnected: true })
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            const message = {
                Username: data.Username,
                Message: data.Message,
            }
            set((state) => ({
                messages: [...state.messages, message],
            }))
        }

        socket.onclose = () => {
            console.log("WebSocket disconnected")
            set({ isConnected: false, socket: null })
        }

        socket.onerror = (err) => {
            console.error("WebSocket error:", err)
        }

        set({ socket })
    },

    sendMessage: (text) => {
        const socket = get().socket
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(text)
        }
    },

    disconnect: () => {
        const socket = get().socket
        if (socket) {
            socket.close()
            set({ socket: null, isConnected: false })
        }
    },

    clearMessages: () => set({ messages: [] }),
}))

export default ChatStore