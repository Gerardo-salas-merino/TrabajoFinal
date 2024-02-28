const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Cart = require('./Cart');
const Purchase = require('./Purchase');
const ProductImg = require('./ProductImg');



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

// purchase -> userId
Purchase.belongsTo(User)
User.hasMany(Purchase)

// purchase => productOd
Purchase.belongsTo(Product)
Product.hasMany(Purchase)


// productImg -> productId
// una imagen de producto pertenece a un producto
ProductImg.belongsTo(Product)
// un producto tiene muchas imagenes
Product.hasMany(ProductImg)



