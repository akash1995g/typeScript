import { IsNotEmpty, IsNumber, IsPositive } from "class-validator"

export class Product {

    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsPositive()
    price: number
    constructor(name: string, price: number) {
        this.name = name
        this.price = price
    }

    getInformation() {
        return [this.name, `$${this.price}`]
    }
}