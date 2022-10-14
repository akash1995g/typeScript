import 'reflect-metadata';
import { plainToClass } from "class-transformer"
import { Product } from "./product.model"

var products = [
    { "name": "oooo", "price": 12.2 },
    { "name": "uiiijij", "price": 19.2 }
]

var list = plainToClass(Product, products)



// var prod = new Product("jjjj", 2.3)


for (const prod of list) {
    console.log(prod.getInformation())
}