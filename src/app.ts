import 'reflect-metadata';
import { plainToClass } from "class-transformer"

import { Product } from "./product.model"
import { validate } from 'class-validator';

var products = [
    { "name": "oooo", "price": 12.2 },
    { "name": "uiiijij", "price": 19.2 }
]

var list = plainToClass(Product, products)


var prodqq = new Product("ll", 2.3)

validate(prodqq).then(error => {
    if (error.length > 0) {
        console.log("error")
    } else {
        console.log("ok")
    }
})



for (const prod of list) {
    console.log(prod.getInformation())
}