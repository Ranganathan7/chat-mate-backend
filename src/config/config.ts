export const config = () => ({
    port: parseInt(process.env.PORT) || 5000,
    dbURL: process.env.DB_URL
})