// let refreshTokenExpirationTimer = null;

// const setExpirationTimer = (timeoutMinutes, user) => {
//     const timeoutMilliseconds = timeoutMinutes * 60 * 1000; // Convert minutes to milliseconds
//     if (refreshTokenExpirationTimer) {
//         clearTimeout(refreshTokenExpirationTimer.timer);
//     }
//     const expirationTime = Date.now() + timeoutMilliseconds;
//     refreshTokenExpirationTimer = {
//         timer: setTimeout(() => {
//              console.log(`Refresh token expired for user: ${user.username}`);
//             refreshTokenExpirationTimer = null;
//         }, timeoutMilliseconds),
//         expirationTime
//     };
// };

// const getExpirationTime = () => {
//     if (!refreshTokenExpirationTimer) return null;
//     if (Date.now() >= refreshTokenExpirationTimer.expirationTime) {
//         refreshTokenExpirationTimer = null;
//         return null;
//     }
//     return refreshTokenExpirationTimer.expirationTime;
// };

// module.exports = {
//     setExpirationTimer,
//     getExpirationTime
// };
