import mongoose, { Document, Model, Schema } from "mongoose";

interface faqItemInLayoutInterface extends Document {
    question: string;
    answer: string;
}

interface categoryInLayoutInterface extends Document{
    title: string;
}

interface bannerImageInLayoutInterface extends Document {
    public_id: string
    url: string
}

interface layoutInLayoutInterface  extends Document{
    type: string;
    faq: faqItemInLayoutInterface[];
    categories: categoryInLayoutInterface[];
    banner:{
        image: bannerImageInLayoutInterface;
        title: string;
        subTitle: string
    }

}


const faqSchema = new Schema<faqItemInLayoutInterface>({
    question: {type: String},
    answer: {type: String},
});


const categorySchema = new Schema<categoryInLayoutInterface>({
    title: {type: String},
})

const bannerImageSchema = new Schema<bannerImageInLayoutInterface>({
    public_id: {type: String},
    url: {type: String}
})

const layoutSchema = new Schema<layoutInLayoutInterface>({
    type: {type: String},
    faq: [faqSchema],
    categories: [categorySchema],
    banner:{
        image: bannerImageSchema,
        title: {title: String},
        subTitle: {type: String},
    },
}, {timestamps: true})

const LayoutModel: Model<layoutInLayoutInterface> = mongoose.model('Layout', layoutSchema)

export default LayoutModel;