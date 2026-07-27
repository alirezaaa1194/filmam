export const __Api = async (
  url: string,
  options: { method: string },
  retry = true
) => {
//   return fetch(url, {
//     ...options,
//     headers: {
//       'content-type': 'application/json',
//       Authorization: `Bearer token`,
//     },
//   }).then((response) => {
//     if (response.status === 401 && retry) {
//       return fetch(refreshApi, {
//         method: 'POST',
//         headers: { 'content-type': 'application/json' },
//       }).then((refreshResponse) => {
//         if (refreshResponse.ok) {
//           //save the new token to local storage or state management

//           // Retry the original request after refreshing the token
//           return __Api(url, options, false)
//         } else {
//           // logout(); // Handle logout if refresh fails
//           return refreshResponse
//         }
//       })
//     } else if (response.status === 401 && !retry) {
//       // logout(); // Handle logout if refresh fails
//       return response
//     }
//     return response
//   })
}
