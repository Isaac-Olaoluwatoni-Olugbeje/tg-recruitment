const express = require ('express');
const authRoutes = require ('./routes/auth');
const registrationRoutes = require ('./routes/registration');
const verificationRoutes = require ('./routes/verification');
const productCreationRoutes = require ('./routes/product_creation');
const productSelectionRoutes = require ('./routes/product_selection');
const session = require('express-session');
const { authPlugins } = require('mysql2');

const app = express();
const port = 4000;

app.use(session({
  secret: 'excellent',
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/signup', authRoutes);
app.use('/login', authRoutes);
app.use('/logout', authRoutes);
app.use('/operator/login', authRoutes);
app.use('/admin/login', authRoutes);
app.use('/registration', registrationRoutes);
app.use('/operator', registrationRoutes);
app.use('/operator/:operatorId/user-picture', registrationRoutes);
app.use('/admin', registrationRoutes);
app.use('/verification', verificationRoutes);
app.use('/operator/verify/:operatorId', verificationRoutes);
app.use('/product_creation', productCreationRoutes);
app.use('/add', productCreationRoutes);
app.use('/product_selection', productSelectionRoutes);
app.use('/operator/:operatorId/products', productSelectionRoutes);
app.use('/operator/:operatorId/selections/:selectionId', productSelectionRoutes);
app.use('/products', productSelectionRoutes);

// Start Server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});