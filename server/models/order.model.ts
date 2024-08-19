import mongoose, { Document, Model, Schema } from "mongoose";


export interface orderInterface extends Document{
    courseId: string;
    userId: string;
    payment_info: object;
}


const orderSchema = new Schema<orderInterface>({
    courseId: {
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    payment_info:{
        type: Object,
        // required: true
    },
},{timestamps: true}
)


const OrderModel: Model<orderInterface> = mongoose.model('Order', orderSchema);

export default OrderModel