import api from "./api.js"

// ---------- AUTH ----------
export const employeeLogin = (data) =>
    api.post("/admin/employee-login", data)

// ---------- PROFILE ----------
export const getProfile = () =>
    api.get("/employee/profile")

export const updateProfile = (data) =>
    api.put("/employee/profile", data)

export const changePassword = (data) =>
    api.put("/employee/change-password", data)

// ---------- DOCUMENTS ----------
export const submitDocument = (payload) => {
    if (payload instanceof FormData) {
        return api.post("/employee/documents", payload, {
            headers: { "Content-Type": "multipart/form-data" }
        })
    }
    return api.post("/employee/documents", payload)
}

export const myDocuments = (params) =>
    api.get("/employee/documents", { params })

export const documentStatus = (id) =>
    api.get(`/employee/documents/${id}`)

// ---------- NOTIFICATIONS ----------
export const myNotifications = (params) =>
    api.get("/employee/notifications", { params })

export const markNotificationRead = (id) =>
    api.patch(`/employee/notifications/${id}/read`)

export const markAllNotificationsRead = () =>
    api.patch("/employee/notifications/read-all")