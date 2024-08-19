import mongoose, { Document, Model, Schema } from "mongoose";


export interface notificationInterface extends Document {
    title: string;
    message: string;
    status: string;
    userId: string
}

const notificationSchema = new Schema<notificationInterface>({
    title:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: "unread"
    },
},{timestamps: true})

const NotificationModel: Model<notificationInterface> = mongoose.model(
    "Notification", notificationSchema
)

export default NotificationModel