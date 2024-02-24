const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Cart = require('./Cart');


// Relacion (1, *)

// Un producto pertenece a muchas categorias 
Product.belongsTo(Category) 
// Una categoria tiene muchos productos
Category.hasMany(Product)



// Cart -> userId
Cart.belongsTo(User)
User.hasMany(Cart)

// Cart ->  ProductId
Cart.belongsTo(Product)
Product.hasMany(Cart)