const mongoose = require('mongoose');
require('dotenv');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected.');
        
    } catch (error) {
        console.error(error);
        throw new Error('Error a la hora de iniciar la base de datos')
    }
}


module.exports = {
    dbConnection
}