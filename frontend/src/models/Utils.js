import { useAuthStore } from '@/stores/auth.store.js'

function request(method) {
    return (url, body, { credentials } = {}) => {
        const requestOptions = {
            method,
            headers: authHeader(url)
        }
        if (body) {
            requestOptions.headers['Content-Type'] = 'application/json'
            requestOptions.body = JSON.stringify(body)
        }
        if (credentials) {
            requestOptions.credentials = credentials
        }
        return fetch(url, requestOptions).then(handleResponse)
    }
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const { user } = useAuthStore()
    const isLoggedIn = !!user?.jwtToken
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL)
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.jwtToken}` }
    } else {
        return {}
    }
}

function handleResponse(response) {
    return response.text().then((text) => {
        const data = text && JSON.parse(text)

        if (!response.ok) {
            const { user, logout } = useAuthStore()
            if ([401, 403].includes(response.status) && user) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                logout()
            }

            const error = (data && data.message) || response.statusText
            return Promise.reject(error)
        }

        return data
    })
}

export default {
    outputDelay: function (item) {
        const advertised = new Date(item.AdvertisedTimeAtLocation)
        const estimated = new Date(item.EstimatedTimeAtLocation)
        const diff = Math.abs(estimated - advertised)

        return Math.floor(diff / (1000 * 60)) + ' minuter'
    },

    fetchWrapper: {
        get: request('GET'),
        post: request('POST'),
        put: request('PUT'),
        delete: request('DELETE')
    }
}
